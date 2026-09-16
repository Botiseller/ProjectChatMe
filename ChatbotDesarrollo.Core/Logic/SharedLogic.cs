using System;
using System.Collections.Generic;

using ChatbotDesarrollo.Core.Facade;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Logic
{
    public sealed class SharedLogic : EntityLogic<ChatsExample, SharedManager, Chatbot_DesarrolloEntities>
    {
       

        public string ConseguirUniqueString()
        {
            return DefaultManager.ConseguirUniqueString();
        }
    }
}

