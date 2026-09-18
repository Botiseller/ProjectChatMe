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

        public static ChatServices ChatServices
        {
            get { return UnityFactoryClass.Resolve<ChatServices>(); }
        }
        public static NegocioServices NegocioServices
        {
            get { return UnityFactoryClass.Resolve<NegocioServices>(); }
        }
        public static UsuarioServices UsuarioServices
        {
            get { return UnityFactoryClass.Resolve<UsuarioServices>(); }
        }
    }
}




