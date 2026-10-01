//Nota de voz del lado del cliente: pedir el microfono, grabar, cronometrar y devolver el audio como archivo. El envio
//no vive aca: la grabacion terminada se adjunta igual que un archivo elegido a mano (ver Entities/Archivo.js) y se
//manda con ChatClass.SendMessage, por el mismo camino que cualquier otro adjunto.
function GrabadorClass() {
    var me = this;

    //Tope de duracion. Con opus a ~24 kbps cinco minutos entran holgados en el limite de 5 MB que valida
    //ArchivoClass.Validate, pero igual se corta para que una grabacion olvidada no siga creciendo.
    me.maxSeconds = 300;

    //Por orden de preferencia. Opus es lo que graban Chrome y Firefox; Safari solo da mp4/aac.
    var formats = [
        { mime: 'audio/webm;codecs=opus', extension: 'webm' },
        { mime: 'audio/webm', extension: 'webm' },
        { mime: 'audio/ogg;codecs=opus', extension: 'ogg' },
        { mime: 'audio/mp4', extension: 'm4a' }
    ];

    var recorder = null;
    var stream = null;
    var chunks = [];
    var timer = null;
    var format = null;

    me.recording = ko.observable(false);
    me.seconds = ko.observable(0);

    me.timeLabel = ko.pureComputed(function () {
        var total = me.seconds();
        var rest = total % 60;

        return Math.floor(total / 60) + ':' + (rest < 10 ? '0' : '') + rest;
    });

    //getUserMedia solo existe en contexto seguro (https o localhost) y MediaRecorder no esta en todos los browsers:
    //si falta alguno de los dos el boton de microfono no se muestra, en vez de fallar recien al tocarlo.
    me.Supported = function () {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && pickFormat());
    };

    //Pide el microfono y empieza a grabar. El permiso lo pide el browser recien aca (no al cargar la pagina), asi que
    //puede rechazarse, y tampoco hay microfono garantizado: en los dos casos el deferred falla con el error del browser.
    me.Start = function () {
        var deferred = $.Deferred();

        if (me.recording()) return deferred.reject().promise();

        format = pickFormat();
        if (!format) return deferred.reject().promise();

        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (micStream) {
            stream = micStream;
            chunks = [];

            recorder = new MediaRecorder(stream, { mimeType: format.mime });
            recorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };
            recorder.start();

            me.seconds(0);
            me.recording(true);
            timer = setInterval(function () { me.seconds(me.seconds() + 1); }, 1000);

            deferred.resolve();
        }).catch(function (error) {
            release();
            deferred.reject(error);
        });

        return deferred.promise();
    };

    //Corta la grabacion y devuelve el audio como archivo, listo para adjuntar. El blob recien esta completo en onstop,
    //no al volver de stop(), por eso la respuesta va por deferred y no por return.
    me.Stop = function () {
        var deferred = $.Deferred();

        if (!recorder || !me.recording()) return deferred.reject().promise();

        recorder.onstop = function () {
            var blob = new Blob(chunks, { type: format.mime });
            release();
            deferred.resolve(toFile(blob));
        };

        stopTimer();
        me.recording(false);
        recorder.stop();

        return deferred.promise();
    };

    //Descarta lo grabado. Igual hay que parar el recorder y soltar el microfono, si no el navegador sigue mostrando
    //que la pestana esta grabando.
    me.Cancel = function () {
        if (!recorder) return;

        recorder.onstop = release;
        stopTimer();
        me.recording(false);

        try { recorder.stop(); } catch (e) { release(); }
    };

    function pickFormat() {
        if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return null;

        for (var i = 0; i < formats.length; i++) {
            if (MediaRecorder.isTypeSupported(formats[i].mime)) return formats[i];
        }

        return null;
    }

    function toFile(blob) {
        var name = 'nota-de-voz-' + moment().format('YYYYMMDD-HHmmss') + '.' + format.extension;

        //File como constructor no existe en algunos browsers viejos; ahi va el Blob pelado con el nombre colgado, que
        //FactoryChat.SendMessage pasa como tercer parametro de FormData.append.
        try {
            return new File([blob], name, { type: format.mime });
        } catch (e) {
            blob.name = name;
            return blob;
        }
    }

    //Suelta el microfono: sin esto el navegador deja prendido el indicador de grabacion aunque ya no se grabe.
    function release() {
        if (stream) stream.getTracks().forEach(function (track) { track.stop(); });

        stopTimer();
        recorder = null;
        stream = null;
        chunks = [];
        me.recording(false);
    }

    function stopTimer() {
        if (timer) clearInterval(timer);
        timer = null;
    }

};
