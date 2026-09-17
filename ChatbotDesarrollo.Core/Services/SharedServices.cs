using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class SharedServices : EntityServices<ChatsExample, SharedManager, SharedLogic, Chatbot_DesarrolloEntities>
    {
        
        public string ConseguirUniqueString()
        {
            return DefaultLogic.ConseguirUniqueString();
        }        
    }
}


