using System.Collections.Generic;

namespace Business.Dto.Dtos.Chats
{
    public class SendMessageDto
    {
        public int ChatId { get; set; }
        public string Text { get; set; }

        //Quien manda el mensaje. La pantalla del usuario manda Usuario y el API publico manda Negocio, que es el
        //proveedor escribiendole al usuario. Si no viene se asume Usuario, que es el caso de la pantalla.
        public MensajeEnviadoPorDto From { get; set; }

        //Adjunto opcional: un mensaje puede ser solo texto, solo archivo, o los dos juntos.
        //Content es el archivo en si; Newtonsoft lo serializa como base64 solo, sin que haga falta multipart
        //entre WebFront y el API (ver MiddlewareChatMeService.ChatCall.SendMessage).
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }

        //La completa el controller del API despues de subir Content a S3; no viene del cliente.
        //De ahi en adelante (business y Core) el archivo viaja solo como URL.
        public string FileUrl { get; set; }

        //Botones opcionales. La pantalla del usuario no los manda nunca (WebFront\Controllers\ChatsController arma el
        //DTO solo con texto y archivo): los usa quien manda mensajes del lado del negocio, o sea el API publico.
        public IList<SendMessageButtonDto> Buttons { get; set; }

        //Boton que el usuario toco para responder, si respondio tocando uno en vez de escribiendo. Va el objeto entero
        //y no solo el payload, para no tener que tocar toda la cadena si el boton gana propiedades mas adelante.
        //El texto del boton viaja igual en Text, que es lo que se guarda y se muestra como mensaje del usuario.
        public SendMessageButtonDto Button { get; set; }
    }

    //Equivalente de transporte de Business.Entities.ButtonMessageDetailt: Business.Dto no referencia Business.Entities,
    //asi que la entidad no se puede reusar aca. El mapeo entre las dos lo hace ChatBusinessService.SendMessage.
    public class SendMessageButtonDto
    {
        public string Text { get; set; }

        //Lo que el receptor usa para disparar el evento cuando el usuario toca el boton; no se muestra en pantalla.
        public string Payload { get; set; }
    }
}
