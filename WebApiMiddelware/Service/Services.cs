using System.Threading;
using Business.Entities.Security;
using Framework.Core.Header;

namespace WebApiMiddelware.Service
{
    public class Services<TBusiness>
    {

        public TBusiness setInstance { set; get; }
        private IInternalHeader _header;

        public TBusiness ActionBusiness()
        {

            var dataHeader = _header.ClientCode;
            var familyUser = Common.Utility.Helper.DecodeBase64String(dataHeader);
            var s = Common.Utility.Helper.DeserializeObject<Session>(familyUser);

            var customIdentity = new Common.Services.Interceptor.CustomIdentity
            {
                //Name = dataHeader[0],
                //IdUser = dataHeader[2],
                session = s
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