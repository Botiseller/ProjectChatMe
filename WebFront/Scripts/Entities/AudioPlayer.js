//Reproductor de notas de voz. Se usa como data-bind="audioPlayer: audio" sobre un contenedor vacio: el markup de
//adentro (boton, onda y tiempo) lo arma este binding, porque las barras de la onda se generan por codigo.
(function () {

    var barCount = 38;

    //Solo una nota suena a la vez: al arrancar una se pausa la que estuviera sonando, como en cualquier app de mensajeria.
    var playing = null;

    ko.bindingHandlers.audioPlayer = {
        init: function (element, valueAccessor) {
            var src = ko.unwrap(valueAccessor());
            if (!src) return;

            var ui = build(element, src);
            var audio = new Audio();

            //metadata y no auto: alcanza para saber la duracion sin bajar el audio entero de entrada.
            audio.preload = 'metadata';

            //Antes de asignar el src: con el audio ya cacheado, loadedmetadata puede dispararse enseguida y si el
            //listener todavia no esta enganchado la duracion no se muestra nunca.
            resolveDuration(audio, function (seconds) {
                ui.total = seconds;
                if (audio.paused) ui.time.textContent = formatTime(seconds);
            });

            audio.src = src;

            ui.button.addEventListener('click', function () {
                if (audio.paused) {
                    if (playing && playing !== audio) playing.pause();
                    playing = audio;
                    audio.play();
                } else {
                    audio.pause();
                }
            });

            //Click en la onda para saltar a esa posicion.
            ui.wave.addEventListener('click', function (e) {
                if (!isFinite(ui.total) || ui.total <= 0) return;

                var box = ui.wave.getBoundingClientRect();
                var ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));

                audio.currentTime = ratio * ui.total;
                paint(ui, ratio);
            });

            audio.addEventListener('play', function () { ui.root.classList.add('is-playing'); setIcon(ui, true); });
            audio.addEventListener('pause', function () { ui.root.classList.remove('is-playing'); setIcon(ui, false); });

            audio.addEventListener('timeupdate', function () {
                ui.time.textContent = formatTime(audio.currentTime);
                if (isFinite(ui.total) && ui.total > 0) paint(ui, audio.currentTime / ui.total);
            });

            audio.addEventListener('ended', function () {
                paint(ui, 0);
                ui.time.textContent = formatTime(ui.total);
            });

            //El mensaje pendiente se reemplaza por el guardado y knockout rehace la fila: si no se corta el audio,
            //la nota seguiria sonando desde un nodo que ya no existe.
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                audio.pause();
                if (playing === audio) playing = null;
                audio.src = '';
            });
        }
    };

    function build(element, src) {
        element.innerHTML = '';
        element.classList.add('voice-note');

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'voice-note__play';
        button.setAttribute('aria-label', 'Reproducir');

        var wave = document.createElement('div');
        wave.className = 'voice-note__wave';

        var bars = heights(src).map(function (h) {
            var bar = document.createElement('span');
            bar.style.height = h + '%';
            wave.appendChild(bar);
            return bar;
        });

        var time = document.createElement('span');
        time.className = 'voice-note__time';
        time.textContent = '--:--';

        element.appendChild(button);
        element.appendChild(wave);
        element.appendChild(time);

        var ui = { root: element, button: button, wave: wave, bars: bars, time: time, total: NaN };
        setIcon(ui, false);

        return ui;
    }

    //Pinta las barras hasta donde va la reproduccion. Se resuelve por clase y no por ancho para no depender de medir
    //el contenedor, que al estar dentro de una burbuja todavia sin layout puede dar 0.
    function paint(ui, ratio) {
        var upTo = Math.round(ratio * ui.bars.length);

        for (var i = 0; i < ui.bars.length; i++) {
            ui.bars[i].classList.toggle('is-played', i < upTo);
        }
    }

    function setIcon(ui, isPlaying) {
        ui.button.innerHTML = isPlaying
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.5-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14z"></path></svg>';

        ui.button.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');
    }

    //Los webm que graba MediaRecorder no traen la duracion en el encabezado y Chrome informa Infinity. El rodeo
    //conocido es mandar el cursor al final: ahi el browser recalcula la duracion real y se puede volver a cero.
    function resolveDuration(audio, done) {
        //HAVE_METADATA o mas: la duracion ya esta, el evento no va a volver a dispararse.
        if (audio.readyState >= 1) {
            read();
            return;
        }

        audio.addEventListener('loadedmetadata', read);

        function read() {
            if (isFinite(audio.duration)) {
                done(audio.duration);
                return;
            }

            audio.currentTime = 1e101;
            audio.addEventListener('timeupdate', function fix() {
                audio.removeEventListener('timeupdate', fix);
                audio.currentTime = 0;
                done(audio.duration);
            });
        }
    }

    function formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '--:--';

        var total = Math.round(seconds);
        var rest = total % 60;

        return Math.floor(total / 60) + ':' + (rest < 10 ? '0' : '') + rest;
    }

    //Alturas derivadas del src: la misma nota se ve siempre igual y dos notas distintas se ven distintas. No es la onda
    //real del audio (para eso habria que decodificarlo entero), es una firma visual estable.
    function heights(src) {
        var seed = 0;
        for (var i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) | 0;
        if (seed === 0) seed = 1;

        var result = [];
        for (var b = 0; b < barCount; b++) {
            seed = (seed ^ (seed << 13)) | 0;
            seed = (seed ^ (seed >>> 17)) | 0;
            seed = (seed ^ (seed << 5)) | 0;
            result.push(30 + (Math.abs(seed) % 71));
        }

        return result;
    }

})();
