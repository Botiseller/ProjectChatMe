using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using System.Configuration;
using Unity;

namespace Framework.Core.Unity
{
    internal sealed class UnityContainerClass
    {
        public UnityContainerClass()
        {
            InitializeUnityContainer();
        }

        /// <summary>
        /// Gets Unity Container Instance
        /// </summary>
        internal IUnityContainer Instance { get; set; }

        /// <summary>
        /// Initializes static members of the UnityContainer class
        /// </summary>
        private void InitializeUnityContainer()
        {
            // Resource.UnitySection = "moduleCRM": es el NOMBRE DEL CONTENEDOR dentro de la
            // sección de config "unity" (ver Web.config: <section name="unity" .../> y
            // <unity configSource="Unity.config" />), no el nombre de la sección.
            // Este overload internamente hace ConfigurationManager.GetSection("unity") y
            // carga el contenedor "moduleCRM" desde ahí.
            Instance = new UnityContainer().LoadConfiguration(Resource.UnitySection);
        }
    }
}