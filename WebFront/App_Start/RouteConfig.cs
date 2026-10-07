using System.Web.Mvc;
using System.Web.Routing;

namespace WebFront
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(name: "go", url: "go",
                defaults: new { controller = "Authentication", action = "Go" }
            );

            routes.MapRoute(name: "chats", url: "chats",
                defaults: new { controller = "chats", action = "chats" }
            );

            routes.MapRoute(name: "news", url: "news",
                defaults: new { controller = "News", action = "News" }
            );

            routes.MapRoute(name: "feed", url: "feed",
                defaults: new { controller = "Feed", action = "Feed" }
            );

            routes.MapRoute(name: "NotLoggin", url: "NotLoggin",
                defaults: new { controller = "Authentication", action = "NotLoggin" }
            );

            routes.MapRoute(name: "ChatGetLote", url: "Chats/GetLote",
                defaults: new { controller = "Chats", action = "GetLote" }
            );

            routes.MapRoute(name: "ChatGetMessages", url: "Chats/GetMessages",
                defaults: new { controller = "Chats", action = "GetMessages" }
            );

            routes.MapRoute(name: "ChatSendMessage", url: "Chats/SendMessage",
                defaults: new { controller = "Chats", action = "SendMessage" }
            );

            routes.MapRoute(name: "ChatMarkAsRead", url: "Chats/MarkAsRead",
                defaults: new { controller = "Chats", action = "MarkAsRead" }
            );

            //Ultima siempre: matchea cualquier cosa, asi que si se pone antes se come a todas las rutas
            //explicitas de arriba (/go terminaba resolviendo GoController.chats).
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { action = "chats", id = UrlParameter.Optional }
            );



        }

        


    }
}
