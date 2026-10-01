namespace Common.Websocket
{
    //Nombres de los canales y de las funciones que escucha el navegador. Viven aca, en un solo lugar, porque el
    //servidor y el JS tienen que coincidir exactamente: si cambia uno sin el otro, el mensaje se manda a un canal
    //que nadie escucha y no hay error que avise.
    public static class Canales
    {
        //Canal propio de cada usuario. El del lado del JS esta en Scripts\Entities\Websocket.js.
        public static string Usuario(int usuarioId)
        {
            return "User-" + usuarioId;
        }
    }

    public static class Funciones
    {
        //Funcion que el navegador tiene registrada para recibir un mensaje nuevo.
        public const string MensajeRecibido = "messageRecive";
    }
}
