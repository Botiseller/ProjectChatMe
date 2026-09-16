using Framework.FrontApplication.Template;
using System.Web.Mvc;

namespace WebFront.Controllers
{
    public class AuthenticationController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Authentication()
        {
            return View("Authentication");
        }

  

        


    }
}