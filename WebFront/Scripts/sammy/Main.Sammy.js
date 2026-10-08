
var sammy = $.sammy(function () {
    var self = this;

    self._checkFormSubmission = function (form) {
        return true;
    };


    //Es el hash de "ninguna pantalla en particular", y en el chat eso significa la lista sin conversacion abierta:
    //aca llega la flecha de volver (ChatVM.CloseChat) y tambien el boton atras del navegador o del telefono saliendo
    //de #chat/:id. En la primera carga ChatViewModel todavia no existe y no hay nada que cerrar.
    self.get('#Home', function (context) {
        if (window.ChatViewModel) {
            window.ChatViewModel.Deselect();
        }
    });

    //La pantalla de login ya no pasa por aca: Models/Authentication/Authentication.js se ata solo en su ready,
    //como hace la del chat. Dejar la ruta llamando a una funcion que ya no existe rompia el hash #authentication.

    //Deep link a un chat puntual: #chat/<id en base64, url-encoded>. Lo arma Scripts/Models/Chat/Chat.js (ChatVM.OpenChat)
    //al hacer click en una fila; Sammy decodifica el parametro solo (ver _decode en sammy-0.7.5.js), asi que context.params.id
    //ya viene listo para pasar por $.base64.decode.
    //Si esta ruta corre antes de que ChatVM exista (primera carga de la pagina: este script se ejecuta antes que
    //Scripts/Models/Chat/Chat.js), se deja el id pendiente y ChatVM lo abre el termina de cargar la lista de chats.
    self.get('#chat/:id', function (context) {
        var chatId = parseInt($.base64.decode(context.params.id), 10);
        if (isNaN(chatId)) return;

        if (window.ChatViewModel) {
            window.ChatViewModel.OpenChatId(chatId);
        } else {
            window.PendingChatId = chatId;
        }
    });

});

$(function () {
    //Si la URL ya trae un hash (ej. un link a #chat/xxx), se respeta en vez de pisarlo con Home.
    sammy.run(window.location.hash || '#Home');
});