using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Business.Dto;
using Business.Dto.Dtos.Authentication;
using Business.Dto.Dtos.Chats;
using Business.Entities.Security;
using Newtonsoft.Json;

namespace WebFront.Controllers
{
    public class ChatsController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Chats()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult GetLote(int lote)
        {
            var result = middlewareChatMeService.chat.GetLote(lote);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult GetMessages(int chatId, int beforeId = 0)
        {
            var result = middlewareChatMeService.chat.GetMessages(chatId, beforeId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //La pantalla avisa que el usuario abrio el chat; el middleware marca leidos los mensajes que le mando el
        //negocio. Devuelve cuantos cambio, mas que nada para poder verlo al depurar: la pantalla no lo usa.
        [HttpPost]
        [AllowAnonymous]
        public JsonResult MarkAsRead(int chatId)
        {
            var result = middlewareChatMeService.chat.MarkAsRead(chatId);
            return Json(result);
        }

        //Unico punto de entrada para mandar un mensaje, con o sin adjunto. Viene siempre como multipart/form-data
        //(HttpPostedFileBase, no JSON) porque puede traer binario; file es opcional. ValidateInput(false) porque el
        //texto pasa por Request.Form y la validacion de ASP.NET rechazaria un caracter como "<" escrito por el usuario.
        [HttpPost]
        [AllowAnonymous]
        [ValidateInput(false)]
        public JsonResult SendMessage(HttpPostedFileBase file, int chatId, string text, string button = null)
        {
            //From explicito: por esta pantalla siempre escribe el usuario. Del lado del negocio escribe el API publico
            //(ver WebAPI\Models\Message\MessageRequest.parse), que manda Negocio.
            var request = new SendMessageDto { ChatId = chatId, Text = text, From = MensajeEnviadoPorDto.Usuario };

            //button llega como JSON del objeto entero, no como campos sueltos: asi el dia que el boton tenga una
            //propiedad mas no hay que tocar ni este controller ni el form data de FactoryChat.
            if (!string.IsNullOrWhiteSpace(button))
                request.Button = JsonConvert.DeserializeObject<SendMessageButtonDto>(button);

            if (file != null && file.ContentLength > 0)
            {
                using (var stream = new MemoryStream())
                {
                    file.InputStream.CopyTo(stream);
                    request.Content = stream.ToArray();
                }

                request.FileName = file.FileName;
                request.ContentType = file.ContentType;
            }

            var result = middlewareChatMeService.chat.SendMessage(request);
            return Json(result);
        }

    }
}