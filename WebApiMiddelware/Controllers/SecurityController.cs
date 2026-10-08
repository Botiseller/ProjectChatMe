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

        [Route("Security/RequestCode"), HttpPost]
        public IHttpActionResult RequestCode(RequestCodeDto request)
        {
            try
            {
                _service.RequestCode(request);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("Security/VerifyCode"), HttpPost]
        public IHttpActionResult VerifyCode(VerifyCodeDto request)
        {
            try
            {
                return Ok(_service.VerifyCode(request));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("Security/CompleteProfile"), HttpPost]
        public IHttpActionResult CompleteProfile(CompleteProfileDto request)
        {
            try
            {
                return Ok(_service.CompleteProfile(request));
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

        [Route("Security/Provider"), HttpGet]
        public IHttpActionResult Provider(string code)
        {
            try
            {
                return Ok(_service.getProvider(code));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}