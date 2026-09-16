using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Security.Claims;
using System.Security.Principal;

namespace Common.Services.Interceptor
{
    public class CustomIdentity : ClaimsPrincipal, IIdentity
    {
        public string AuthenticationType { get; set; }
        public bool IsAuthenticated { get; set; }

        public string Name { get; set; }
        public string Family { get; set; }
        public string IdUser { get; set; }
        public string Token { get; set; }
        public string Product { get; set; }

        public SoapInteger ConfiguracionUsuario { get; set; }
    }

    public class CustomUserConfiguration { 
        public SoapInteger GMT { get; set; }
    }

}
