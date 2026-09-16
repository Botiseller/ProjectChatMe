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
            var section = (UnityConfigurationSection)ConfigurationManager.GetSection(Resource.UnitySection);
            Instance = new UnityContainer().LoadConfiguration(section);
        }
    }
}