using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "v1/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            config.Routes.MapHttpRoute(
                name: "Authentication", routeTemplate: "v1/Authentication",
                defaults: new { controller = "Authentication", action = "authenticate" }
            );

            config.Routes.MapHttpRoute(
                name: "SendMessage", routeTemplate: "v1/Message",
                defaults: new { controller = "Message", action = "Send" }
            );

            //Va al final: el ApiExplorer que usa Swagger arma la documentacion leyendo las rutas ya registradas.
            SwaggerConfig.Register(config);
        }
    }
}
