using System;

namespace Business.Dto.Dtos.Authentication
{
    //Los tres pasos del login por SMS. Los tres llevan name y phone porque son llamadas previas al login, y
    //HttpClientWrapper.AnonymousSetSessions (AnonymousType.WithoutCredential) arma la identidad del hilo leyendo
    //esas dos propiedades por reflexion, por nombre exacto y en minuscula. Sin ellas la llamada al API revienta
    //antes de salir, y sin identidad el API no sabe con que conexion resolver la base.

    //Paso 1: el usuario deja su telefono y se le manda el codigo.
    public class RequestCodeDto
    {
        //Codigo de pais sin el "+" (ej "54"). Viaja separado del numero porque en pantalla son dos campos.
        public string countryCode { get; set; }
        public string phone { get; set; }
        public string name { get; set; }
    }

    //Paso 2: el usuario escribe el codigo que le llego.
    public class VerifyCodeDto
    {
        public string countryCode { get; set; }
        public string phone { get; set; }
        public string code { get; set; }
        public string name { get; set; }
    }

    //Paso 3: solo si el telefono no tenia usuario, o le faltaban datos.
    public class CompleteProfileDto
    {
        public string countryCode { get; set; }
        public string phone { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string mail { get; set; }
    }
}
