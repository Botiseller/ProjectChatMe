using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

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

        [HttpGet]
        public JsonResult ConseguirUniqueString()
        {

            string uniqueString = middlewareChatMeService.ConseguirUniqueString();
            return Json(uniqueString, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Loggin(string token)
        {
            try
            {
                var session = new Business.Entities.Security.Session();

                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                           1, 
                           string.Empty,
                           DateTime.Now, // Date/time de creacion
                           DateTime.Now.AddDays(30.0), // Date/time de expiracion
                           true, // "true" para persistencia de cookie
                           string.Empty,  // Los roles, el perfil
                           FormsAuthentication.FormsCookiePath);// Path de la cookie

                string hash = FormsAuthentication.Encrypt(ticket);

                HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, hash)
                {
                    HttpOnly = true // cookie not available in javascript.
                };

                Response.Cookies.Add(cookie);

                return View();
            }
            catch (Exception)
            {
                return View("Authentication/NotLoggin");
            }
            
        }

        public ActionResult NotLoggin()
        {
            return View();
        }

    

    }
}