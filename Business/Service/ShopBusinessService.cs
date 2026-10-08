using Business.Contracts.Service;
using Business.Entities;
using ChatbotDesarrollo.Core.Facade;


namespace Business.Service
{
    public class ShopBusinessService : IShopBusinessService
    {

        public Shop search(string param)
        {
            return ChatbotDesarrolloServicesFacade.ShopServices.search(param);
        }

        public Shop get(int Id)
        {
            return ChatbotDesarrolloServicesFacade.ShopServices.get(Id);
        }

        
    }
}
