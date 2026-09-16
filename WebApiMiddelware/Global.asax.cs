using System;
using System.Web;
using System.Web.Http;

namespace WebApiMiddelware
{
    public class Global : HttpApplication
    {
        private void Application_Start(object sender, EventArgs e)
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}