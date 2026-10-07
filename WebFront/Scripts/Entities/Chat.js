function ChatClass() {
    var me = this;
    var facChat = new FactoryChat();
    

    me.GetLote = function (lote) {
        var deferred = $.Deferred();

        facChat.GetLote(lote).done(function (result) {
            var chats = (result || []).map(function (item) {
                var shop = item.Shop || {};
                var c = new Chats();
                c.id(shop.Id);
                c.chatId(item.Id);
                c.data = item;
                c.name(shop.Nombre ? shop.Nombre : 'Negocio');
                c.initials(c.name().substring(0, 2).toUpperCase());
                c.avatarClass(avatarClassFor(c.name()));
                c.image(shop.Image);
                c.phone(shop.Phone);
                c.address(shop.Address);
                c.location(shop.Location);
                c.mail(shop.Mail);
                //El nombre lo pone el subrubro y el icono el rubro que tiene adentro (ver Business.Entities/Rubro.cs).
                c.category(shop.SubRubro ? shop.SubRubro.Nombre : null);
                c.categoryIcon(shop.SubRubro && shop.SubRubro.Rubro ? toFontAwesome5(shop.SubRubro.Rubro.Icono) : null);
                c.lastMessage(item.LastMessage);
                c.preview(item.LastMessage ? lastMessagePreview(item.LastMessage.Detail) : '');
                c.time(formatLastMessageDate(item.LastMessage ? item.LastMessage.Date : null));
                return c;
            });

            deferred.resolve(chats);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            deferred.reject(jqXHR, textStatus, errorThrown);
        });

        return deferred.promise();
    };

    //Trae una pagina de mensajes del chat (chatId) lista para mostrar, del mas viejo al mas nuevo.
    //beforeId = 0 trae los mas recientes; con el id de un mensaje trae los anteriores a ese.
    me.GetMessages = function (chatId, beforeId) {
        var deferred = $.Deferred();

        facChat.GetMessages(chatId, beforeId).done(function (result) {
            deferred.resolve((result || []).map(toMessageView));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            deferred.reject(jqXHR, textStatus, errorThrown);
        });

        return deferred.promise();
    };

    //Envia un mensaje del usuario al chat (chatId) y devuelve el mensaje guardado, listo para mostrar. Unico envio:
    //file es opcional, asi que sirve igual para solo texto, solo archivo, o los dos juntos. button tambien es opcional
    //y solo viaja cuando el usuario respondio tocando un boton del negocio, para que su payload llegue al proveedor.
    me.SendMessage = function (chatId, text, file, button) {
        var deferred = $.Deferred();

        facChat.SendMessage(chatId, text, file, button).done(function (result) {
            deferred.resolve(toMessageView(result));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            deferred.reject(jqXHR, textStatus, errorThrown);
        });

        return deferred.promise();
    };

    //Avisa que el usuario abrio el chat, para que queden leidos los mensajes que le mando el negocio. Es al pasar:
    //la pantalla no cambia con esto (los tildes son de los mensajes propios, y esos los marca el negocio), asi que
    //si falla no se le muestra nada al usuario.
    me.MarkAsRead = function (chatId) {
        return facChat.MarkAsRead(chatId);
    };

    //Mensaje que se muestra apenas se envia, hasta que el server confirma y se reemplaza por el guardado. Sin
    //fromName/fromPicture: el mensaje real que lo reemplaza los trae, y la espera es demasiado corta para que se note.
    me.PendingMessage = function (text) {
        return { id: 0, mine: true, text: text, image: null, video: null, audio: null, file: null, fileName: null, fileKind: null, fromName: null, fromPicture: null, buttons: [], time: formatMessageTime(new Date()), read: false, pending: true };
    };

    //Igual que PendingMessage, pero para un mensaje con archivo adjunto (ver Entities/Archivo.js): usa el preview local
    //del archivo (todavia no hay URL real, esa la da el server recien cuando SendMessage confirma).
    me.PendingFileMessage = function (text, archivo) {
        var pending = { id: 0, mine: true, text: text || '', image: null, video: null, audio: null, file: null, fileName: archivo.name(), fileKind: fileKindOf(archivo.name()), fromName: null, fromPicture: null, buttons: [], time: formatMessageTime(new Date()), read: false, pending: true };

        if (archivo.kind() === 'image') pending.image = archivo.previewUrl();
        else if (archivo.kind() === 'video') pending.video = archivo.previewUrl();
        //La nota de voz se puede escuchar apenas se manda, desde el object URL local, sin esperar la URL de S3.
        else if (archivo.kind() === 'audio') pending.audio = archivo.previewUrl();

        return pending;
    };

    //Texto para la lista de chats a partir de un mensaje ya transformado (ver toMessageView); lo usa Chat.js (ViewModel)
    //despues de mandar un mensaje o un archivo, para actualizar el preview del chat sin tener que volver a pedir la lista.
    me.PreviewFor = function (message) {
        if (message.text) return message.text;
        if (message.image) return '📷 Foto';
        if (message.video) return '🎥 Video';
        if (message.audio) return '🎤 Audio';
        if (message.file || message.fileName) return '📎 ' + (message.fileName || 'Archivo');
        return '';
    };

    //Mismo mapeo que usan GetMessages y SendMessage, expuesto para los mensajes que llegan por websocket
    //(ver Models/Chat/Chat.js, OnMessageReceived): el formato del server es el mismo, asi que se pinta igual.
    me.ToView = function (m) {
        return m ? toMessageView(m) : null;
    };

    function toMessageView(m) {
        var detail = m.Detail || {};
        var from = m.From || {};

        return {
            id: m.Id,
            mine: from.From === 1, //MensajeEnviadoPor.Usuario: lo mando el usuario de la sesion
            text: detail.Text || mediaLabel(detail),
            image: detail.Image || null,
            video: detail.Video || null,
            audio: detail.Audio || null,
            file: detail.File || null,
            fileName: detail.FileName || null,
            fileKind: fileKindOf(detail.FileName),
            //Quien manda: si no vino nombre no se muestra nada, y sin foto se ve el avatar gris generico (ver chats.cshtml).
            fromName: from.Name || null,
            fromPicture: from.Picture || null,
            buttons: (detail.Buttons || []).map(function (b) { return { text: b.Text, payload: b.Payload }; }),
            time: formatMessageTime(m.Date),
            //Con fecha de lectura van los dos tildes en azul; sin ella, los dos en gris. Aca no existe el estado
            //"no llego": si el mensaje esta guardado, llego.
            read: !!m.ReadDate,
            pending: false
        };
    }

    //'pdf' | 'word' | 'other': que icono le pone bubble-file (ver chats.cshtml) a un mensaje de tipo File generico.
    function fileKindOf(fileName) {
        var ext = (fileName || '').split('.').pop().toLowerCase();
        if (ext === 'pdf') return 'pdf';
        if (ext === 'doc' || ext === 'docx') return 'word';
        return 'other';
    }

    //Imagen, video, audio y archivo se muestran como tales (bubble-media / voice-note / bubble-file) y los botones como
    //bubble-menu, asi que no entran aca. El sticker todavia no se renderiza, se indica con una etiqueta.
    function mediaLabel(detail) {
        if (detail.Sticket) return '[Sticker]';
        return '';
    }

    //Preview de la lista de chats para el ultimo mensaje: a diferencia de la burbuja del chat, aca no hay lugar para
    //mostrar la imagen/video real ni los botones, asi que un mensaje sin texto se indica con una etiqueta corta.
    function lastMessagePreview(detail) {
        if (!detail) return '';
        if (detail.Text) return detail.Text;
        if (detail.Image) return '📷 Foto';
        if (detail.Video) return '🎥 Video';
        if (detail.Audio) return '🎤 Audio';
        if (detail.File) return '📎 ' + (detail.FileName || 'Archivo');
        return mediaLabel(detail);
    }

    //Hoy solo la hora; otro dia, fecha y hora.
    function formatMessageTime(value) {
        var date = parseServerDate(value);
        if (!date) return '';

        var sameDay = moment().startOf('day').isSame(moment(date).startOf('day'));
        return moment(date).format(sameDay ? 'HH:mm' : 'DD/MM/YYYY HH:mm');
    }

    //La tabla Rubros guarda el icono con sintaxis de Font Awesome 6 ("fa-solid fa-shirt"), pero el tema que trae este
    //WebFront es Font Awesome 5: no define .fa-solid (sin eso no se aplica la tipografia y el icono no se ve) y algunos
    //nombres cambiaron entre una version y la otra. Se traduce al vuelo, sin tocar los datos.
    var fa6Styles = {
        'fa-solid': 'fas',
        'fa-regular': 'far',
        //FA5 no tiene "thin"; el mas parecido es light.
        'fa-thin': 'fal',
        'fa-light': 'fal',
        'fa-duotone': 'fad',
        'fa-brands': 'fab'
    };

    //Solo los nombres que FA6 renombro: los demas se llaman igual en las dos versiones y pasan de largo. Cada destino
    //de esta tabla fue verificado contra Css/vendors.bundle.css, que es el Font Awesome que carga el sitio.
    var fa6Names = {
        'fa-heart-pulse': 'fa-heartbeat',
        'fa-shirt': 'fa-tshirt',
        'fa-magnifying-glass': 'fa-search',
        'fa-xmark': 'fa-times',
        'fa-trash-can': 'fa-trash-alt',
        'fa-pen-to-square': 'fa-edit',
        'fa-phone-flip': 'fa-phone-alt',
        'fa-cart-shopping': 'fa-shopping-cart',
        'fa-gear': 'fa-cog',
        'fa-screwdriver-wrench': 'fa-tools',
        'fa-basket-shopping': 'fa-shopping-basket',
        'fa-truck-fast': 'fa-shipping-fast',
        'fa-building-columns': 'fa-university',
        'fa-suitcase-medical': 'fa-medkit',
        'fa-scissors': 'fa-cut',
        'fa-bolt-lightning': 'fa-bolt',
        'fa-right-from-bracket': 'fa-sign-out-alt',
        'fa-arrow-right-arrow-left': 'fa-exchange-alt',
        'fa-location-dot': 'fa-map-marker-alt',
        'fa-circle-info': 'fa-info-circle',
        'fa-triangle-exclamation': 'fa-exclamation-triangle',
        'fa-mobile-screen': 'fa-mobile-alt',
        'fa-money-bill-1': 'fa-money-bill-alt'
    };

    //Un rubro nuevo cargado con un nombre exclusivo de FA6 (sin equivalente en FA5) va a quedar sin icono: hay que
    //sumarlo a fa6Names, o migrar el sitio a Font Awesome 6.
    function toFontAwesome5(icono) {
        if (!icono) return null;

        return icono.split(/\s+/)
            .filter(function (c) { return c.length > 0; })
            .map(function (c) { return fa6Styles[c] || fa6Names[c] || c; })
            .join(' ');
    }

    //Clase de color del avatar segun la inicial del negocio (los 26 tonos, uno por letra, estan en styles.css).
    //Le saca los acentos para que "Óptica" caiga en letter-o y no se quede sin clase; si aun asi no arranca con
    //a-z (numero, emoji, nombre vacio), usa letter-a como color por defecto en vez de dejar el avatar sin fondo.
    function avatarClassFor(name) {
        var normalized = (name || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
        var letter = normalized.charAt(0).toLowerCase();

        return 'letter-' + (letter >= 'a' && letter <= 'z' ? letter : 'a');
    }

    var weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    //El server responde con Json() de MVC, asi que la fecha llega como "/Date(ms)/" (moment no lo parsea); tambien acepta ISO.
    function parseServerDate(value) {
        if (!value) return null;

        var match = /\/Date\((-?\d+)/.exec(value);
        var date = match ? new Date(parseInt(match[1], 10)) : new Date(value);

        return isNaN(date.getTime()) ? null : date;
    }

    //Mismo criterio que las apps de mensajeria: hoy -> hora, ayer -> "Ayer", esta semana -> dia, antes -> dd/MM/yyyy.
    function formatLastMessageDate(value) {
        var date = parseServerDate(value);
        if (!date) return '';

        var days = moment().startOf('day').diff(moment(date).startOf('day'), 'days');

        if (days <= 0) return moment(date).format('HH:mm');
        if (days === 1) return 'Ayer';
        if (days < 7) return weekDays[date.getDay()];

        return moment(date).format('DD/MM/YYYY');
    }

    function Chats() {
        var me = this;
        //objeto necesario para reconstruir la lista de chats.
        me.id = ko.observable();
        //id del chat (Chats.ChatId); me.id es el del negocio.
        me.chatId = ko.observable();
        //datos crudos del chat (Shop, User, DateInit, Messages) tal como los devolvió el server.
        me.data = null;
        me.name = ko.observable();
        me.initials = ko.observable();
        //"letter-a".."letter-z": color del avatar segun la inicial del negocio (ver avatarClassFor y styles.css).
        me.avatarClass = ko.observable();
        me.image = ko.observable();
        me.phone = ko.observable();
        me.address = ko.observable();
        me.location = ko.observable();
        me.mail = ko.observable();
        //Nombre del subrubro del negocio y clase de Font Awesome del rubro al que pertenece.
        me.category = ko.observable();
        me.categoryIcon = ko.observable();
        me.lastMessage = ko.observable();
        me.preview = ko.observable();
        me.time = ko.observable();
    }

};
