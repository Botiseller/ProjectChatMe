using System;
using System.Web.Http;
using Business.Contracts.Service;
using Business.Dto.Dtos.Authentication;
using Business.Service;
using Framework.Core.Header;

namespace WebApiMiddelware.Controllers
{
    public class ShopController : MidlewareBaseController
    {
        private readonly IShopBusinessService _service;
        public ShopController(IInternalHeader header) : base(header)
        {
            _service = new ShopBusinessService();
        }


        [Route("Shop/Search"), HttpGet]
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

        [Route("Shop/Get"), HttpGet]
        public IHttpActionResult Get(int Id)
        {
            try
            {
                return Ok(_service.get(Id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}