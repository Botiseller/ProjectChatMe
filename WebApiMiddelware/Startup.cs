using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebApiMiddelware.Startup))]
namespace WebApiMiddelware
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            OAuthConfig.Register(app);
        }
    }
}