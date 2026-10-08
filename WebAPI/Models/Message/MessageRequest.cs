using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Business.CallAPI.Services;
using Business.Dto;
using Business.Dto.Dtos.Chats;
using Microsoft.Ajax.Utilities;

namespace WebAPI.Models.Message
{
    public class MessageRequest
    {
        MiddlewareChatMeService middleware = new Business.CallAPI.Services.MiddlewareChatMeService();
        internal int userId = 0;

        public MessageContactRequest To { get; set; }
        public MessageDataRequest Data { get; set; }
        public MessageProviderRequest Provider { get; set; }

        public SendMessageDto parse(int shopId) {
            //1. conseguiruserid por externo

            var p = middleware.authentication.getProvider(Provider.Code);
            if (p == null)
                throw new Exception("Provider not found");

            var user = middleware.user.SearchProvider(To.Id, p.Id);

            if (user == null)
                throw new Exception("User dont exist");
            userId = user.UsuarioId;

            var s = new SendMessageDto();
            var chat = middleware.chat.Get(shopId, user.UsuarioId);
            s.ChatId = chat.Id;
            s.Text = Data.Text;
            
            //Por este camino el mensaje lo manda el negocio al usuario, no al reves: sin esto quedaria guardado como
            //si lo hubiera escrito el usuario y en pantalla se veria del lado equivocado del chat.
            s.From = MensajeEnviadoPorDto.Negocio;
            

            SetAttachment(s);
            SetButtons(s);

            return s;
        }

        //SendMessageDto lleva un adjunto por mensaje, asi que se toma el primero que venga en este orden.
        //Quien decide si es imagen, video, audio o archivo es ChatBusinessService.SendMessage mirando el ContentType,
        //por eso hay que mandarlo: aca el tipo lo sabemos por el campo que vino cargado, no por el archivo en si.
        private void SetAttachment(SendMessageDto s)
        {
            if (!string.IsNullOrWhiteSpace(Data.ImageURL))
                SetFile(s, Data.ImageURL, "image/jpeg");
            else if (!string.IsNullOrWhiteSpace(Data.VideoURL))
                SetFile(s, Data.VideoURL, "video/mp4");
            else if (!string.IsNullOrWhiteSpace(Data.AudioURL))
                SetFile(s, Data.AudioURL, "audio/mpeg");
            else if (!string.IsNullOrWhiteSpace(Data.FileURL))
                SetFile(s, Data.FileURL, "application/octet-stream");
        }

        private static void SetFile(SendMessageDto s, string url, string defaultContentType)
        {
            //Content queda en null a proposito: el archivo ya esta publicado y se manda como URL. Chat/SendMessage en
            //WebApiMiddelware solo sube a S3 cuando el DTO trae Content, asi que por este camino no vuelve a subirse.
            s.FileUrl = url.Trim();
            s.FileName = GetFileName(s.FileUrl);

            //MimeMapping resuelve por extension. Si la URL no tiene una reconocible dentro de la familia que ya
            //sabemos (image, video, audio, application), vale el tipo por defecto, para que el business no termine
            //clasificando una imagen como archivo generico.
            var family = defaultContentType.Substring(0, defaultContentType.IndexOf('/') + 1);
            var byExtension = string.IsNullOrEmpty(s.FileName) ? null : MimeMapping.GetMimeMapping(s.FileName);

            s.ContentType = byExtension != null && byExtension.StartsWith(family, StringComparison.OrdinalIgnoreCase)
                ? byExtension
                : defaultContentType;
        }

        //Ultimo segmento de la URL, sin query string ni fragmento: es lo que se muestra como nombre del adjunto.
        private static string GetFileName(string url)
        {
            var path = url.Split('?', '#')[0];
            var name = path.Substring(path.LastIndexOf('/') + 1);

            return string.IsNullOrWhiteSpace(name) ? null : Uri.UnescapeDataString(name);
        }

        //Los botones se pasan tal cual: el texto obligatorio y el payload lo valida y normaliza el business.
        private void SetButtons(SendMessageDto s)
        {
            if (Data.Buttons == null)
                return;

            s.Buttons = Data.Buttons
                .Where(b => b != null)
                .Select(b => new SendMessageButtonDto() { Text = b.Text, Payload = b.Payload })
                .ToList<SendMessageButtonDto>();
        }

    }


    public class MessageContactRequest {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PictureURL { get; set; }
    }

    public class MessageDataRequest
    {
        public string Text { get; set; }
        public string ImageURL { get; set; }
        public string VideoURL { get; set; }
        public string AudioURL { get; set; }
        public string FileURL { get; set; }
        public IList<MessageDataButtonRequest> Buttons { get; set; }

    }

    public class MessageDataButtonRequest
    {
        public string Text { get; set; }
        public string Payload { get; set; }


    }

    public class MessageProviderRequest {
        public string Code { get; set; }
       
    }

}