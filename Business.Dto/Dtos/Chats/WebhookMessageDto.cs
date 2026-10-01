using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Dto.Dtos.Chats
{
    public class WebhookMessageDto
    {
        public string SessionId { get; set; }
        public WebhookMessageContactDto From { get; set; }
        public WebhookMessageContactDto To { get; set; }
        public WebhookMessageDataDto Data { get; set; }

    }

    public class WebhookMessageContactDto
    {
        public string Id { get; set; }
        public string Name { get; set; }


    }

    public class WebhookMessageDataDto
    {
        public string Field { get; set; }
        public WebhookMessageDataMessageDto Message { get; set; }


    }

    public class WebhookMessageDataMessageDto
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Image { get; set; }
        public string Video { get; set; }
        public string File { get; set; }
        public string Audio { get; set; }

        //Boton que el usuario toco para responder, cuando respondio tocando uno en vez de escribiendo. Es el objeto
        //completo (texto y payload), no solo el payload: el proveedor dispara el evento con el payload, pero asi
        //tiene el resto a mano si mas adelante hace falta.
        public WebhookMessageButtonDto Button { get; set; }

    }

    public class WebhookMessageButtonDto
    {
        public string Text { get; set; }
        public string Payload { get; set; }

    }


}
