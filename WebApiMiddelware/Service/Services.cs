using Framework.Core.Header;
using System.Threading;

namespace WebApiMiddelware.Service
{
    public class Services<TBusiness>
    {

        public TBusiness setInstance { set; get; }
        private IInternalHeader _header;

        public TBusiness ActionBusiness()
        {

            var dataHeader = _header.ClientCode.Split(new[] { ':' });
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
            return setInstance;
        }

        public void setHeader(IInternalHeader header)
        {
            _header = header;
        }


    }
}