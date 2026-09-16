using Autofac;
using Autofac.Extras.DynamicProxy2;
using Business.Contracts.Service;
using Business.Models;
using Business.Models.Validators;
using Business.Service;
using FluentValidation;

namespace Business
{
    public class RegisterModules : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ConnectionValidator>().As<IValidator<Connection>>().InstancePerRequest();

            builder.RegisterType<SharedBusinessService>().As<ISharedBusinessService>().EnableInterfaceInterceptors();

        }
    }
}