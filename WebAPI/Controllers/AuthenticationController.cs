using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Business.Dto.Dtos.Apis;
using WebApiMessage.Models.Response;

namespace WebAPI.Controllers
{
    public class AuthenticationController : BaseController
    {
        [HttpGet]
        public GenericResponse<string> authenticate(string code, string secret, string tokenProveedor)
        {
            var response = new GenericResponse<string>();

            try {
                var authentication = middlewareChatme.authentication.getToken(code, secret, tokenProveedor);
                string j = Common.Utility.Helper.SerializeObjectSimple(authentication);
                string auth = Common.Utility.CryptoHelper.EncryptStringToString(j);
                response.Result = auth;
                response.Code = 200;
            }
            catch (Exception ex) { 
            response.Code = 500;
                response.Errors = new List<ErrorMessage>() { 
                    new ErrorMessage() { 
                        Message = ex.Message,
                        Code = 1,
                        ErrorSource = "Chatme-"
                    } 
                };
            }
            return response;

        }

    }
}
