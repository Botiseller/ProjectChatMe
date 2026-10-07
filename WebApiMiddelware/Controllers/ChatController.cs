using System;
using System.Web.Http;
using Business.Contracts.Service;
using Business.Dto.Dtos.Authentication;
using Business.Dto.Dtos.Chats;
using Business.Entities;
using Business.Service;
using Framework.Core.Header;

namespace WebApiMiddelware.Controllers
{
    public class ChatController : MidlewareBaseController
    {
        //Si se cambia, cambiarlo tambien en el chequeo del lado del cliente (Entities/Archivo.js) y en los
        //maxRequestLength/maxAllowedContentLength de este Web.config y el de WebFront.
        private const long MaxFileSize = 5 * 1024 * 1024;

        private readonly IChatBusinessService _service;
        public ChatController(IInternalHeader header) : base(header)
        {
            _service = new ChatBusinessService();
        }


        [Route("Chat/Create"), HttpPost]
        public IHttpActionResult Create(Chat chat)
        {
            try
            {
                return Ok(_service.create(chat));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("Chat/GetMessages"), HttpGet]
        public IHttpActionResult GetMessages(int chatId, int beforeId = 0)
        {
            try
            {
                return Ok(_service.GetMessages(chatId, beforeId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Unico endpoint para mandar un mensaje, tenga texto, adjunto o los dos. Si viene adjunto se sube primero a S3 y
        //recien con la URL en mano sigue la arquitectura normal (Service -> Facade -> ChatServices -> ChatLogic ->
        //ChatManager), que es donde se valida y se guarda.
        [Route("Chat/SendMessage"), HttpPost]
        public IHttpActionResult SendMessage(SendMessageDto request)
        {
            try
            {
                if (request == null)
                    return BadRequest("Falta el mensaje.");

                if (request.Content != null && request.Content.Length > 0)
                {
                    if (request.Content.Length > MaxFileSize)
                        return BadRequest("El archivo no puede superar los " + (MaxFileSize / (1024 * 1024)) + " MB.");

                    //Bloqueante (no async/await) a proposito: el resto de la clase es sincrono y el Thread.CurrentPrincipal
                    //que arma MidlewareBaseController en el constructor (ver GetUserBySession mas abajo en la arquitectura)
                    //no vale la pena arriesgarlo a un cambio de thread en la continuacion de un await.
                    request.FileUrl = Common.Utility.Archivos.Archivos.UploadAsync(request.Content, request.FileName, "chat", request.ContentType).GetAwaiter().GetResult();
                }

                return Ok(_service.SendMessage(request));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Marca como leidos los mensajes que el negocio le mando al usuario en este chat. Lo llama la pantalla al abrir
        //la conversacion (ver select en Scripts/Models/Chat/Chat.js).
        //El chatId va en el cuerpo y no como query string: CallPost manda los parametros en el body, y para un dato
        //suelto como este el binder necesita el FromBody explicito.
        [Route("Chat/MarkAsRead"), HttpPost]
        public IHttpActionResult MarkAsRead([FromBody] int chatId)
        {
            try
            {
                return Ok(_service.MarkAsRead(chatId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("Chat/GetLote"), HttpGet]
        public IHttpActionResult GetLote(int lote)
        {
            try
            {
                return Ok(_service.GetLote(lote));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Route("Chat/GetChat"), HttpGet]
        public IHttpActionResult Get(int shopId, int userId)
        {
            try
            {
                return Ok(_service.Get(shopId, userId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}