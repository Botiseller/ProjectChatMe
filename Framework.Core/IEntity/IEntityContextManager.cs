using System;

namespace Framework.Core.IEntity
{
    public interface IEntityContextManager : IDisposable
    {
        /// <summary>
        /// SaveChanges
        /// </summary>
        void SaveChanges();

        /// <summary>
        /// GetContext
        /// </summary>
        /// <typeparam name="T">Type</typeparam>
        /// <returns>Type</returns>
        T GetContext<T>(); 
    }
}