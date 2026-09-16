using Business.Contracts.Service;
using Business.Service;
using Framework.Core.Header;
using System;
using System.Web.Http;

namespace WebApiMiddelware.Controllers
{
    public class SharedController : MidlewareBaseController
    {
        private readonly ISharedBusinessService _service;

        public SharedController(IInternalHeader header) : base(header)
        {
            _service = new SharedBusinessService();
        }

       

        [Route("Shared/ConseguirUniqueString"), HttpGet]
        public IHttpActionResult ConseguirUniqueString()
        {
            try
            {
                string resp = _service.ConseguirUniqueString();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       
    }
}