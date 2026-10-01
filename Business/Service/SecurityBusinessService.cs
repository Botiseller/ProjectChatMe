using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business.Contracts.Service;
using Business.Dto.Dtos.Apis;
using Business.Dto.Dtos.Authentication;
using Business.Entities;
using Business.Entities.Security;
using ChatbotDesarrollo.Core.Facade;

namespace Business.Service
{
    public class SecurityBusinessService : ISecurityBusinessService
    {

        public Session Loggin(AuthenticationDto auth)
        {

            //1. consweguir usuario por telefono
            //2. consweguir negocio por telefono
            //3. crear el chat en caso de que existiera
            //4. crear objeto session
            var businessUser = new UserBusinessService();

            var user = businessUser.search(auth.userId, auth.provider);
            if (user == null) {
                user = businessUser.search(auth.userPhone);
                if (user == null)
                {
                    user = businessUser.create(new User()
                    {
                        Nombre = auth.name,
                        Telefono = auth.userPhone,

                    });
                }
                if (!string.IsNullOrEmpty(auth.userId))
                    businessUser.updateProviderData(auth.userId, auth.provider, user.UsuarioId);
            }
                

            //var business = new ShopBusinessService().search(auth.businessPhone);
            //if (business != null) {
            //    Chat c = new Chat()
            //    {
            //        FechaInicio = DateTime.UtcNow,
            //        NegocioId = business.NegocioId,
            //        UsuarioId = user.UsuarioId,
            //        Mensajes = auth.history.Select(h => new Mensaje()
            //        {
            //            Fecha = DateTime.UtcNow,
            //            EnviadPor = h.from == "user" ? MensajeEnviadoPor.Usuario : MensajeEnviadoPor.Negocio,
            //            Estado = MensajeEstado.Recibido,
            //            Detail = new MessageDetail()
            //            {
            //                Text = h.text
            //            }
            //        }).ToList()
            //    };

            //    var chat = new ChatBusinessService().create(c);
            //}

            var session = new Session() { 
                Init = DateTime.Now,
                Usuario = user
            };
            return session;
        }

        public Authentication getToken(string code, string secret, string tokenProveedor) {
            return ChatbotDesarrolloServicesFacade.ShopServices.token(code,secret, tokenProveedor);
        }


    }
}
