using System;

namespace Business.Entities.Security
{
    //Respuesta de los pasos del login por SMS. Validar el codigo no siempre alcanza para entrar: si el telefono
    //todavia no tiene usuario, o lo tiene sin nombre o sin mail, falta el paso de completar el perfil y por eso
    //Session viene vacia. La pantalla decide con NeedsProfile si va a los chats o pide los datos.
    public class LoginResult
    {
        public bool NeedsProfile { get; set; }
        public Session Session { get; set; }

        //Lo que ya se sabe del usuario cuando hay que completar el perfil, para no pedirle de nuevo lo que ya cargo.
        public User Usuario { get; set; }
    }
}
