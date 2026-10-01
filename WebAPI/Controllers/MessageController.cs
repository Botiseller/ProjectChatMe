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
    public class MessageController : BaseController
    {
        [HttpPost]
        public GenericResponse<Models.Message.MessageResponse> Send([FromBody] Models.Message.MessageRequest message, [FromUri] string authentication)
        {
            var r = new GenericResponse<Models.Message.MessageResponse>();
            createThred();
            try {
                var auth = DecryptAuthentication(authentication);
                
                var m = message.parse(auth.shopId);
                createThred(message.userId);
                var response = middlewareChatme.chat.SendMessage(m);

                r.Code = 200;
                r.Result = new Models.Message.MessageResponse()
                {
                    //El mismo formato con el que despues le va a llegar por webhook, para que el proveedor pueda
                    //correlacionar. No se usa response.externalId: ese campo es el id que el PROVEEDOR nos manda a
                    //nosotros (lo completa el historial en AuthenticationController.Go) y por este camino viene null.
                    MessageId = MessageIdExterno.Formatear(response.Id)
                };
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
