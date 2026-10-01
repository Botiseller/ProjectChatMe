using System;
using System.Net;
using System.Runtime.Remoting.Messaging;
using System.Threading;
using System.Web;
using System.Web.Security;
using Business.Entities.Security;
using static System.Collections.Specialized.BitVector32;

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

        public void CreateEnvironmentThread(IInternalHeader header) {
            var authTicket = header.ClientCode;
            if (authTicket != null) {
                var familyUser = Common.Utility.Helper.DecodeBase64String(authTicket);
                var s = Common.Utility.Helper.DeserializeObject<Session>(familyUser);


                var customIdentity = new Common.Services.Interceptor.CustomIdentity
                {
                    Name = "",
                    session = s
                };

                Thread.CurrentPrincipal = customIdentity;
                var threadCurrentPrincipal = new Common.Services.Interceptor.GenericPrincipal(customIdentity, null);
                Thread.CurrentPrincipal = threadCurrentPrincipal;
            }
        }

    }
}
