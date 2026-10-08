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
        Provider getProvider(string code);

        //Login por telefono: pedir el codigo, validarlo y, si el usuario es nuevo, completar sus datos.
        void RequestCode(RequestCodeDto request);
        LoginResult VerifyCode(VerifyCodeDto request);
        LoginResult CompleteProfile(CompleteProfileDto request);
        
    }
}