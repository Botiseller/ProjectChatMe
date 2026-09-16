using Business.CallAPI.Services;
using Common.Services.Interceptor;
using System.Threading;
using System.Web.Mvc;

namespace WebFront.Controllers
{
    public class BaseController : Controller
    {
        public MiddlewareChatMeService middlewareChatMeService = new MiddlewareChatMeService();
      

        public void createPrincipalThread(string token)
        {
            var customIdentity = new CustomIdentity
            {
                Name = string.Empty,
                IdUser = string.Empty,
                Family = string.Empty,
                Product = "ChatMe",
                Token = token
            };

            Thread.CurrentPrincipal = customIdentity;
            var threadCurrentPrincipal = new GenericPrincipal(customIdentity, null);
            Thread.CurrentPrincipal = threadCurrentPrincipal;

        }

    }
}