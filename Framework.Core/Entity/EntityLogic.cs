using Microsoft.Practices.Unity;
using System.Data.Entity;
using Unity;

namespace Framework.Core.Entity
{
    public abstract class EntityLogic<TEntity, TManager, TObjectContext>
        where TObjectContext : DbContext, new()
        where TEntity : class, new()
        where TManager : EntityManager<TEntity, TObjectContext>
    {
        /// <summary>
        /// Manager Reference
        /// </summary>
        [Dependency]
        public TManager DefaultManager { set; get; }
    }
}