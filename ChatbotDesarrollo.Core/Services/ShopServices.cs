using Business.Dto.Dtos.Apis;
using Business.Entities;
using Business.Entities.Security;
using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class ShopServices : EntityServices<Negocios, ShopManager, ShopLogic, Chatbot_DesarrolloEntities>
    {
        public Shop search(string param)
        {
            return DefaultLogic.DefaultManager.search(param);
        }

        public Shop get(int Id)
        {
            return DefaultLogic.DefaultManager.get(Id);
        }

        public Authentication token(string code, string secret, string tokenProveedor)
        {
            return DefaultLogic.DefaultManager.token(code,secret, tokenProveedor);
        }

    }
}


