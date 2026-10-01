function FactoryChat() {
    var self = this;

    //Unico envio, con o sin adjunto: va siempre como multipart/form-data porque el archivo es binario y no entra en un
    //JSON. file es opcional. El lado del server desactiva la validacion de peticion de ASP.NET (ver ChatsController.SendMessage),
    //que si no rechazaria un "<b" escrito por el usuario.
    self.SendMessage = function (chatId, text, file, button) {
        var formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('text', text || '');
        //El nombre va explicito: una nota de voz puede venir como Blob pelado (ver Grabador.toFile) y sin el tercer
        //parametro FormData la mandaria como "blob", sin extension, y el server no podria deducir el tipo.
        if (file) formData.append('file', file, file.name || 'archivo');
        //button solo viene cuando el usuario respondio tocando un boton del negocio. Va el objeto entero serializado,
        //no solo el payload: del otro lado se deserializa completo (ver ChatsController.SendMessage).
        if (button) formData.append('button', JSON.stringify(button));

        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Chats/SendMessage',
            data: formData,
            contentType: false,
            processData: false
        });
    };

    //beforeId: MensajeId desde el cual traer los anteriores; 0 trae los mas recientes.
    self.GetMessages = function (chatId, beforeId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Chats/GetMessages',
            data: { chatId: chatId, beforeId: beforeId || 0 }
        });
    };

    self.GetLote = function (lote) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Chats/GetLote',
            data: { lote: lote }
        });
    };

};