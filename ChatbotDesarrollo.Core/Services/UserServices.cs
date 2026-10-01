using System.Runtime.Remoting.Contexts;
using Business.Entities;
using Business.Entities.Security;
using ChatbotDesarrollo.Core.Facade;
using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class UserServices : EntityServices<Usuarios, UserManager, UserLogic, Chatbot_DesarrolloEntities>
    {
        public User search(string param)
        {
            return DefaultLogic.DefaultManager.search(param);
        }

        public User search(string userid, int providerId)
        {
            return DefaultLogic.DefaultManager.search(userid, providerId);
        }

        public User get(int id)
        {
            return DefaultLogic.DefaultManager.get(id);
        }

        public string getExternalId(int id, int providerId)
        {
            return DefaultLogic.DefaultManager.getExternalId(id, providerId);
        }

        public User create(User user)
        {
            return DefaultLogic.DefaultManager.create(user);
        }

        public void updateProviderData(string code, int provider, int userId)
        {
            DefaultLogic.DefaultManager.updateProviderData(code, provider, userId);
        }
    }
}


