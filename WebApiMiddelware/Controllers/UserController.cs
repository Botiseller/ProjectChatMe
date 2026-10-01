using System;
using System.Web.Http;
using Business.Contracts.Service;
using Business.Dto.Dtos.Authentication;
using Business.Entities.Security;
using Business.Service;
using Framework.Core.Header;

namespace WebApiMiddelware.Controllers
{
    public class UserController : MidlewareBaseController
    {
        private readonly IUserBusinessService _service;
        public UserController(IInternalHeader header) : base(header)
        {
            _service = new UserBusinessService();
        }


        [Route("User/Search"), HttpGet]
        public IHttpActionResult Search(string param)
        {
            try
            {
                return Ok(_service.search(param));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("User/SearchProvider"), HttpGet]
        public IHttpActionResult Search(string userid, int providerId)
        {
            try
            {
                return Ok(_service.search(userid,providerId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("User/Create"), HttpPost]
        public IHttpActionResult Create(User user)
        {
            try
            {
                return Ok(_service.create(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}