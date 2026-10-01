function ChatVM() {
    var self = this;

    var lote = 0;
    var chatClass = new ChatClass();
    var archivoClass = new ArchivoClass();
    var grabadorClass = new GrabadorClass();


    //Tamano de pagina de chats; tiene que ser igual al Skip/Take de lote en ChatManager.GetLote.
    var chatsPageSize = 20;

    self.chatList = ko.observableArray([]);
    self.loading = ko.observable(true);
    self.loadingMoreChats = ko.observable(false);
    self.hasMoreChats = ko.observable(true);

    //Tamano de pagina de mensajes; tiene que ser igual a MessagesPageSize de ChatManager.
    var messagesPageSize = 20;

    self.selectedChat = ko.observable(null);
    self.messages = ko.observableArray([]);
    self.loadingMessages = ko.observable(false);
    self.loadingOlder = ko.observable(false);
    self.hasMoreMessages = ko.observable(false);

    self.draft = ko.observable('');
    self.sending = ko.observable(false);
    //no se puede enviar hasta que termine de cargar el chat: si no, la carga inicial pisaria el mensaje recien enviado
    //se puede mandar con solo texto, solo archivo, o los dos juntos.
    self.canSend = ko.pureComputed(function () {
        return !!self.selectedChat() && !self.loadingMessages() && !self.sending() && (self.draft().trim().length > 0 || !!self.attachment());
    });

    //Archivo elegido (o arrastrado) en la barra de escribir, antes de mandarlo. Ver Entities/Archivo.js.
    self.attachment = ko.observable(null);
    self.dragOver = ko.observable(false);

    //Nota de voz (ver Entities/Grabador.js). canRecord se resuelve una sola vez: si el browser no tiene MediaRecorder
    //o la pagina no esta en contexto seguro, el boton de microfono directamente no se muestra.
    self.canRecord = ko.observable(grabadorClass.Supported());
    self.recording = grabadorClass.recording;
    self.recordingTime = grabadorClass.timeLabel;

    //El boton de enviar aparece cuando hay algo para mandar; si no, en su lugar va el de microfono.
    self.hasSomethingToSend = ko.pureComputed(function () {
        return self.draft().trim().length > 0 || !!self.attachment();
    });

    self.StartRecording = function () {
        if (!self.selectedChat() || self.loadingMessages() || self.sending() || self.recording()) return;

        self.showEmojis(false);

        grabadorClass.Start().fail(function () {
            //Puede ser permiso denegado o directamente no haber microfono conectado: para el usuario es lo mismo.
            toastr.warning('No se pudo usar el micrófono. Revisá los permisos del navegador.');
        });
    };

    //Corta la grabacion y la deja adjunta en la barra, para poder escribir algo antes de mandarla o descartarla.
    self.StopRecording = function () {
        if (!self.recording()) return;

        var seconds = grabadorClass.seconds();

        grabadorClass.Stop().done(function (file) {
            self.AttachFile(file, seconds);
        }).fail(function () {
            toastr.warning('No se pudo guardar la grabación.');
        });
    };

    self.CancelRecording = function () {
        grabadorClass.Cancel();
    };

    //Al llegar al tope la grabacion se corta sola y queda adjunta, como si se hubiera tocado el boton de listo.
    grabadorClass.seconds.subscribe(function (value) {
        if (value >= grabadorClass.maxSeconds) self.StopRecording();
    });

    //URL de la imagen que se esta viendo en grande (visor a pantalla completa), o null si esta cerrado.
    self.viewerImage = ko.observable(null);

    self.OpenImage = function (message) {
        self.viewerImage(message.image);
    };

    self.CloseImage = function () {
        self.viewerImage(null);
    };

    //Se llama desde la fila del chat (chats.cshtml). No selecciona directo: cambia el hash y deja que la ruta de Sammy
    //(#chat/:id, en Scripts/Sammy/Main.Sammy.js) dispare la seleccion real. Asi el chat abierto queda en la URL:
    //se puede compartir el link, recargar la pagina sin perderlo, y volver con el boton "atras" del navegador.
    self.OpenChat = function (chat) {
        location.hash = '#chat/' + encodeURIComponent($.base64.encode(String(chat.chatId())));
    };

    //Lo llama la ruta de Sammy con el id ya decodificado. Busca el chat en la lista cargada y lo abre; si todavia no
    //esta (la lista no termino de cargar), Load() reintenta esto mismo al terminar - ver mas abajo, window.PendingChatId.
    self.OpenChatId = function (chatId) {
        var chat = self.chatList().filter(function (c) { return c.chatId() === chatId; })[0];
        if (chat) {
            self.select(chat);
        } else {
            console.warn('Chatme: no se encontro el chat ' + chatId + ' en la lista cargada.');
        }
    };

    self.select = function (chat) {
        if (self.selectedChat() === chat) return;

        self.selectedChat(chat);
        self.draft('');
        self.showEmojis(false);
        //Una grabacion a medias pertenece al chat en el que se empezo, no se arrastra al que se abre ahora.
        self.CancelRecording();
        self.RemoveAttachment();
        self.messages([]);
        self.hasMoreMessages(false);
        self.loadingOlder(false);
        self.loadingMessages(true);

        chatClass.GetMessages(chat.chatId(), 0).done(function (result) {
            //si mientras cargaba se eligio otro chat, esta respuesta ya no corresponde
            if (self.selectedChat() !== chat) return;

            self.messages(result);
            self.hasMoreMessages(result.length >= messagesPageSize);
        }).always(function () {
            if (self.selectedChat() !== chat) return;

            self.loadingMessages(false);
            scrollChatToBottom();

            //si los 20 no llenan la pantalla no hay scroll para disparar la carga, asi que se pide la pagina anterior ya
            self.LoadOlderMessages();
        });
    };

    //Envia lo escrito en el campo, el archivo adjunto (ver Entities/Archivo.js), o los dos juntos.
    self.Send = function () {
        if (!self.canSend()) return;

        var text = self.draft().trim();
        var archivo = self.attachment();

        self.draft('');
        //Solo limpia el estado de la barra de escribir: el preview local sigue vivo para el mensaje pendiente y se
        //libera recién cuando termina el envio (ver sendMessage), no aca.
        self.attachment(null);

        sendMessage(text, archivo);
    };

    //Se llama al tocar un boton de respuesta rapida (Detail.Buttons) de un mensaje del negocio: manda el texto del
    //boton como si el usuario lo hubiera escrito, y ademas el boton entero, que es como el payload llega hasta el
    //webhook del proveedor (ver ChatBusinessService.SendWebhook) para que pueda disparar el evento que corresponda.
    self.SendButtonReply = function (button) {
        if (!self.selectedChat() || self.loadingMessages() || self.sending()) return;

        sendMessage(button.text, null, button);
    };

    //Unico envio, con o sin adjunto (archivo es opcional). El mensaje se ve al instante (pendiente, con el preview
    //local del adjunto si lo hay) y se reemplaza por el guardado cuando el server responde.
    function sendMessage(text, archivo, button) {
        var chat = self.selectedChat();
        var pending = archivo ? chatClass.PendingFileMessage(text, archivo) : chatClass.PendingMessage(text);

        self.sending(true);
        self.showEmojis(false);
        self.messages.push(pending);
        scrollChatToBottom();

        chatClass.SendMessage(chat.chatId(), text, archivo ? archivo.file : null, button).done(function (message) {
            //la lista de chats muestra el ultimo mensaje aunque se haya cambiado de chat mientras se enviaba
            chat.preview(chatClass.PreviewFor(message));
            chat.time(message.time);

            if (self.selectedChat() === chat)
                self.messages.replace(pending, message);
        }).fail(function () {
            //no se guardo: se saca el mensaje y, si el campo quedo libre, se devuelve el texto para poder reintentar
            self.messages.remove(pending);
            if (self.selectedChat() === chat && !self.draft())
                self.draft(text);
            if (archivo)
                toastr.error('No se pudo enviar el archivo. Probá de nuevo.');
        }).always(function () {
            self.sending(false);
            //el preview local ya no hace falta: el pendiente se reemplazo por el guardado o se saco
            if (archivo) archivo.Revoke();
        });
    }

    //Se llama desde el input file (change, boton de clip) y desde soltar un archivo arrastrado. Valida el archivo
    //elegido en JS, antes de subir nada, y si esta bien lo deja "adjunto" con su preview local hasta que se manda o se saca.
    self.AttachFile = function (file, seconds) {
        if (!file) return;

        var error = archivoClass.Validate(file);
        if (error) {
            toastr.warning(error);
            return;
        }

        self.RemoveAttachment();
        self.attachment(archivoClass.Attach(file, seconds));
    };

    self.RemoveAttachment = function () {
        var current = self.attachment();
        if (current) current.Revoke();
        self.attachment(null);
    };

    self.PickFile = function () {
        var input = document.getElementById('ChatFileInput');
        if (input) input.click();
    };

    //Arrastrar y soltar sobre la pantalla del chat (ver .chat-screen en chats.cshtml): dragover necesita preventDefault
    //para habilitar el drop, y dragleave chequea que se haya salido realmente del contenedor (no de un hijo interno),
    //si no el overlay de "soltá para adjuntar" titila al pasar el mouse entre los mensajes.
    self.OnDragOver = function (data, event) {
        event.preventDefault();
        self.dragOver(true);
        return false;
    };

    self.OnDragLeave = function (data, event) {
        if (event.currentTarget.contains(event.relatedTarget)) return false;
        self.dragOver(false);
        return false;
    };

    self.OnDrop = function (data, event) {
        event.preventDefault();
        self.dragOver(false);

        var files = event.originalEvent && event.originalEvent.dataTransfer ? event.originalEvent.dataTransfer.files : null;
        if (files && files.length > 0) self.AttachFile(files[0]);

        return false;
    };

    //Emojis: modal tipo WhatsApp que se abre desde la barra de escribir, flotando sobre los mensajes (no les achica el
    //espacio). Un emoji es texto: se inserta en el campo, donde esta el cursor.
    self.emojiCategories = EmojiCatalog;
    self.activeEmojiCategory = ko.observable(EmojiCatalog[0]);
    self.showEmojis = ko.observable(false);

    self.toggleEmojis = function () {
        self.showEmojis(!self.showEmojis());
    };

    self.selectEmojiCategory = function (category) {
        self.activeEmojiCategory(category);
    };

    self.InsertEmoji = function (emoji) {
        var input = document.getElementById('ChatInput');
        var text = self.draft();
        var start = input.selectionStart;
        var end = input.selectionEnd;

        //el maxlength del campo no frena los cambios hechos por codigo, asi que se respeta a mano
        if (text.length - (end - start) + emoji.length > input.maxLength) return;

        self.draft(text.slice(0, start) + emoji + text.slice(end));

        var caret = start + emoji.length;
        input.focus();
        input.setSelectionRange(caret, caret);
    };

    //Engancha la pantalla a su canal. Lo llama el ready de abajo, una sola vez: el usuario ya llego logueado aca.
    //Esta pantalla no abre su propia conexion: usa la del layout (Site/Websocket.Site.js), que ya esta conectada
    //desde que entro el usuario. Aca solo se suma como un interesado mas de los mensajes nuevos, para pintarlos en la
    //conversacion; el aviso de "te llego un mensaje" lo sigue manejando el layout.
    self.ConnectWebsocket = function () {
        if (!window.Websocket) return;

        window.Websocket.On(WebsocketClass.Funciones.MensajeRecibido, self.OnMessageReceived);
    };

    //Llega un mensaje del negocio por websocket (ver Entities/Websocket.js). Si el chat al que pertenece es el que
    //esta abierto, se agrega a la conversacion en el momento; si no, solo se actualiza la fila de la lista, para que
    //se vea el ultimo mensaje y la hora sin tener que recargar.
    self.OnMessageReceived = function (notification) {
        if (!notification || !notification.Message) return;

        var chatId = notification.ChatId;
        var message = chatClass.ToView(notification.Message);

        var chat = self.chatList().filter(function (c) { return c.chatId() === chatId; })[0];

        if (chat) {
            chat.preview(chatClass.PreviewFor(message));
            chat.time(message.time);
        }

        if (!self.selectedChat() || chatId !== self.selectedChat().chatId()) return;

        //Puede llegar repetido si el server reintenta: si ese id ya esta en pantalla, no se agrega de nuevo.
        var yaEsta = self.messages().some(function (m) { return m.id && m.id === message.id; });
        if (yaEsta) return;

        self.messages.push(message);
        scrollChatToBottom();
    };

    function scrollChatToBottom() {
        var body = document.getElementById('ChatBody');
        if (body) body.scrollTop = body.scrollHeight;
    }

    //Se llama al hacer scroll en el chat: al llegar arriba trae los 20 mensajes anteriores al mas viejo que ya se ve.
    self.LoadOlderMessages = function () {
        var chat = self.selectedChat();
        var body = document.getElementById('ChatBody');
        var oldest = self.messages()[0];

        if (!chat || !body || !oldest) return;
        if (!self.hasMoreMessages() || self.loadingMessages() || self.loadingOlder()) return;
        if (body.scrollTop > 60) return;

        var previousHeight = body.scrollHeight;
        var previousTop = body.scrollTop;
        self.loadingOlder(true);

        chatClass.GetMessages(chat.chatId(), oldest.id).done(function (result) {
            if (self.selectedChat() !== chat) return;

            self.messages(result.concat(self.messages()));
            self.hasMoreMessages(result.length >= messagesPageSize);
        }).fail(function () {
            //sin esto, al fallar se reintentaria en cada scroll
            self.hasMoreMessages(false);
        }).always(function () {
            if (self.selectedChat() !== chat) return;

            self.loadingOlder(false);

            //los mensajes nuevos entran arriba: se corre el scroll lo que crecio el contenido para seguir viendo el mismo mensaje
            body.scrollTop = body.scrollHeight - previousHeight + previousTop;

            self.LoadOlderMessages();
        });
    };

    self.Load = function () {
        self.loading(true);
        self.hasMoreChats(true);

        chatClass.GetLote(lote).done(function (result) {
            self.chatList(result);
            lote++;
            self.hasMoreChats(result.length >= chatsPageSize);
        }).always(function () {
            self.loading(false);

            //Si la pagina arranco con un #chat/xxx en la URL, la ruta de Sammy corrio antes que este ChatVM existiera
            //(ver Scripts/Sammy/Main.Sammy.js) y dejo el id pendiente aca. Se abre recien ahora, con la lista ya cargada.
            if (window.PendingChatId != null) {
                self.OpenChatId(window.PendingChatId);
                window.PendingChatId = null;
            }

            //si los 20 primeros no llenan la pantalla no hay scroll para disparar la carga, asi que se pide la pagina siguiente ya
            self.LoadMoreChats();
        });
    };

    //Se llama al hacer scroll en la lista de chats: al llegar abajo trae los 20 chats siguientes.
    self.LoadMoreChats = function () {
        var list = document.getElementById('ChatListRows');

        if (!list) return;
        if (!self.hasMoreChats() || self.loading() || self.loadingMoreChats()) return;
        if (list.scrollHeight - list.scrollTop - list.clientHeight > 60) return;

        self.loadingMoreChats(true);

        chatClass.GetLote(lote).done(function (result) {
            self.chatList(self.chatList().concat(result));
            lote++;
            self.hasMoreChats(result.length >= chatsPageSize);
        }).fail(function () {
            //sin esto, al fallar se reintentaria en cada scroll
            self.hasMoreChats(false);
        }).always(function () {
            self.loadingMoreChats(false);
            self.LoadMoreChats();
        });
    };

};

$(document).ready(function () {
    var masterChatVM = new ChatVM();
    ko.applyBindings(masterChatVM, document.getElementById('Chat'));

    //Publicada para que la ruta #chat/:id de Sammy (Scripts/Sammy/Main.Sammy.js) pueda llamarla; Sammy corre antes
    //que este script, asi que esa ruta puede necesitar el id pendiente de arriba en vez de llamar directo.
    window.ChatViewModel = masterChatVM;

    //El usuario ya esta logueado cuando llega a esta pantalla (sin sesion, Go redirige a NotLoggin), asi que es el
    //momento de engancharlo a su canal. Si no se puede conectar la pantalla anda igual, solo que sin tiempo real.
    masterChatVM.ConnectWebsocket();

    $('#ChatBody').on('scroll', masterChatVM.LoadOlderMessages);
    $('#ChatListRows').on('scroll', masterChatVM.LoadMoreChats);

    //El input file no es comodo de atar con data-bind: se dispara con el boton de clip (PickFile) y se lee aca.
    //Se limpia el value al final para poder elegir el mismo archivo de nuevo despues (change no dispara si no).
    $('#ChatFileInput').on('change', function () {
        masterChatVM.AttachFile(this.files && this.files[0]);
        this.value = '';
    });

    masterChatVM.Load();
});
