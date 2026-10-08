using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.UI.WebControls;
using Business.Contracts.Service;
using Business.Dto;
using Business.Dto.Dtos.Chats;
using Business.Entities;
using ChatbotDesarrollo.Core.Facade;


namespace Business.Service
{
    public class ChatBusinessService : IChatBusinessService
    {
        //Tope de caracteres del texto de un mensaje; tiene que ser igual al maxlength del campo en Views/Chats/chats.cshtml.
        private const int MessageMaxLength = 4000;

        //Al entrar desde el chatbot llega el historial entero. Al proveedor se le avisa solo por el ultimo mensaje, y
        //solo si lo escribio el usuario (uno del bot volveria al mismo proveedor que lo mando) y si todavia no estaba
        //guardado: lo que ya estaba es una entrada repetida con el mismo historial. Sin externalId no hay forma de saber
        //si ya estaba, asi que tampoco se avisa. El chequeo va antes de guardar, porque despues ya estaria.
        public Chat create(Chat chat) {
            var ultimo = chat.Messages?.LastOrDefault();
            var avisar = ultimo != null
                      && ultimo.From?.From == MensajeEnviadoPor.Usuario
                      && !string.IsNullOrEmpty(ultimo.externalId)
                      && ChatbotDesarrolloServicesFacade.ChatServices.GetMessageIdByExternalId(ultimo.externalId) == null;

            var saved = ChatbotDesarrolloServicesFacade.ChatServices.create(chat);

            if (avisar)
                SendWebhook(saved, "MESSAGE", ultimo.Detail, ChatbotDesarrolloServicesFacade.ChatServices.GetMessageIdByExternalId(ultimo.externalId).Value, null);

            return saved;
        }

        public List<Chat> GetLote(int lote)
        {
            return ChatbotDesarrolloServicesFacade.ChatServices.GetLote(lote);
        }

        //Cabecera del chat (negocio y fecha de inicio), sin los mensajes: los trae GetMessages, paginados aparte.
        public Chat GetChat(int chatId)
        {
            if (chatId <= 0)
                throw new ArgumentException("Falta la conversación.");

            return ChatbotDesarrolloServicesFacade.ChatServices.GetChat(chatId);
        }

        public List<Message> GetMessages(int chatId, int beforeId)
        {
            return ChatbotDesarrolloServicesFacade.ChatServices.GetMessages(chatId, beforeId);
        }

        //Deja marcados como leidos los mensajes del chat que todavia no lo estaban, y devuelve cuantos cambio.
        //Que el usuario entre al chat ya es haber leido la conversacion, asi que al proveedor le alcanza con saber
        //quien leyo: va sin mensaje. Solo se avisa si habia algo sin leer, porque el front la llama cada vez que se
        //abre el chat y sin eso le llegaria un aviso repetido por cada entrada.
        public int MarkAsRead(int chatId)
        {
            if (chatId <= 0)
                throw new ArgumentException("Falta la conversación.");

            var marcados = ChatbotDesarrolloServicesFacade.ChatServices.MarkAsRead(chatId);

            if (marcados > 0)
                SendWebhook(GetChat(chatId), "MESSAGE_READ", null, 0, null);

            return marcados;
        }

        //Unico camino para mandar un mensaje: solo texto, solo archivo, o los dos juntos. El archivo llega como
        //FileUrl (el controller del API ya lo subio a S3, ver Chat/SendMessage en WebApiMiddelware) y el content type
        //decide si el mensaje es imagen, video o archivo generico. El Manager recibe el MessageDetail ya armado y
        //validado: ahi adentro solo queda el guardado.
        public Message SendMessage(SendMessageDto request)
        {
            if (request == null)
                throw new ArgumentException("Falta el mensaje.");

            var text = (request.Text ?? string.Empty).Trim();
            var hasFile = !string.IsNullOrWhiteSpace(request.FileUrl);

            //Sin archivo el texto es obligatorio; con archivo es una leyenda opcional.
            if (!hasFile && text.Length == 0)
                throw new ArgumentException("El mensaje no puede estar vacío.");
            if (text.Length > MessageMaxLength)
                throw new ArgumentException("El mensaje no puede superar los " + MessageMaxLength + " caracteres.");

            var detail = new MessageDetail() { Text = text.Length > 0 ? text : null };

            if (hasFile)
            {
                detail.FileName = request.FileName;

                if (!string.IsNullOrEmpty(request.ContentType) && request.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                    detail.Image = request.FileUrl;
                else if (!string.IsNullOrEmpty(request.ContentType) && request.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                    detail.Video = request.FileUrl;
                else if (!string.IsNullOrEmpty(request.ContentType) && request.ContentType.StartsWith("audio/", StringComparison.OrdinalIgnoreCase))
                    detail.Audio = request.FileUrl;
                else
                    detail.File = request.FileUrl;
            }
            detail.Buttons = request.Buttons != null ? request.Buttons.Where(b => b != null).Select(b => new ButtonMessageDetailt()
                            {
                                Text = (b.Text ?? string.Empty).Trim(),
                                //El payload es opcional: un boton puede ser solo una respuesta sugerida, sin evento atras.
                                Payload = string.IsNullOrWhiteSpace(b.Payload) ? null : b.Payload.Trim()
                            }).ToList() : null;
            
            var chat = GetChat(request.ChatId);
            //El mensaje se arma entero aca: quien lo manda viene en el DTO y el estado lo pone el servidor. Son
            //decisiones de negocio, no de guardado, asi que el Manager recibe el Message ya listo y solo lo persiste.
            var message = new Message()
            {
                Date = DateTime.UtcNow,
                From = new FromMessage()
                {
                    From = request.From == MensajeEnviadoPorDto.Usuario ? MensajeEnviadoPor.Usuario : MensajeEnviadoPor.Negocio,
                    Name = request.From == MensajeEnviadoPorDto.Usuario ?  CurrentUserName() : chat?.Shop?.Nombre
                },
                State = MensajeEstado.Enviado,
                Detail = detail
            };

            var saved = ChatbotDesarrolloServicesFacade.ChatServices.SendMessage(request.ChatId, message);

            //Cada lado avisa para el otro lado. Si escribio el usuario, el aviso va al proveedor por webhook; si
            //escribio el negocio, va al navegador del usuario por websocket.
            //Al webhook se le pasa el detail ya armado y no el DTO crudo: ahi el adjunto ya quedo clasificado en
            //Image/Video/Audio/File, y no tiene que volver a mirar el content type para decidir lo mismo.
            if (message.From.From == MensajeEnviadoPor.Usuario)
                SendWebhook(request, detail, saved.Id);
            else
                NotifyUser(request.ChatId, saved);

            return saved;
        }

        
        private string CurrentUserName()
        {
            var user = new UserBusinessService().get(Common.Utility.Helper.GetUserBySession());
            return user?.Nombre;
        }

        //Avisa por websocket al navegador del usuario que le llego un mensaje del negocio. Va el mismo Message que
        //devuelve GetMessages, asi el front lo puede pintar con el mapeo que ya tiene (toMessageView) sin un formato
        //aparte. Si el usuario no esta conectado no pasa nada: el mensaje ya quedo guardado y lo va a ver al entrar.
        private void NotifyUser(int chatId, Message message)
        {
            var c = GetChat(chatId);

            if (c?.User != null)
                Common.Websocket.Notificador.MensajeNuevo(c.User.UsuarioId, new MessageNotification()
                {
                    ChatId = chatId,
                    Message = message
                });
        }

        //Firma de SendMessage: el chat sale de la conversacion del request y el boton es el que toco el usuario. Solo
        //arma eso; el aviso lo hace la de abajo, que es la unica que llama al webhook.
        private void SendWebhook(SendMessageDto request, MessageDetail detail, int messageId)
        {
            SendWebhook(GetChat(request.ChatId), "MESSAGE", detail, messageId, request.Button);
        }

        //Arma el aviso y lo deja encolado. El payload se arma en este hilo a proposito: necesita la base y el usuario
        //de la sesion, que ya no estan disponibles una vez que el request termino. Al fondo va solo el POST.
        //Recibe el chat ya armado (con negocio, proveedor y usuario): create lo tiene de lo que acaba de guardar, sin
        //depender de la sesion, y SendMessage llega por la sobrecarga de arriba. button solo existe cuando el mensaje
        //sale de la pantalla.
        //field es el evento que se avisa: MESSAGE para un mensaje nuevo, MESSAGE_READ cuando el usuario leyo el chat.
        //Un evento sin contenido (la lectura) llega sin detail, y entonces el aviso va sin Message.
        private void SendWebhook(Chat c, string field, MessageDetail detail, int messageId, SendMessageButtonDto button) {
            if (c?.Shop?.Provider?.Applications != null) {
                //Adentro del if: un negocio sin proveedor no tiene a quien avisar, y afuera rompia por Provider null.
                var ExternalUser = new UserBusinessService().getExternalId(c.User.UsuarioId, c.Shop.Provider.Id);
                foreach (var app in c.Shop.Provider.Applications.Where(x => x.Available).ToList())
                {
                    var url = app.WebhookUrl;
                    var m = new WebhookMessageDto()
                    {
                        SessionId = c.Id.ToString(),
                        //From es quien manda, o sea el usuario; To es el negocio que recibe.
                        From = new WebhookMessageContactDto()
                        {
                            Id = ExternalUser,
                            Name = c.User.Nombre
                        },
                        To = new WebhookMessageContactDto()
                        {
                            Id = c.Shop.Id.ToString(),
                            Name = c.Shop.Nombre
                        },
                        Data = new WebhookMessageDataDto()
                        {
                            Field = field,
                            Message = detail == null ? null : new WebhookMessageDataMessageDto()
                            {
                                Id = MessageIdExterno.Formatear(messageId),
                                Text = detail.Text,
                                //Solo uno de los cuatro va a estar cargado: un mensaje lleva un adjunto o ninguno.
                                Image = detail.Image,
                                Video = detail.Video,
                                Audio = detail.Audio,
                                File = detail.File,
                                Button = button != null ? new WebhookMessageButtonDto()
                                {
                                    Text = button.Text,
                                    Payload = button.Payload
                                } : null
                            }
                        }
                    };



                    Action enviar = () =>
                    {
                        //Un try por webhook: si un proveedor no responde, los demas igual reciben el aviso. Y tiene que estar
                        //aca adentro porque en segundo plano ya no hay a quien propagarle la excepcion.
                        try
                        {
                            CallAPI.Services.MiddelwareBaseService.CalltoApiPost<string>(url, Common.Utility.Helper.SerializeObjectSimple(m), null);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("dsa");
                        }
                    };

                    if (HostingEnvironment.IsHosted)
                        HostingEnvironment.QueueBackgroundWorkItem(_ => enviar());
                    else
                        Task.Run(enviar);

                }
            }
        }

        public Chat Get(int shopId, int userId)
        {
            return ChatbotDesarrolloServicesFacade.ChatServices.Get(shopId, userId);
        }

    }
}
