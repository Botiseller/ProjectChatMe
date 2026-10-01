using Common.Services.Interceptor;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Common.CallApi
{
    public sealed class HttpClientMessageHandnler : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
                
                if (Thread.CurrentPrincipal.Identity is CustomIdentity)
                {
                    var currentPrincipal = ((CustomIdentity)Thread.CurrentPrincipal.Identity);

                    //Va la Session y no la identity entera. Del otro lado, InternalHeaderFactory.CreateEnvironmentThread
                    //deserializa este header como Session a secas: mandando la identity, la Session quedaba anidada en
                    //una propiedad "session" y Usuario salia null, que es lo que despues rompe GetUserBySession.
                    //La rama de abajo (FormsIdentity) ya mandaba una Session a secas; ahora las dos coinciden.
                    request.Headers.Add("X-ClientCode", Utility.Helper.Base64Encode(Utility.Helper.SerializeObjectSimple(currentPrincipal.session)));
                }
                else
                {
                    var currentPrincipal = ((System.Security.Claims.ClaimsPrincipal)Thread.CurrentPrincipal).Identities.First();
                    if (currentPrincipal is System.Web.Security.FormsIdentity) {
                        var ticket = ((System.Web.Security.FormsIdentity)currentPrincipal).Ticket.UserData;
                        request.Headers.Add("X-ClientCode", ticket);
                    }
                }
                
                return base.SendAsync(request, cancellationToken);
            }
            catch 
            {
                //throw ex;
                return null;
            }
        }
    }
}