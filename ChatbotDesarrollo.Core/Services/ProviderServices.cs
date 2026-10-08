using Business.Entities;
using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class ProviderServices : EntityServices<Proveedores, ProviderManager, ProviderLogic, Chatbot_DesarrolloEntities>
    {
        public Provider getByCode(string code)
        {
            return DefaultLogic.DefaultManager.getByCode(code);
        }
    }
}
