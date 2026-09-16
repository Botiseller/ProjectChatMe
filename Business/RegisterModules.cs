using Autofac;
using Business.Models;
using Business.Models.Validators;
using FluentValidation;

namespace Business
{
    public class RegisterModules : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ConnectionValidator>().As<IValidator<Connection>>().InstancePerRequest();

            
        }
    }
}