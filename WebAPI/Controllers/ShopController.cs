using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Business.Entities;
using WebApiMessage.Models.Response;

namespace WebAPI.Controllers
{
    public class ShopController : BaseController
    {
        [HttpGet]
        public GenericResponse<Models.Shop.ShopResponse> Shop([FromUri] string authentication)
        {
            var r = new GenericResponse<Models.Shop.ShopResponse>();

            try {
                var auth = DecryptAuthentication(authentication);

                r.Code = 200;
                var shop = middlewareChatme.shop.get(auth.shopId);
                var s = Models.Shop.ShopResponse.convert(shop);
                r.Result = s;

            } catch (Exception ex) {
                r.Code = 500;
                r.Result = null;
                r.Errors = new List<ErrorMessage>() {
                    new ErrorMessage() {
                        Message = ex.Message
                    }
                };
            }

            return r;
        }

    }
}
