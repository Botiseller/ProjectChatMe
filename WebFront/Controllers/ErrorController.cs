using Framework.FrontApplication.Template;
using System.Web.Mvc;

namespace WebFront.Controllers
{
    public class ErrorController : BaseController
    {
        public ActionResult Error()
        {
            return View("Error");
        }

        public ActionResult NotFound()
        {
            return View("NotFound");
        }

        public ActionResult NotAutorized()
        {
            return View("NotAutorized");
        }

        public ActionResult NotLogin()
        {
            return View("NotLogin");
        }
    }
}