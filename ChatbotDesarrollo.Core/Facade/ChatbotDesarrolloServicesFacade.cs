using ChatbotDesarrollo.Core.Services;
using Framework.Core.Unity;


namespace ChatbotDesarrollo.Core.Facade
{
    public static class ChatbotDesarrolloServicesFacade
    {
        public static SharedServices SharedServices
        {
            get { return UnityFactoryClass.Resolve<SharedServices>(); }
        }
    }
}




