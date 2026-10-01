using ChatbotDesarrollo.Core.Services;
using Framework.Core.Unity;


namespace ChatbotDesarrollo.Core.Facade
{
    public static class ChatbotDesarrolloServicesFacade
    {
        
        public static ChatServices ChatServices
        {
            get { return UnityFactoryClass.Resolve<ChatServices>(); }
        }
        public static ShopServices ShopServices
        {
            get { return UnityFactoryClass.Resolve<ShopServices>(); }
        }
        public static UserServices UserServices
        {
            get { return UnityFactoryClass.Resolve<UserServices>(); }
        }
    }
}




