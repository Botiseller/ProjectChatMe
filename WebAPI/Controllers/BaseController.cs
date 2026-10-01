using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Threading;
using System.Web.Http;
using Business.Dto.Dtos.Apis;
using Business.Entities.Security;
using Common.Services.Interceptor;
using Common.Utility;
using WebApiMessage.Models.Response;

namespace WebAPI.Controllers
{
    public class BaseController : ApiController
    {
        internal Business.CallAPI.Services.MiddlewareChatMeService middlewareChatme = new Business.CallAPI.Services.MiddlewareChatMeService();


        internal Authentication DecryptAuthentication(string authentication) {
            try {
                var j = Common.Utility.CryptoHelper.DecryptStringToString(authentication);
                var auth = Common.Utility.Helper.DeserializeObject<Business.Dto.Dtos.Apis.Authentication>(j);

                if (auth.expire <= DateTime.Today)
                {
                    throw new Exception("Invalid access token - The access token has expired.");
                }

                return auth;
            } catch {
                throw new Exception("Invalid access token - The authentication code is not valid.");
            }
        }

        internal void createThred() {

            Session o = new Session()
            {
                Init = DateTime.UtcNow,
                Usuario = null
            };

            //build a custom identity and custom principal object based on this username
            CustomIdentity identity = new CustomIdentity
            {
                Name = "Name",
                session = o
            };

            GenericPrincipal principal = new GenericPrincipal(identity, null);

            //set the principal to the current context
            //HttpContext.Current.User = principal;
            Thread.CurrentPrincipal = principal;

        }

        internal void createThred(int userId)
        {

            Session o = new Session()
            {
                Init = DateTime.UtcNow,
                Usuario = new User() { UsuarioId = userId }
            };

            //build a custom identity and custom principal object based on this username
            CustomIdentity identity = new CustomIdentity
            {
                Name = "Name",
                session = o
            };

            GenericPrincipal principal = new GenericPrincipal(identity, null);

            //set the principal to the current context
            //HttpContext.Current.User = principal;
            Thread.CurrentPrincipal = principal;

        }


    }
}
