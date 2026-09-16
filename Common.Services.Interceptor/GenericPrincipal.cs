using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Principal;

namespace Common.Services.Interceptor
{
    [ComVisible(true)]
    public class GenericPrincipal : ClaimsPrincipal
    {
        //
        // Resumen:
        //     Inicializa una nueva instancia de la clase System.Security.Principal.GenericPrincipal
        //     a partir de una identidad de usuario y una matriz de nombres de roles al que
        //     pertenece el usuario representado por esa identidad.
        //
        // Parámetros:
        //   identity:
        //     Una implementación básica de System.Security.Principal.IIdentity que representa
        //     a cualquier usuario.
        //
        //   roles:
        //     Matriz de nombres de rol a la que pertenece el usuario representado por el parámetro
        //     identity.
        //
        // Excepciones:
        //   T:System.ArgumentNullException:
        //     El parámetro identity es null.
        public GenericPrincipal(IIdentity identity, string[] roles)
        {
            Identity = identity;
        }


        //
        // Resumen:
        //     Obtiene el objeto System.Security.Principal.GenericIdentity del usuario representado
        //     por System.Security.Principal.GenericPrincipal actual.
        //
        // Devuelve:
        //     System.Security.Principal.GenericIdentity del usuario representado por System.Security.Principal.GenericPrincipal.
        public override IIdentity Identity { get; }


    }
}
