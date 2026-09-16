using System;
using System.Threading;
using System.Web;

namespace Framework.Core.Header
{
    public class InternalHeaderFactory
    {
        public IInternalHeader GetInternalHeader(HttpContextBase context)
        {
            if (context == null ||
                context.Request == null ||
                context.Request.Headers == null)
            {
                throw new ArgumentNullException("Catastrofic Error - Botiseller");
            }

            var header = context.Request.Headers;

            return new Models.InternalHeader
            {
                ClientCode = header.Get("X-ClientCode"),
                SourceSystem = header.Get("X-SourceSystem"),
                AuthenticationToken = header.Get("Authorization"),
                SessionId = header.Get("X-SessionId"),
                RequestId = header.Get("X-RequestId"),
            };

        }

        public void CreateEnvironmentThred(IInternalHeader header) {
            var dataHeader = header.ClientCode.Split(new[] { ':' });
            var customIdentity = new Common.Services.Interceptor.CustomIdentity
            {
                Name = dataHeader[0],
                Family = dataHeader[1],
                IdUser = dataHeader[2],
                Product = dataHeader[3]
            };

            Thread.CurrentPrincipal = customIdentity;
            var threadCurrentPrincipal = new Common.Services.Interceptor.GenericPrincipal(customIdentity, null);
            Thread.CurrentPrincipal = threadCurrentPrincipal;
            
        }

    }
}
