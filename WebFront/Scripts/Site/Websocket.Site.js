//Conexion en tiempo real de toda la aplicacion. Vive en el layout, no en una pantalla: asi el usuario se entera de
//que le llego un mensaje este donde este, y no solo cuando tiene el chat abierto.
//La conexion queda publicada en window.Websocket y es UNICA: el proxy de SignalR ($.connection.hub) es uno solo por
//pagina, asi que la pantalla del chat se cuelga de esta misma en vez de armar la suya (ver Models/Chat/Chat.js).
$(document).ready(function () {

    var websocket = new WebsocketClass();
    window.Websocket = websocket;

    //Sin sesion o sin el proxy del API no hay tiempo real; la aplicacion sigue andando igual, solo que hay que
    //recargar para ver lo nuevo.
    if (!websocket.Disponible()) return;

    var chatClass = new ChatClass();

    websocket.On(WebsocketClass.Funciones.MensajeRecibido, function (notificacion) {
        if (!notificacion || !notificacion.Message) return;

        //Si el usuario ya esta mirando ese chat no hace falta avisarle nada: el mensaje le aparece solo en pantalla.
        //ChatViewModel lo publica Models/Chat/Chat.js y solo existe estando en la pantalla del chat.
        var vm = window.ChatViewModel;
        if (vm && vm.selectedChat() && vm.selectedChat().chatId() === notificacion.ChatId) return;

        Avisar(notificacion);
    });

    websocket.Conectar();

    //Aca va el aviso al usuario; por ahora solo deja rastro en la consola. Se usa el mismo mapeo de siempre para el
    //texto, asi un mensaje con adjunto dice "Foto" o "Audio" en vez de venir vacio.
    function Avisar(notificacion) {
        var message = chatClass.ToView(notificacion.Message);

        console.log('Chatme: mensaje nuevo', {
            chatId: notificacion.ChatId,
            de: message.fromName,
            texto: chatClass.PreviewFor(message)
        });
    }

});
