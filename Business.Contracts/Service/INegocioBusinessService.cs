using Business.Entities;

namespace Business.Contracts.Service
{
    public interface IShopBusinessService
    {
        Shop search(string param);
        Shop get(int Id);
    }
}