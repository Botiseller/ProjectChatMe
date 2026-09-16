function Myfile(_name, _dateAdd, _upload, _fileCache, _extend, _file, _entidad, _guid) {
    var self = this;

    self.name = ko.observable(_name);
    self.uploadDate = ko.observable(_dateAdd);
    _upload = _upload == null ? false : _upload;
    self.upload = ko.observable(_upload);
    self.fileCache = ko.observable(_fileCache);
    self.file = ko.observable(_file);
    self.extend = ko.observable(_extend);
    self.href = ko.observable();
    self.entidad = ko.observable(_entidad);
    self.guid = ko.observable(_guid);
    self.src = ko.observable(null);
};


function modelFile() {
    var self = this;

    self.files = ko.observableArray();
    self.maxFile = ko.observable(5);
    self.maxSize = ko.observable(5240000);

    self.arrayBufferToBase64 = function (buffer) {
        if (buffer == null || buffer == undefined) {
            return false
        };
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        };
        return window.btoa(binary);
    };

    self.arrayBufferToBase64Validate = function (buffer, _max, _size, _sizeMensaje) {
        if (self.validaFile(_max, _size, _sizeMensaje)) {
            if (buffer == null || buffer == undefined) {
                return false
            };
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            };
            return window.btoa(binary);
        };

        return false;
    };

    self.validaFile = function (_size, _max, _sizeMensaje) {
        if (_size > self.maxSize()) {
            Command: toastr["warning"]("El archivo debe ser de " + _sizeMensaje + " MB como maximo.", "Atención");
            return false;
        };

        if (_max >= self.maxFile()) {
            Command: toastr["warning"]("No se pueden adjuntar mas de " + self.maxFile() + " Archivos.", "Atención");
            return false;
        };
        return true;
    };

    self.toArrayBuffer = function (buffer, _max, _size) {
        if (buffer == null || buffer == undefined) {
            return false;
        };
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        };
        return ab;
    };

    self.addFile = function (_name, _fileCache, _type, _fileVal, _entidad, _guid) {
        var f = new Myfile(_name, moment().format("DD/MM/YYYY"), true, _fileCache, _type, _fileVal, _entidad, _guid);

        var file = new Blob([_fileCache], { type: _type });
        f.href(URL.createObjectURL(file));

        if (_type.split("/")[1] == "jpeg" || _type.split("/")[1] == "jpg" || _type.split("/")[1] == "png") {
            f.src("data:" + _type + ";base64," + _fileVal);
        };

        self.files.push(f);
    };

    self.removeFile = function () {
        self.files.remove(this);
    };

    self.download = function () {
        if (this.upload) {
            //lo agrego ahora. (descargarlo en base a lo que agrego)

        } else {
            //lo agrego antes. (ir a buscar en base al id)
        };
    };
};