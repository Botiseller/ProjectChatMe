using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using Swashbuckle.Application;

namespace WebAPI
{
    public class SwaggerConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config
                .EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "ChatMe API");

                    //WebApiConfig registra la ruta generica "v1/{controller}/{id}" ademas de una ruta con nombre por
                    //endpoint ("v1/Authentication", "v1/Message"), asi que el ApiExplorer ve la misma accion dos veces
                    //con el mismo path y verbo. Sin esto Swashbuckle corta con "Conflicting method/path combination".
                    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());

                    //El token de authenticate viaja por query string en cada llamada, no por header, asi que no hace
                    //falta declarar un esquema de seguridad: cada operacion ya lo expone como parametro.

                    //Los comentarios /// se compilan a bin\WebAPI.xml (ver DocumentationFile en el csproj).
                    var xml = Path.Combine(HttpRuntime.BinDirectory, "WebAPI.xml");
                    if (File.Exists(xml))
                        c.IncludeXmlComments(xml);

                    c.DescribeAllEnumsAsStrings();
                })
                .EnableSwaggerUi(c =>
                {
                    c.DocumentTitle("ChatMe API");
                    c.DocExpansion(DocExpansion.List);
                });
        }
    }
}
