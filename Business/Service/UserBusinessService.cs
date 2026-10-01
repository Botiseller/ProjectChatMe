using Business.Contracts.Service;
using Business.Entities;
using Business.Entities.Security;
using ChatbotDesarrollo.Core.Facade;


namespace Business.Service
{
    public class UserBusinessService : IUserBusinessService
    {

        public User search(string param)
        {
            return ChatbotDesarrolloServicesFacade.UserServices.search(param);
        }

        public User search(string userid, int providerId)
        {
            return ChatbotDesarrolloServicesFacade.UserServices.search(userid, providerId);
        }

        public User get(int id)
        {
            return ChatbotDesarrolloServicesFacade.UserServices.get(id);
        }

        public string getExternalId(int id,int providerId)
        {
            return ChatbotDesarrolloServicesFacade.UserServices.getExternalId(id, providerId);
        }

        public User create(User user)
        {
            return ChatbotDesarrolloServicesFacade.UserServices.create(user);
        }

        public void updateProviderData(string code, int provider, int userId)
        {
            ChatbotDesarrolloServicesFacade.UserServices.updateProviderData(code, provider, userId);
        }

    }
}
