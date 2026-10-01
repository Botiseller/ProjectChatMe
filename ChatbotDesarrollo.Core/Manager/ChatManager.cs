using Business.Entities;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace ChatbotDesarrollo.Core.Manager
{
    public sealed class ChatManager : EntityManager<Chats, Chatbot_DesarrolloEntities>
    {

        public Chat create(Chat chat)
        {
            Chats c = Context.Chats.Include(x => x.Mensajes).Where(x => x.Negocios.NegocioId == chat.Shop.Id && x.Usuarios.UsuarioId == chat.User.UsuarioId).FirstOrDefault();
            if (c == null) {
                c = new Chats() { 
                    FechaInicio = DateTime.UtcNow,
                    Negocios = Context.Negocios.Where(x=> x.NegocioId == chat.Shop.Id).FirstOrDefault(),
                    Usuarios = Context.Usuarios.Where(x=> x.UsuarioId == chat.User.UsuarioId).FirstOrDefault(),
                    Mensajes = new List<Mensajes>()
                };
            }

            foreach (var x in chat.Messages)
            {
                var message = Context.Mensajes.Where(m => m.ExternalId == x.externalId).FirstOrDefault();
                if (message == null)
                {
                    c.Mensajes.Add(new Mensajes()
                    {
                        Mensaje = Common.Utility.Helper.SerializeObjectSimple(x),
                        Estado = (int)x.State,
                        Fecha = DateTime.UtcNow,
                        Origen = (int)x.From.From,
                        ExternalId = x.externalId
                    });
                }
            }

            //UltimoMensaje guarda el Message (Business.Entities) completo, igual que Mensajes.Mensaje; no la entidad EF Mensajes.
            var ultimo = chat.Messages.LastOrDefault();
            if (ultimo != null)
                c.UltimoMensaje = Common.Utility.Helper.SerializeObjectSimple(ultimo);
            else if (c.UltimoMensaje == null)
                c.UltimoMensaje = string.Empty;

            Context.Chats.AddOrUpdate(c);
            SaveChanges();

            return Get(chat.Shop.Id, chat.User.UsuarioId);
        }


        public Chat Get(int shopId, int userId) {
            Chat chat = null;
            Chats c = Context.Chats.Include(x => x.Mensajes).Where(x => x.Negocios.NegocioId == shopId && x.Usuarios.UsuarioId == userId).FirstOrDefault();
            if (c != null) {
                chat = new Chat()
                {
                    Id = c.ChatId,
                    DateInit = c.FechaInicio,
                    Shop = new ShopManager().get(shopId),
                    User = new UserManager().get(userId),
                    Messages = new List<Message>()
                };


                foreach (var m in c.Mensajes)
                {
                    chat.Messages.Add(Common.Utility.Helper.DeserializeObject<Message>(m.Mensaje));
                }
                

            }

            return chat;
        }

        //Cabecera del chat: los datos del negocio y la fecha de inicio, sin los mensajes (esos se piden aparte con
        //GetMessages). El chat tiene que ser del usuario de la sesion; si no lo es, o no existe, devuelve null.
        public Chat GetChat(int chatId)
        {
            int userId = Common.Utility.Helper.GetUserBySession();

            var c = Context.Chats
                .Include(x => x.Negocios)
                .FirstOrDefault(x => x.ChatId == chatId && x.Usuarios.UsuarioId == userId);

            if (c == null)
                return null;



            Shop shop = new ShopManager().get(c.Negocios.NegocioId) ;
            //if (c.Negocios != null)
            //{
            //    shop = Common.Utility.Helper.DeserializeObject<Shop>(c.Negocios.Negocio) ?? new Shop();
            //    shop.Id = c.Negocios.NegocioId;
            //    shop.Nombre = c.Negocios.Nombre;
            //}

            return new Chat()
            {
                Id = c.ChatId,
                DateInit = c.FechaInicio,
                Shop = shop,
                User = new UserManager().get(userId),
                Messages = new List<Message>()
            };
        }

        public List<Chat> GetLote(int lote)
        {
            int userId = Common.Utility.Helper.GetUserBySession();

            var chats = Context.Chats
                .Include(x => x.Negocios)
                //El rubro se muestra en la cabecera del chat, y la cabecera se arma con el negocio que viene de aca
                //(no vuelve a pedirse con ShopManager.get), asi que el subrubro y su rubro tienen que venir en esta query.
                .Include(x => x.Negocios.SubRubros.Rubros)
                .Where(x => x.Usuarios.UsuarioId == userId)
                .OrderByDescending(x => x.FechaInicio)
                .Skip(20 * lote)
                .Take(20)
                .ToList();

            var user = new UserManager().get(userId);

            var result = new List<Chat>();
            foreach (var c in chats)
            {
                Shop shop = null;
                if (c.Negocios != null)
                {
                    shop = Common.Utility.Helper.DeserializeObject<Shop>(c.Negocios.Negocio) ?? new Shop();
                    shop.Id = c.Negocios.NegocioId;
                    shop.Nombre = c.Negocios.Nombre;
                    shop.SubRubro = ShopManager.ToSubRubro(c.Negocios.SubRubros);
                }

                Message lastMessage = ParseUltimoMensaje(c.UltimoMensaje);

                result.Add(new Chat()
                {
                    Id = c.ChatId,
                    DateInit = c.FechaInicio,
                    Shop = shop,
                    User = user,
                    Messages = new List<Message>(),
                    LastMessage = lastMessage
                });
            }

            return result;
        }

        //Si se cambia, cambiarlo tambien en messagesPageSize de Scripts/Models/Chat/Chat.js.
        private const int MessagesPageSize = 20;

        //Una pagina de 20 mensajes del chat, del mas viejo al mas nuevo. beforeId es el cursor: 0 trae los ultimos 20 y
        //un MensajeId trae los 20 anteriores a ese. El chat tiene que ser del usuario de la sesion, asi que un chatId
        //ajeno devuelve una lista vacia.
        public List<Message> GetMessages(int chatId, int beforeId)
        {
            int userId = Common.Utility.Helper.GetUserBySession();

            var query = Context.Mensajes
                .Where(x => x.Chats.ChatId == chatId && x.Chats.Usuarios.UsuarioId == userId);

            if (beforeId > 0)
                query = query.Where(x => x.MensajeId < beforeId);

            var mensajes = query
                .OrderByDescending(x => x.MensajeId)
                .Take(MessagesPageSize)
                .ToList();

            mensajes.Reverse();

            var result = new List<Message>();
            foreach (var m in mensajes)
            {
                var message = Common.Utility.Helper.DeserializeObject<Message>(m.Mensaje);
                if (message == null)
                    continue;

                message.Id = m.MensajeId;
                //Igual que el Id: sale de la columna y no del JSON, que se escribio cuando el mensaje todavia no
                //estaba leido y nunca se reescribe.
                message.ReadDate = m.FechaLeido;
                result.Add(message);
            }

            return result;
        }

        //Guarda el mensaje en el chat y lo deja como ultimo mensaje. El Message llega armado y validado desde
        //ChatBusinessService (quien lo manda, en que estado y con que fecha son decisiones de negocio): aca solo se
        //serializa y se graba. El chat tiene que ser del usuario de la sesion, si no no hay donde guardarlo.
        public Message SendMessage(int chatId, Message message)
        {
            int userId = Common.Utility.Helper.GetUserBySession();

            var chat = Context.Chats.FirstOrDefault(x => x.ChatId == chatId && x.Usuarios.UsuarioId == userId);
            if (chat == null)
                throw new ArgumentException("La conversación no existe.");

            var json = Common.Utility.Helper.SerializeObjectAscii(message);

            var mensaje = new Mensajes()
            {
                Chats = chat,
                Fecha = message.Date,
                Origen = (int)message.From.From,
                Estado = (int)message.State,
                Mensaje = json
            };

            Context.Mensajes.Add(mensaje);
            chat.UltimoMensaje = json;
            SaveChanges();

            message.Id = mensaje.MensajeId;
            return message;
        }

        //Marca como leidos los mensajes del chat que todavia no tenian fecha de lectura, y devuelve cuantos cambio.
        //El chat tiene que ser del usuario de la sesion, igual que en el resto de los metodos de aca.
        //PENDIENTE: hoy marca todos los del chat sin mirar quien los mando. Cuando se defina quien llama a esto (la
        //pantalla del usuario, o el negocio por el API publico) va a haber que filtrar por Origen, para marcar solo
        //los del otro lado; si no, quien lee termina marcando como leidos tambien sus propios mensajes.
        public int MarkAsRead(int chatId)
        {
            int userId = Common.Utility.Helper.GetUserBySession();

            var pendientes = Context.Mensajes
                .Where(x => x.Chats.ChatId == chatId
                         && x.Chats.Usuarios.UsuarioId == userId
                         && x.FechaLeido == null)
                .ToList();

            if (pendientes.Count == 0)
                return 0;

            var ahora = DateTime.UtcNow;
            foreach (var mensaje in pendientes)
                mensaje.FechaLeido = ahora;

            SaveChanges();

            return pendientes.Count;
        }

        private static Message ParseUltimoMensaje(string json)
        {
            if (string.IsNullOrEmpty(json))
                return null;

            var message = Common.Utility.Helper.DeserializeObject<Message>(json);

            //filas anteriores al fix: UltimoMensaje tenia la entidad EF Mensajes y el Message venia serializado dentro de su propiedad "Mensaje".
            if (message != null && message.Detail == null)
            {
                var legacy = Common.Utility.Helper.DeserializeObject<Mensajes>(json);
                if (legacy != null && !string.IsNullOrEmpty(legacy.Mensaje))
                    message = Common.Utility.Helper.DeserializeObject<Message>(legacy.Mensaje);
            }

            return message;
        }

    }
}