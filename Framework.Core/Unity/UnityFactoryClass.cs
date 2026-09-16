using System;
using Unity;
using Unity.Resolution;


namespace Framework.Core.Unity
{
    public class UnityFactoryClass
    {
        /// <summary>
        /// Instancia un objeto de tipo T según la configuración de Unity
        /// </summary>
        /// <typeparam name="T">
        /// Type
        /// </typeparam>
        /// <returns>
        /// Type
        /// </returns>
        public static T Resolve<T>()
        {
            return (T)new UnityContainerClass().Instance.Resolve(typeof(T));
        }

        public static T Resolve<T>(string tipo, params ResolverOverride[] overrides)
        {
            return new UnityContainerClass().Instance.Resolve<T>(tipo, overrides);
        }

        /// <summary>
        /// Determina si un tipo está registrado en Unity
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static bool IsRegistered<T>(string tipo)
        {
            return new UnityContainerClass().Instance.IsRegistered<T>(tipo);
        }

        public static object Resolve(Type type)
        {
            return new UnityContainerClass().Instance.Resolve(type);
        }

        public static IUnityContainer GetChildContainer()
        {
            return new UnityContainerClass().Instance.CreateChildContainer();
        }
    }
}