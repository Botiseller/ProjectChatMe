//Se encarga del archivo del lado del cliente: elegirlo, validarlo y previsualizarlo. El envio no vive aca: un mensaje
//con adjunto se manda con ChatClass.SendMessage, igual que uno de solo texto.
function ArchivoClass() {
    var me = this;

    //Si se cambia, cambiarlo tambien en MaxFileSize de WebApiMiddelware\Controllers\ChatController.cs.
    var maxFileSize = 5 * 1024 * 1024;

    //Valida el archivo elegido antes de adjuntarlo (en JS, antes de subir nada). Devuelve null si esta OK, o un
    //mensaje para mostrar como advertencia (no como error: es una validacion esperada, no una falla).
    me.Validate = function (file) {
        if (!file) return 'No se pudo cargar el archivo.';
        if (file.size > maxFileSize) return 'No se pudo cargar el archivo: no puede superar los ' + (maxFileSize / (1024 * 1024)) + ' MB.';
        return null;
    };

    //Arma la entidad adjunta a partir del File nativo del browser (ya validado con Validate). El preview de
    //imagen/video/audio se genera localmente con un object URL, sin tocar el server. seconds es opcional: solo lo manda
    //una nota de voz recien grabada (ver Entities/Grabador.js), que ya sabe cuanto dura.
    me.Attach = function (file, seconds) {
        return new Archivo(file, seconds);
    };

    //Estado del archivo elegido mientras esta "adjunto" en la barra de escribir, antes de mandarlo.
    function Archivo(file, seconds) {
        var self = this;

        self.file = file;
        self.name = ko.observable(file.name);
        self.sizeLabel = ko.observable(formatSize(file.size));
        //Duracion de la nota de voz; en el resto de los adjuntos queda null y la barra muestra el tamano.
        self.durationLabel = ko.observable(seconds ? formatDuration(seconds) : null);
        //'image' | 'video' | 'audio' | 'file': decide que preview mostrar y, del lado del server, en que campo de MessageDetail cae.
        self.kind = ko.observable(kindOf(file));
        //Preview local para imagen/video/audio (no es la URL final de S3, esa la da el server recien cuando se manda).
        self.previewUrl = ko.observable(self.kind() !== 'file' ? URL.createObjectURL(file) : null);

        //Hay que llamarlo cuando el adjunto se saca o ya se mando, si no el object URL queda vivo en memoria.
        self.Revoke = function () {
            if (self.previewUrl()) URL.revokeObjectURL(self.previewUrl());
        };
    }

    function kindOf(file) {
        var type = file.type || '';
        if (type.indexOf('image/') === 0) return 'image';
        if (type.indexOf('video/') === 0) return 'video';
        if (type.indexOf('audio/') === 0) return 'audio';
        return 'file';
    }

    function formatDuration(seconds) {
        var rest = Math.round(seconds) % 60;
        return Math.floor(seconds / 60) + ':' + (rest < 10 ? '0' : '') + rest;
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

};
