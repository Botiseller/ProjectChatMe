using Business.Entities;
using Business.Entities.Security;

namespace Business.Contracts.Service
{
    public interface IUserBusinessService
    {
        User search(string param);
        User search(string userid, int providerId);
        User create(User user);

    }
}