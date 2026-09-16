using Microsoft.Practices.Unity;
using System.Data.Entity;
using Unity;

namespace Framework.Core.Entity
{
    public abstract class EntityServices<TEntity, TManager, TLogic, TObjectContext>
        where TObjectContext : DbContext, new()
        where TLogic : EntityLogic<TEntity, TManager, TObjectContext>
        where TEntity : class, new()
        where TManager : EntityManager<TEntity, TObjectContext>
    {
        /// <summary>
        /// Default Logic
        /// </summary>
        [Dependency]
        public TLogic DefaultLogic { set; get; }
    }
}