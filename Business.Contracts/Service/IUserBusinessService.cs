using Business.Entities;
using Business.Entities.Security;

namespace Business.Contracts.Service
{
    public interface IUserBusinessService
    {
        User search(string param);
        User search(string userid, int providerId);
        User searchByPhone(string phone);
        User create(User user);
        User update(User user);

    }
}