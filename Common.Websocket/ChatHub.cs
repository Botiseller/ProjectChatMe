using System;
using Business.Entities.Security;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Common.Websocket
{
    //Hub de la conversacion. Cada conexion entra a un unico grupo, "User-{usuarioId}", y es ahi donde el servidor le
    //avisa de los mensajes que le llegan (ver Notificador). El cliente no llama metodos de este hub: la comunicacion
    //es de ida, del servidor al navegador.
    //El nombre va explicito y no por la convencion de SignalR (que lo derivaria de la clase): si alguien renombra la
    //clase, el cliente sigue encontrando el hub.
    [HubName(NombreHub)]
    public class ChatHub : Hub
    {
        public const string NombreHub = "chatHub";

        //El id del usuario NO sale de lo que diga el cliente: se saca de la sesion que viaja en el query string, que es
        //el mismo base64 del header X-ClientCode que usa el resto del API (ver Framework.Core.InternalHeaderFactory).
        //Si se confiara en un parametro suelto, cualquiera podria suscribirse al canal de otro y leer sus mensajes.
        public const string SessionQueryKey = "clientCode";

        //Se espera el Groups.Add: devuelve una Task y si no se aguarda, la conexion queda dada por establecida antes
        //de estar en el grupo, y un aviso que llegue en ese hueco no lo recibe nadie.
        public override async System.Threading.Tasks.Task OnConnected()
        {
            await SumarAlCanal();
            await base.OnConnected();
        }

        //Al reconectar (corte de red, cambio de transporte) SignalR no reconstruye los grupos solo: hay que volver a
        //sumar la conexion, si no el usuario queda conectado pero sin escuchar nada.
        public override async System.Threading.Tasks.Task OnReconnected()
        {
            await SumarAlCanal();
            await base.OnReconnected();
        }

        private System.Threading.Tasks.Task SumarAlCanal()
        {
            var userId = GetUserId();

            if (userId <= 0)
                return System.Threading.Tasks.Task.FromResult(0);

            return Groups.Add(Context.ConnectionId, Canales.Usuario(userId));
        }

        private int GetUserId()
        {
            try
            {
                var clientCode = Context.QueryString[SessionQueryKey];
                if (string.IsNullOrWhiteSpace(clientCode))
                    return 0;

                var json = Common.Utility.Helper.DecodeBase64String(clientCode);
                var session = Common.Utility.Helper.DeserializeObject<Session>(json);

                return session?.Usuario?.UsuarioId ?? 0;
            }
            catch (Exception)
            {
                //Una sesion ilegible es una conexion que no se puede atribuir a nadie: se deja conectada pero sin
                //grupo, asi no recibe nada. Tirar la excepcion aca cortaria el handshake con un error poco claro.
                return 0;
            }
        }
    }
}
