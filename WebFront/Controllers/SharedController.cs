using Business.CallAPI.Services;
using Framework.FrontApplication.Template;
using System.Web.Mvc;

namespace WebFront.Controllers
{
    public class SharedController : BaseController
    {

        [HttpGet]
        public JsonResult ConseguirUniqueString()
        {

      
            string uniqueString = middlewareChatMeService.ConseguirUniqueString();
            return Json(uniqueString, JsonRequestBehavior.AllowGet);
        }
    }
}