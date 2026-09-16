using Autofac;
using Autofac.Integration.WebApi;
using Framework.Core.Header;
using System;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace WebApiMiddelware
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            var builder = new ContainerBuilder();

            RegisterEnvironmentAPI(builder);
            RegisterContext(builder);
            RegisterHeader(builder);

            Resolver(builder, config);
        }

        #region Registers

        private static void RegisterEnvironmentAPI(ContainerBuilder builder)
        {
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
        }

        private static void RegisterContext(ContainerBuilder builder)
        {
            builder.Register(c => new HttpContextWrapper(HttpContext.Current)).As<HttpContextBase>().InstancePerRequest();
        }

        private static void RegisterHeader(ContainerBuilder builder)
        {
            builder.Register(c => GetInternalHeaderResolver(c)).As<IInternalHeader>().InstancePerRequest();
        }

        private static IInternalHeader GetInternalHeaderResolver(IComponentContext c)
        {
            var header = new InternalHeaderFactory().GetInternalHeader(c.Resolve<HttpContextBase>());
            if (string.IsNullOrEmpty(header.SessionId))
            {
                header.SessionId = Guid.NewGuid().ToString();
            }

            if (string.IsNullOrEmpty(header.RequestId))
            {
                header.RequestId = Guid.NewGuid().ToString();
            }

            return header;
        }

        private static void Resolver(ContainerBuilder builder, HttpConfiguration config)
        {
            var container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
            config.MapHttpAttributeRoutes();
        }

        #endregion Registers
    }
}