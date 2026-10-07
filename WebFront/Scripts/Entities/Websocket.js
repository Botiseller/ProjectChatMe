//Conexion en tiempo real con el servidor. El usuario escucha un unico canal, el suyo, y por ahi el servidor le avisa
//de lo que le va pasando (ver Common.Websocket en el lado del servidor).
//Se usa el proxy que genera SignalR ($.connection.chatHub, que crea el script /signalr/hubs incluido en
//_BaseLayout.cshtml), asi cada funcion que el servidor puede invocar se registra con su nombre.
function WebsocketClass() {
    var me = this;

    var conectado = false;

    //Una funcion puede tener varios interesados: el aviso global (Site/Websocket.Site.js) quiere mostrar un toast y
    //la pantalla del chat quiere pintar el mensaje, los dos sobre messageRecive. Como $.connection.chatHub.client
    //admite una sola funcion por nombre, se guarda la lista aca y en el casillero va un unico repartidor.
    var suscriptores = {};

    //Hay websocket si cargo el proxy generado (si el API esta caido, ese script no llega y $.connection.chatHub no
    //existe) y si la pagina sabe con que sesion conectarse. Sin sesion no tiene sentido: el hub no podria saber de
    //quien es la conexion y no la sumaria a ningun canal.
    //url no se exige con valor: vacia significa mismo origen, que es como queda en produccion con /signalr detras
    //del proxy. Lo que no puede faltar es el clientCode.
    me.Disponible = function () {
        return !!($.connection && $.connection.chatHub && window.websocketConfig
                  && typeof websocketConfig.url === 'string' && websocketConfig.clientCode);
    };

    //Registra que hacer cuando el servidor invoque una funcion. nombre es el mismo string que usa el servidor en
    //Common.Websocket.Funciones (ver WebsocketClass.Funciones aca abajo).
    //IMPORTANTE: hay que registrar TODO antes de llamar a Conectar. SignalR arma la lista de hubs a los que se
    //suscribe mirando que funciones hay registradas en el momento del start: si al conectar no hay ninguna, no se
    //suscribe al hub y despues no llega nada, sin ningun error que lo avise.
    me.On = function (nombre, callback) {
        if (!me.Disponible() || typeof callback !== 'function') return;

        if (!suscriptores[nombre]) {
            suscriptores[nombre] = [];

            //El repartidor se instala una sola vez por nombre. Si en vez de esto se asignara el callback directo, el
            //segundo On del mismo nombre pisaria al primero y uno de los dos interesados dejaria de enterarse.
            $.connection.chatHub.client[nombre] = function () {
                var args = arguments;

                suscriptores[nombre].forEach(function (suscriptor) {
                    //Si uno falla, los demas tienen que recibir igual: sin esto un error en el toast dejaria al chat
                    //sin pintar el mensaje.
                    try { suscriptor.apply(null, args); }
                    catch (e) { console.warn('Chatme: fallo un suscriptor de ' + nombre, e); }
                });
            };
        }

        suscriptores[nombre].push(callback);
    };

    me.Conectar = function () {
        if (!me.Disponible() || conectado) return;

        //$.connection.hub es unico para toda la pagina (lo crea el proxy generado), asi que si alguien ya conecto no
        //hay que volver a arrancarlo: un segundo start sobre la misma conexion tira error.
        if ($.connection.hub.state !== $.signalR.connectionState.disconnected) {
            conectado = true;
            return;
        }

        //El hub vive en el WebApiMiddelware, que es otro puerto que el de esta pantalla: hay que apuntarlo a mano
        //porque el proxy generado asume, por defecto, que el hub esta en el mismo sitio que la pagina.
        $.connection.hub.url = websocketConfig.url + '/signalr';

        //El query string es la unica via para identificarse: el handshake de websocket no permite headers propios,
        //asi que el X-ClientCode que el resto del API manda por header aca viaja por aca.
        $.connection.hub.qs = { clientCode: websocketConfig.clientCode };

        conectado = true;

        //Si el navegador no soporta websocket, SignalR baja solo a long polling. Un fallo al conectar no rompe nada:
        //la pantalla sigue andando y lo que haya se ve igual al recargar, solo que no en el momento.
        $.connection.hub.start().fail(function (error) {
            conectado = false;
            console.warn('Chatme: no se pudo conectar al tiempo real.', error);
        });
    };

    me.Desconectar = function () {
        if (!conectado) return;

        $.connection.hub.stop();
        conectado = false;
    };

};

//Nombres de las funciones que el servidor puede invocar. Van aca, y no sueltos en cada pantalla, para que haya un
//solo lugar que tenga que coincidir con Common.Websocket.Funciones del lado del servidor. Si un nombre no coincide,
//el mensaje llega igual y se descarta en silencio, asi que no conviene escribirlos a mano en cada uso.
WebsocketClass.Funciones = {
    MensajeRecibido: 'messageRecive'
};
