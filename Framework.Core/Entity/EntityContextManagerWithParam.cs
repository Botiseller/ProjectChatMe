using Framework.Core.IEntity;
using System;
using System.Data.Entity.Infrastructure;
using System.Runtime.Remoting.Messaging;
using System.Threading.Tasks;

namespace Framework.Core.Entity
{
    public abstract class EntityContextManagerWithParam<T> : IEntityContextManager where T : class, new()
    {
        /// <summary>
        /// Indicates if this instance is top most call.
        /// </summary>
        private readonly bool _isTopCallInstance;

        /// <summary>
        /// Initializes a new instance of the <see cref="IEntityContextManager"/> class.
        /// </summary>
        protected EntityContextManagerWithParam(string connectionString)
        {
            if (EntityContext != null) return;

            _isTopCallInstance = true;
            var constructorTypeSignature = new Type[] { typeof(string) };
            var constructorParameters = new object[] { connectionString };
            EntityContext = (T)new T().GetType().GetConstructor(constructorTypeSignature).Invoke(constructorParameters);
        }

        /// <summary>
        /// Gets or sets EntityContext.
        /// </summary>
        public T EntityContext
        {
            get { return (T)CallContext.GetData(Resource.ContextKey); }

            set { CallContext.SetData(Resource.ContextKey, value); }
        }

        #region IEntityContextManager Members

        /// <summary>
        /// Save all pending changes.
        /// </summary>
        public void SaveChanges()
        {
            if ((EntityContext) is IObjectContextAdapter objectContextAdapter)
                objectContextAdapter.ObjectContext.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            if ((EntityContext) is IObjectContextAdapter objectContextAdapter)
                await objectContextAdapter.ObjectContext.SaveChangesAsync();
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        /// <filterpriority>2</filterpriority>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// GetContext
        /// </summary>
        /// <typeparam name="TObject">Type</typeparam>
        /// <returns>Type</returns>
        public TObject GetContext<TObject>()
        {
            return (TObject)CallContext.GetData(Resource.ContextKey);
        }

        #endregion

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        /// <filterpriority>2</filterpriority>
        protected virtual void Dispose(bool allResources)
        {
            if (!_isTopCallInstance || EntityContext == null) return;

            if ((EntityContext) is IObjectContextAdapter objectContextAdapter)
                objectContextAdapter.ObjectContext.Dispose();
            CallContext.FreeNamedDataSlot(Resource.ContextKey);
        }
    }
}