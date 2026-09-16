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
                    request.Headers.Add("X-ClientCode", currentPrincipal.Name + ":" + currentPrincipal.Family + ":" + currentPrincipal.IdUser + ":" + currentPrincipal.Product + ":" + currentPrincipal.Token);
                }
                else
                {
                    var currentPrincipal = ((System.Security.Claims.ClaimsPrincipal)Thread.CurrentPrincipal).Identities.First();
                    var ticket = ((System.Web.Security.FormsIdentity)currentPrincipal).Ticket.UserData;
                    request.Headers.Add("X-ClientCode", ticket);
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