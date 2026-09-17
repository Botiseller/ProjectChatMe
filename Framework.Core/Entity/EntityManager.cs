using Framework.Core.IEntity;
using Framework.Core.Unity;
using MaxMind.GeoIP2;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection;
using Unity;

namespace Framework.Core.Entity
{
    public abstract class EntityManager<TEntity, TObjectContext>
        where TEntity : class
        where TObjectContext : DbContext, new()
    {

        public int gmtUser = 0;
        /// <summary>
        /// ContextManager
        /// </summary>
        [Dependency]
        public IEntityContextManager ContextManager
        {
            get
            {
                return UnityFactoryClass.Resolve<IEntityContextManager>();
            }
            set { }
        }

        /// <summary>
        /// Context
        /// </summary>
        public TObjectContext Context
        {
            get
            {
                var context = ContextManager.GetContext<TObjectContext>();
                context.Configuration.LazyLoadingEnabled = false;
                context.Configuration.ProxyCreationEnabled = false;
                return context;
            }
        }

        /// <summary>
        /// Context
        /// </summary>
        // ReSharper disable InconsistentNaming
        public IObjectContextAdapter ContextAdapter
        // ReSharper restore InconsistentNaming
        {
            get
            {
                var context = ContextManager.GetContext<TObjectContext>() as IObjectContextAdapter;
                if (context != null)
                {
                    context.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
                    context.ObjectContext.ContextOptions.ProxyCreationEnabled = false;
                }

                return context;
            }
        }

        /// <summary>
        /// GetEntitySetName
        /// </summary>
        /// <returns>setName</returns>
        public string GetEntitySetName()
        {
            var className = typeof(TEntity).Name;
            var container =
                ContextAdapter.ObjectContext.MetadataWorkspace.GetEntityContainer(
                    ContextAdapter.ObjectContext.DefaultContainerName, DataSpace.CSpace);
            var setName = (from meta in container.BaseEntitySets
                           where meta.ElementType.Name == className
                           select meta.Name).First();
            return container.Name + "." + setName;
        }

        /// <summary>
        /// Insert entity in DB.
        /// </summary>
        /// <param name="entity">The entity to create.</param>
        /// <typeparam name="TEntity">Entity Type</typeparam>
        public virtual TEntity Insert(TEntity entity)
        {
            entity = Context.Set<TEntity>().Add(entity);
            return entity;
        }

        /// <summary>
        /// Create multiple entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        /// <typeparam name="TEntity">Entity Type</typeparam>
        public void InsertMultiple(IList<TEntity> entities)
        {
            if (entities == null || entities.Count == 0)
            {
                return;
            }

            var set = Context.Set<TEntity>();

            foreach (var entity in entities)
            {
                set.Add(entity);
            }
        }

        /// <summary>
        /// Save Changes.
        /// </summary>
        public void SaveChanges()
        {
            ContextAdapter.ObjectContext.SaveChanges();
        }

        /// <summary>
        /// Deletes an entity
        /// </summary>
        /// <param name="entity">Entity</param>
        public void Delete(TEntity entity)
        {
            ContextAdapter.ObjectContext.DeleteObject(entity);
        }

        /// <summary>
        /// DeleteMultiple an entity
        /// </summary>
        /// <param name="entities">Entity</param>
        public void DeleteMultiple(IList<TEntity> entities)
        {
            if (entities == null || entities.Count == 0)
            {
                return;
            }

            entities.ToList().ForEach(e => (Context.Set<TEntity>()).Remove(e));
        }

        /// <summary>
        /// Deletes an entity
        /// </summary>
        /// <param name="entity">Entity</param>
        public virtual void Update(TEntity entity)
        {
            if (!(ContextAdapter.ObjectContext.ObjectStateManager.TryGetObjectStateEntry(entity, out ObjectStateEntry stateEntry)) || stateEntry.State == EntityState.Detached)
            {
                ContextAdapter.ObjectContext.AttachTo(GetEntitySetName(), entity);
            }

            ContextAdapter.ObjectContext.ObjectStateManager.ChangeObjectState(entity, EntityState.Modified);
        }


        /// <summary>
        /// Update multiple entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        /// <typeparam name="TEntity">Entity Type</typeparam>
        public void UpdateMultiple(IList<TEntity> entities)
        {
            if (entities == null || entities.Count == 0)
            {
                return;
            }

            foreach (var entity in entities)
            {
                var stateEntry = ContextAdapter.ObjectContext.ObjectStateManager.GetObjectStateEntry(entity);
                if (stateEntry.State == EntityState.Detached)
                    ContextAdapter.ObjectContext.AttachTo(GetEntitySetName(), entity);
                ContextAdapter.ObjectContext.ObjectStateManager.ChangeObjectState(entity, EntityState.Modified);
            }
        }

        /// <summary>
        /// Gets list containing all items of an entity
        /// </summary>
        /// <returns></returns>
        public virtual IList<TEntity> ListAll()
        {
            ContextAdapter.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
            ContextAdapter.ObjectContext.ContextOptions.ProxyCreationEnabled = false;
            return ContextAdapter.ObjectContext.CreateObjectSet<TEntity>().ToList();
        }

        /// <summary>
        /// Gets list containing filtering items of an entity
        /// </summary>
        /// <returns></returns>
        public IList<TEntity> ListByFilter(Func<TEntity, bool> predicate)
        {
            ContextAdapter.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
            ContextAdapter.ObjectContext.ContextOptions.ProxyCreationEnabled = false;
            return ContextAdapter.ObjectContext.CreateObjectSet<TEntity>().Where(predicate).ToList();
        }

        /// <summary>
        /// Gets list containing all items of an entity
        /// Including selected relations
        /// </summary>
        /// <returns></returns>
        public virtual IList<TEntity> ListAllIncluding(params string[] relations)
        {
            var set = ContextAdapter.ObjectContext.CreateObjectSet<TEntity>();

            foreach (var relation in relations)
            {
                foreach (var data in set)
                {
                    var type = typeof(TEntity);
                    var relProp = type.GetProperty(relation);
                    var loadMethod = relProp.PropertyType.GetMethod(Resource.EntityLoadMethod, new Type[0]);
                    var instance = relProp.GetValue(data, null);
                    loadMethod.Invoke(instance, null);
                }
            }
            return set.ToList();
        }

        /// <summary>
        /// GetByIdIncluding
        /// </summary>
        /// <param name="id">id</param>
        /// <param name="relations">Relaciones a cargar</param>
        /// <returns>TEntity</returns>
        public TEntity GetByIdIncluding(int id, params string[] relations)
        {
            var data = GetById(id);
            var type = typeof(TEntity);

            foreach (var relation in relations)
            {
                var relProp = type.GetProperty(relation);
                var loadMethod = relProp.PropertyType.GetMethod(Resource.EntityLoadMethod, new Type[0]);
                var instance = relProp.GetValue(data, null);
                loadMethod.Invoke(instance, null);
            }

            return data;
        }




        

        /// <summary>
        /// Gets an object by key
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>TEntity</returns>
        public virtual TEntity GetById(object id)
        {
            var context = ContextManager.GetContext<TObjectContext>() as IObjectContextAdapter;
            context.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
            context.ObjectContext.ContextOptions.ProxyCreationEnabled = false;
            var key = new EntityKey(GetEntitySetName(), new[] { new KeyValuePair<string, object>(Resource.IdField, id) });

            TEntity entity;
            try
            {
                entity = (TEntity)context.ObjectContext.GetObjectByKey(key);
            }
            catch (ObjectNotFoundException)
            {
                throw new Exception(Resource.ErrorRegistroNoEncontrado);
            }

            return entity;
        }

        /// <summary>
        /// Gets an object by his composed key
        /// </summary>
        /// <param name="entityKeyValues">collection of keyValue pairs with the key value</param>
        /// <returns>TEntity</returns>
        public virtual TEntity GetByKey(IEnumerable<KeyValuePair<string, object>> entityKeyValues)
        {
            var key = new EntityKey(GetEntitySetName(), entityKeyValues);
            var context = ContextManager.GetContext<TObjectContext>() as IObjectContextAdapter;
            context.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
            context.ObjectContext.ContextOptions.ProxyCreationEnabled = false;
            return (TEntity)context.ObjectContext.GetObjectByKey(key);
        }

        /// <summary>
        /// Devuelve los valores de una enumeracion
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns>Devuelve un array con los valores dentro de una enumeracion especificada.</returns>
        public static T[] GetValuesEnums<T>()
        {
            var enumType = typeof(T);

            if (!enumType.IsEnum)
            {
                throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, Resource.EnumError, enumType.Name));
            }

            var fields = from field in enumType.GetFields()
                         where field.IsLiteral
                         select field;

            return fields.Select(field => field.GetValue(enumType)).Select(value => (T)value).ToArray();
        }

        public virtual TEntity GetByIdIncluding(object id, params Expression<Func<TEntity, object>>[] path)
        {
            var relations = new string[path.Length];

            for (var i = 0; i < path.Length; i++)
            {
                relations[i] = path[i].Name;
            }

            return GetByIdIncluding((int)id, relations);
        }


        public Guid GetUserBySession()
        {
            string userId = ((Common.Services.Interceptor.CustomIdentity)(System.Threading.Thread.CurrentPrincipal.Identity)).IdUser;

            return new Guid(userId);
        }

        public string GetActiveFamily()
        {
            return ((Common.Services.Interceptor.CustomIdentity)(System.Threading.Thread.CurrentPrincipal.Identity)).Family;
        }

       
    }

    public static class ExtensionFunction
    {
        public static int CantidadFilas = 0;

        public static IQueryable<T> OrderByNameNew<T>(this IQueryable<T> source, string propertyName, bool isDescending)
        {
            if (source == null)
            {
                throw new ArgumentNullException("source");
            }

            if (propertyName == null)
            {
                throw new ArgumentNullException("propertyName");
            }

            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "x");

            PropertyInfo pi = type.GetProperty(propertyName);
            Expression expr = Expression.Property(arg, pi);
            type = pi.PropertyType;

            Type delegateType = typeof(Func<,>).MakeGenericType(typeof(T), type);
            LambdaExpression lambda = Expression.Lambda(delegateType, expr, arg);

            string methodName = isDescending ? "OrderByDescending" : "OrderBy";

            object result = typeof(Queryable).GetMethods().Single(
                method => method.Name == methodName
                        && method.IsGenericMethodDefinition
                        && method.GetGenericArguments().Length == 2
                        && method.GetParameters().Length == 2)
                .MakeGenericMethod(typeof(T), type)
                .Invoke(null, new object[] { source, lambda });

            CantidadFilas = source.Count();

            return (IQueryable<T>)result;
        }
    }
}