using System;
using System.Web.Http;
using Business.Contracts.Service;
using Business.Dto.Dtos.Authentication;
using Business.Service;
using Framework.Core.Header;

namespace WebApiMiddelware.Controllers
{
    public class SecurityController : MidlewareBaseController
    {
        private readonly ISecurityBusinessService _service;
        public SecurityController(IInternalHeader header) : base(header)
        {
            _service = new SecurityBusinessService();
        }


        [Route("Security/Loggin"), HttpPost]
        public IHttpActionResult Loggin(AuthenticationDto authentication)
        {
            try
            {
                return Ok(_service.Loggin(authentication));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("Security/Token"), HttpGet]
        public IHttpActionResult Token(string code, string secret, string tokenProveedor)
        {
            try
            {
                return Ok(_service.getToken(code,secret, tokenProveedor));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}