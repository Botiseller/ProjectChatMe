using Business.Dto.Dtos.Apis;
using Business.Dto.Dtos.Authentication;
using Business.Entities;
using Business.Entities.Security;

namespace Business.Contracts.Service
{
    public interface ISecurityBusinessService
    {
        Session Loggin(AuthenticationDto auth);
        Authentication getToken(string code, string secret, string tokenProveedor);
        
    }
}