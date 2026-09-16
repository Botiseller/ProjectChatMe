using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Common.CallApi
{
    public sealed class HttpClientMessageHpHandnler : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
           
                
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