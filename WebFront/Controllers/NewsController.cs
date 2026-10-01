using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Business.Dto.Dtos.Authentication;
using Business.Entities.Security;
using Newtonsoft.Json;

namespace WebFront.Controllers
{
    public class NewsController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public ActionResult News()
        {
            return View();
        }

    }
}