using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Business.Dto.Dtos.Authentication;
using Business.Entities.Security;
using Newtonsoft.Json;

namespace WebFront.Controllers
{
    public class FeedController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Feed()
        {
            return View();
        }

    }
}