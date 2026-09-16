using Framework.Core.Header;
using System.Web.Http;

namespace WebApiMiddelware.Controllers
{
    public class MidlewareBaseController : ApiController
    {
        public MidlewareBaseController(IInternalHeader header)
        {
            new InternalHeaderFactory().CreateEnvironmentThred(header);
        }
    }
}