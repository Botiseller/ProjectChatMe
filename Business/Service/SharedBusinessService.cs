using ChatbotDesarrollo.Core.Facade;
using Business.Contracts.Service;


namespace Business.Service
{
    public class SharedBusinessService : ISharedBusinessService
    {
        

        public string ConseguirUniqueString()
        {
            return ChatbotDesarrolloServicesFacade.SharedServices.ConseguirUniqueString();
        }
       
    }
}