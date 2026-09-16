using Framework.FrontApplication.Template;
using System.Web.Mvc;

namespace WebFront.Controllers
{
    public class IndexController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

  

        


    }
}