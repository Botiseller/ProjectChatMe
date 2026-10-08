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
using PhoneNumbers;

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
                //Mismo telefono normalizado y misma busqueda que el login por SMS: si no, quien entra por el chatbot y
                //despues por la pantalla de login termina con dos usuarios.
                var telefono = Telefono(null, auth.userPhone);

                user = businessUser.searchByPhone(telefono);
                if (user == null)
                {
                    user = businessUser.create(new User()
                    {
                        Nombre = auth.name,
                        Telefono = telefono,

                    });
                }
                if (!string.IsNullOrEmpty(auth.userId))
                    businessUser.updateProviderData(auth.userId, auth.provider, user.UsuarioId);
            }

            var session = new Session() { 
                Init = DateTime.Now,
                Usuario = user
            };
            return session;
        }

        public Authentication getToken(string code, string secret, string tokenProveedor) {
            return ChatbotDesarrolloServicesFacade.ShopServices.token(code,secret, tokenProveedor);
        }

        public Provider getProvider(string code)
        {
            return ChatbotDesarrolloServicesFacade.ProviderServices.getByCode(code);
        }

        //Cuanto vive un codigo y cuantas veces se puede errar antes de que deje de servir. Son reglas del login,
        //por eso viven aca y no en el manager, que solo guarda y lee la fila.
        private const int MinutosVigencia = 10;
        private const int IntentosMaximos = 5;

        //Paso 1. Siempre manda el codigo, exista o no el usuario: contestar distinto segun el caso seria decirle a
        //cualquiera que pruebe un numero si esa persona esta registrada.
        public void RequestCode(RequestCodeDto request)
        {
            var telefono = Telefono(request.countryCode, request.phone);

            var codigo = Codigo();

            ChatbotDesarrolloServicesFacade.SmsCodeServices.create(new SmsCode()
            {
                Telefono = telefono,
                Codigo = codigo,
                FechaVence = DateTime.UtcNow.AddMinutes(MinutosVigencia)
            });

            Common.Utility.Sms.Sms.Enviar("+" + telefono, "Tu código de Chatme es " + codigo);
        }

        //Paso 2. Validar el codigo no alcanza para entrar: si el telefono no tiene usuario, o lo tiene sin nombre o
        //sin mail, falta completar el perfil. En ese caso el codigo queda vivo, porque CompleteProfile lo vuelve a
        //pedir: es lo unico que prueba que ese telefono es de quien esta del otro lado.
        public LoginResult VerifyCode(VerifyCodeDto request)
        {
            var telefono = Telefono(request.countryCode, request.phone);

            Validar(telefono, request.code);

            var user = new UserBusinessService().searchByPhone(telefono);

            if (user != null && !string.IsNullOrEmpty(user.Nombre) && !string.IsNullOrEmpty(user.Mail))
                return Entrar(telefono, user);

            return new LoginResult() { NeedsProfile = true, Usuario = user };
        }

        //Paso 3. Crea el usuario o completa el que ya existia, y recien ahi entrega la sesion.
        public LoginResult CompleteProfile(CompleteProfileDto request)
        {
            var telefono = Telefono(request.countryCode, request.phone);

            Validar(telefono, request.code);

            if (string.IsNullOrWhiteSpace(request.name))
                throw new InvalidOperationException("Necesitamos tu nombre para continuar.");

            if (string.IsNullOrWhiteSpace(request.mail))
                throw new InvalidOperationException("Necesitamos tu mail para continuar.");

            var businessUser = new UserBusinessService();
            var user = businessUser.searchByPhone(telefono);

            if (user == null)
            {
                user = businessUser.create(new User()
                {
                    Nombre = request.name.Trim(),
                    Mail = request.mail.Trim(),
                    Telefono = telefono
                });
            }
            else
            {
                user.Nombre = request.name.Trim();
                user.Mail = request.mail.Trim();
                user.Telefono = telefono;
                businessUser.update(user);
            }

            return Entrar(telefono, user);
        }

        //Da por consumido el codigo y arma la sesion. Los dos pasos van juntos siempre: un codigo que ya sirvio para
        //entrar no tiene que poder usarse una segunda vez.
        private LoginResult Entrar(string telefono, User user)
        {
            var code = ChatbotDesarrolloServicesFacade.SmsCodeServices.last(telefono);
            if (code != null)
                ChatbotDesarrolloServicesFacade.SmsCodeServices.markUsed(code.SmsCodeId);

            return new LoginResult()
            {
                NeedsProfile = false,
                Usuario = user,
                Session = new Session() { Init = DateTime.Now, Usuario = user }
            };
        }

        //Lo comparten los pasos 2 y 3, que validan el mismo codigo. El intento fallido se cuenta antes de avisar,
        //para que probar codigos al azar se agote solo.
        private void Validar(string telefono, string codigo)
        {
            var code = ChatbotDesarrolloServicesFacade.SmsCodeServices.last(telefono);

            if (code == null || code.FechaUso != null)
                throw new InvalidOperationException("Pedí un código nuevo para continuar.");

            if (code.FechaVence < DateTime.UtcNow)
                throw new InvalidOperationException("El código venció. Pedí uno nuevo.");

            if (code.Intentos >= IntentosMaximos)
                throw new InvalidOperationException("Demasiados intentos. Pedí un código nuevo.");

            if (code.Codigo != (codigo ?? string.Empty).Trim())
            {
                ChatbotDesarrolloServicesFacade.SmsCodeServices.addAttempt(code.SmsCodeId);
                throw new InvalidOperationException("El código no coincide.");
            }
        }

        //Toda forma de escribir un numero termina en la misma: codigo de pais + numero nacional, solo digitos. Es la
        //clave del usuario, asi que si dos escrituras del mismo telefono no coinciden la misma persona queda como dos
        //usuarios. libphonenumber resuelve lo que depende del pais (el 0 de larga distancia, el 15 de los celulares
        //argentinos, el + y los separadores). Desde la pantalla pais y numero llegan separados; desde el chatbot llega
        //el numero internacional entero y sin pais aparte.
        private string Telefono(string countryCode, string phone)
        {
            var util = PhoneNumberUtil.GetInstance();
            PhoneNumber numero;

            try
            {
                numero = string.IsNullOrEmpty(countryCode)
                    ? util.Parse("+" + (phone ?? string.Empty).TrimStart('+'), "ZZ")
                    : util.Parse(phone, util.GetRegionCodeForCountryCode(int.Parse(countryCode)));
            }
            catch (NumberParseException)
            {
                throw new InvalidOperationException("El teléfono no es válido.");
            }

            if (!util.IsValidNumber(numero))
                throw new InvalidOperationException("El teléfono no es válido.");

            var nacional = util.GetNationalSignificantNumber(numero);

            //En Argentina el 9 no cambia de linea: 11 3262-9712 y 9 11 3262-9712 son el mismo abonado, y solo con el 9
            //llega el SMS y coincide con lo que manda WhatsApp. libphonenumber no lo agrega porque sin 9 ni 15 el
            //numero tambien es un fijo valido.
            if (numero.CountryCode == 54 && !nacional.StartsWith("9"))
                nacional = "9" + nacional;

            return numero.CountryCode + nacional;
        }

        //Seis digitos con el generador criptografico: Random se siembra con el reloj y dos pedidos en el mismo
        //instante pueden salir iguales.
        private string Codigo()
        {
            var bytes = new byte[4];
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                rng.GetBytes(bytes);
            }

            return (BitConverter.ToUInt32(bytes, 0) % 1000000).ToString("D6");
        }


    }
}
