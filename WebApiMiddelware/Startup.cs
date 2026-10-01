using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(WebApiMiddelware.Startup))]
namespace WebApiMiddelware
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            OAuthConfig.Register(app);

            //El hub vive en este host porque es donde corre ChatBusinessService, que es quien empuja los avisos: asi
            //el push es en proceso, sin saltos. La pantalla corre en otro puerto (WebFront), por eso el CORS: sin esto
            //el navegador rechaza el handshake por venir de otro origen.
            app.Map("/signalr", mapa =>
            {
                mapa.UseCors(CorsOptions.AllowAll);

                //El resolver va explicito: el que empuja los avisos es GlobalHost.ConnectionManager (ver
                //Common.Websocket.Notificador) y tiene que compartir el mismo bus de mensajes que atiende las
                //conexiones. Si cada lado arma el suyo, el envio sale sin error y no lo recibe nadie.
                mapa.RunSignalR(new HubConfiguration { Resolver = GlobalHost.DependencyResolver });
            });
        }
    }
}
