using Common.Services.Interceptor;
using Common.Utility;
using System;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using WebFront.Controllers;

namespace WebFront
{
    public class MvcApplication : HttpApplication
    {
     
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Page_Init(object sender, EventArgs e)
        {
            ValidateSessionState();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            ValidateSessionState();
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            Session.Timeout = 525600;
            ValidateSessionState();
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            var page = Request.Path;

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            var application = (HttpApplication)sender;
            var context = application.Context;

            if (Request.IsAuthenticated)
            {
                var cookie = context.Request.Cookies[FormsAuthentication.FormsCookieName];

                if (cookie == null) return;

                var authTicket = FormsAuthentication.Decrypt(cookie.Value);

                var familyUser = authTicket.UserData.Split(new[] { ':' });

                //build a custom identity and custom principal object based on this username
                CustomIdentity identity = new CustomIdentity
                {
                    Name = familyUser[0],
                    Family = familyUser[1],
                    IdUser = familyUser[2],
                    Product = familyUser[3],
                    Token = familyUser[4]
                };

                GenericPrincipal principal = new GenericPrincipal(identity, null);

                //set the principal to the current context
                //HttpContext.Current.User = principal;
                Thread.CurrentPrincipal = principal;
            }
        }


        protected void Application_Error(object sender, EventArgs e)
        {
            log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            var httpContext = ((MvcApplication)sender).Context;
            var currentRouteData = RouteTable.Routes.GetRouteData(new HttpContextWrapper(httpContext));
            var currentController = " ";
            var currentAction = " ";

            if (currentRouteData != null)
            {
                if (currentRouteData.Values["controller"] != null && !string.IsNullOrEmpty(currentRouteData.Values["controller"].ToString()))
                {
                    currentController = currentRouteData.Values["controller"].ToString();
                }

                if (currentRouteData.Values["action"] != null && !string.IsNullOrEmpty(currentRouteData.Values["action"].ToString()))
                {
                    currentAction = currentRouteData.Values["action"].ToString();
                }
            }

            var ex = Server.GetLastError();
            ErrorController errorController = new ErrorController();
            RouteData routeData = new RouteData();
            var action = "Error";

            if (ex is HttpException)
            {
                var httpEx = ex as HttpException;

                switch (httpEx.GetHttpCode())
                {
                    case 404:
                        action = "NotFound";
                        break;

                    case 401:
                        action = "NotAutorized";
                        break;

                    default:
                        action = "Error";
                        break;
                }
            }

            //logueo del error
            log.Error(action + ": " + ex.Message);

            httpContext.ClearError();
            httpContext.Response.Clear();

            var exception = ex as HttpException;

            httpContext.Response.StatusCode = exception != null ? exception.GetHttpCode() : 500;
            httpContext.Response.TrySkipIisCustomErrors = true;

            routeData.Values["controller"] = "Error";
            routeData.Values["action"] = action;

            errorController.ViewData.Model = new HandleErrorInfo(ex, currentController, currentAction);
            ((IController)errorController).Execute(new RequestContext(new HttpContextWrapper(httpContext), routeData));
        }

        protected void Session_End(object sender, EventArgs e)
        {
        }

        protected void Application_End(object sender, EventArgs e)
        {
        }

        private void ValidateSessionState()
        {
            try
            {
                string lcReqPath = Request.Path.ToLower();

                if (!lcReqPath.Contains("/authentication") && !lcReqPath.Contains("/error"))
                {
                    if (Context.Session != null)
                    {
                    
                        if (Session.IsNewSession)
                        {
                            HttpCookie newSessionIdCookie = Request.Cookies["ASP.NET_SessionId"];

                            if (newSessionIdCookie != null)
                            {
                                string newSessionIdCookieValue = newSessionIdCookie.Value;

                                if (newSessionIdCookieValue != string.Empty)
                                {
                                    
                                        Response.Redirect("/Index/Index");
                                    

                                }
                            }
                        }
                    }
                }
            }
            catch
            {
            }
        }
    }
}
