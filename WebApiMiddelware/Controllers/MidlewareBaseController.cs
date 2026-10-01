using System;
using System.Web.Http;
using Framework.Core.Header;

namespace WebApiMiddelware.Controllers
{
    public class MidlewareBaseController : ApiController
    {
        public MidlewareBaseController(IInternalHeader header)
        {
            new InternalHeaderFactory().CreateEnvironmentThread(header);
        }

    }
}