using System;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Common.Websocket
{
    //Punto de entrada para avisarle a un usuario desde el servidor. Lo usa la capa de negocio (ver
    //ChatBusinessService.SendMessage) sin tener que saber nada de SignalR ni de como se arma el nombre del canal.
    public static class Notificador
    {
        //Envio generico: cualquier funcion de las que el navegador tenga registradas (ver Funciones). Es lo que hay
        //que usar para avisos nuevos; los metodos con nombre de abajo son solo atajos de los casos ya existentes.
        //Si el usuario no esta conectado no pasa nada: SignalR descarta el envio y el usuario lo va a ver igual al
        //abrir la pantalla, porque lo que importa ya quedo guardado en la base.
        //No propaga errores: que falle un aviso en tiempo real no puede voltear la operacion que lo origino.
        public static void Enviar(int usuarioId, string funcion, object payload)
        {
            if (usuarioId <= 0 || string.IsNullOrWhiteSpace(funcion))
                return;

            try
            {
                var hub = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();

                //Por IClientProxy y no por dynamic ("...Group(x).messageRecive(m)") para poder pasar el nombre de la
                //funcion como dato, que es lo que permite que este metodo sirva para cualquier aviso.
                IClientProxy canal = hub.Clients.Group(Canales.Usuario(usuarioId));
                canal.Invoke(funcion, payload);
            }
            catch (Exception ex)
            {


            }
        }

        //Le llego un mensaje nuevo al usuario.
        public static void MensajeNuevo(int usuarioId, object mensaje)
        {
            if (mensaje == null)
                return;

            Enviar(usuarioId, Funciones.MensajeRecibido, mensaje);
        }
    }
}
