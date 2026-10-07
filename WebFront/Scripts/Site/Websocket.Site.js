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

        var aLaVista = document.visibilityState === 'visible';

        //ChatViewModel lo publica Models/Chat/Chat.js y solo existe estando en la pantalla del chat.
        var vm = window.ChatViewModel;
        var chatAbierto = !!(vm && vm.selectedChat() && vm.selectedChat().chatId() === notificacion.ChatId);

        //Solo se calla si el usuario lo esta viendo de verdad: con el chat abierto el mensaje le aparece solo en
        //pantalla. Si la pestana esta en segundo plano no vio nada, aunque el chat este abierto.
        if (chatAbierto && aLaVista) return;

        Avisar(notificacion);

        //El sonido es para cuando no esta mirando la pestana; estando a la vista alcanza con el aviso visual.
        if (!aLaVista) Sonar();
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

    //Dos notas cortas generadas con Web Audio, en vez de un archivo de sonido: no suma un binario al repo ni depende
    //de una descarga que puede fallar justo cuando hace falta.
    //El navegador bloquea el audio hasta que el usuario interactuo con la pagina; si todavia no paso, el contexto
    //queda suspendido y no suena nada. Es aceptable: para escuchar el aviso primero tuvo que entrar al chat.
    var audioContext = null;

    function Sonar() {
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') audioContext.resume();

            [880, 1175].forEach(function (frecuencia, i) {
                var desde = audioContext.currentTime + i * 0.13;

                var oscilador = audioContext.createOscillator();
                oscilador.type = 'sine';
                oscilador.frequency.value = frecuencia;

                //La envolvente evita el "clic" que se escucha al cortar una onda de golpe.
                var volumen = audioContext.createGain();
                volumen.gain.setValueAtTime(0, desde);
                volumen.gain.linearRampToValueAtTime(0.15, desde + 0.01);
                volumen.gain.exponentialRampToValueAtTime(0.001, desde + 0.12);

                oscilador.connect(volumen);
                volumen.connect(audioContext.destination);

                oscilador.start(desde);
                oscilador.stop(desde + 0.13);
            });
        } catch (e) {
            console.warn('Chatme: no se pudo reproducir el aviso.', e);
        }
    }

});
