using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business.Entities.Security;

namespace Business.Entities
{
    public class Chat
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Shop Shop { get; set; }
        public DateTime DateInit { get; set; }
        public IList<Message> Messages { get; set; }
        public Message LastMessage { get; set; }
        
    }

    public class Message
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public FromMessage From { get; set; }
        public MensajeEstado State { get; set; }
        public MessageDetail Detail { get; set; }
        public string externalId { get; set; }

        //Cuando lo leyeron, o null si todavia no. Sale de la columna Mensajes.FechaLeido, no del JSON del mensaje:
        //el JSON se escribe una sola vez al enviarlo, cuando por definicion todavia nadie lo leyo. Lo completa el
        //Manager al leer, igual que el Id.
        public DateTime? ReadDate { get; set; }

    }


    //Id del mensaje tal como se lo exponemos al proveedor: el id interno con un prefijo, para que no se confunda con
    //ids de otros sistemas. Vive aca y no suelto en cada lugar porque tienen que coincidir el del webhook
    //(ChatBusinessService.SendWebhook) y el que devuelve el API publico (WebAPI, MessageController): el proveedor usa
    //ese valor para correlacionar lo que mando con el aviso que recibe despues.
    public static class MessageIdExterno
    {
        public const string Prefijo = "CMID-";

        public static string Formatear(int messageId)
        {
            return Prefijo + messageId;
        }
    }

    //Lo que viaja por websocket cuando le llega un mensaje al usuario. Es un sobre y no el Message pelado porque el
    //Message no sabe a que chat pertenece, y el navegador necesita saberlo para decidir si lo pinta en la conversacion
    //abierta o solo actualiza la fila de la lista.
    public class MessageNotification
    {
        public int ChatId { get; set; }
        public Message Message { get; set; }
    }


    public class FromMessage {
        public MensajeEnviadoPor From { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
    }


    public class MessageDetail {
        public string Text { get; set; }
        public string Image { get; set; }
        public string Audio { get; set; }
        public string File { get; set; }
        public string Video { get; set; }
        public string Sticket { get; set; }
        //Nombre original del archivo subido (Image, File o Video); no se pisa entre si, uno solo de los tres va a estar seteado.
        public string FileName { get; set; }
        public IList<ButtonMessageDetailt> Buttons { get; set; }
    }

    public class ButtonMessageDetailt
    {
        public string Text { get; set; }
        public string Payload { get; set; }
    }



}
