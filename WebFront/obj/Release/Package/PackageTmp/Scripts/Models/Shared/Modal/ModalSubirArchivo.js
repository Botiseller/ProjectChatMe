function ModalSubirArchivoVM() {
    var self = this;

    self.VisbleEliminarArchivo = ko.observable(false);
    self.VisbleFechaAlta = ko.observable(true);

    /* Validaciones y mensajes */
    self.SizeMensaje = ko.observable("5");
    self.ValidarPixeles = ko.observable(false);
    self.WidthPixeles = ko.observable(500);
    self.HeightPixeles = ko.observable(500);

    /* Archivos Nuevos */
    self.VisbleAgregarArchivo = ko.observable(false);
    self.Entidad = ko.observable();
    self.AcceptTipoArchivo = ko.observable("");

    self.ArchivosNuevos = ko.observable(new modelFile());
    self.ArchivosTotalesNuevos = ko.observable(new modelFile());

    self.IniciarSubirArchivosNuevos = function () {
        document.querySelector("#inputFileImgModalSubirArchivo").addEventListener("change", function () {
            var reader = new FileReader();
            var addFileControl = document.querySelector("#inputFileImgModalSubirArchivo").files[0];

            reader.onload = function () {
                var array = self.ArchivosNuevos().arrayBufferToBase64Validate(this.result, addFileControl.size, self.ArchivosNuevos().files().length, self.SizeMensaje());

                if (array != false) {
                    var guid = Guid.NewGuid();

                    self.ArchivosNuevos().addFile(addFileControl.name, this.result, addFileControl.type, array, self.Entidad(), guid);
                    self.ArchivosTotalesNuevos().addFile(addFileControl.name, this.result, addFileControl.type, array, self.Entidad(), guid);

                    if (self.ValidarPixeles()) {
                        var imgValidacion = new Image();
                        imgValidacion.src = "data:" + addFileControl.type + ";base64," + array;
                        imgValidacion.onload = function () {
                            if (this.width.toFixed(0) < self.WidthPixeles() || this.height.toFixed(0) < self.HeightPixeles()) {
                                self.EliminarArchivoNuevo(guid);
                                self.ArchivosNuevos(new modelFile());
                                self.ArchivosTotalesNuevos(new modelFile());

                                Command: toastr["warning"]("La imagen debe ser de tamaño mayor a " + self.WidthPixeles() + "px por " + self.HeightPixeles() + "px.", "Atención");
                            };
                        };
                    };
                };
            };
            reader.readAsArrayBuffer(this.files[0]);
        }, false);
    };

    self.EliminarArchivoNuevo = function (guid) {
        self.ArchivosNuevos().files.remove(Enumerable.From(self.ArchivosNuevos().files()).Where(function (x) { return x.guid() == guid; }).FirstOrDefault());
        self.ArchivosTotalesNuevos().files.remove(Enumerable.From(self.ArchivosTotalesNuevos().files()).Where(function (x) { return x.guid() == guid; }).FirstOrDefault());
        document.getElementById("inputFileImgModalSubirArchivo").value = "";
    };
    /* Fin Archivos Nuevos */

    /* Archivos Editables */
    self.Archivos = ko.observableArray([]);
    self.ArchivosTotales = ko.observableArray([]);

    self.ButtonDescargarArchivo = function (archivoId) {
        facArchivos.ConseguirArchivoPorId(archivoId).done(function (archivo) {
            DescargarArchivo(archivo.Archivo, archivo.Extension, archivo.Nombre);
        });
    };

    self.EliminarArchivo = function (archivoId) {
        self.Archivos.remove(Enumerable.From(self.Archivos()).Where(function (x) { return x.ArchivoId() == archivoId; }).FirstOrDefault());
        self.ArchivosTotales.remove(Enumerable.From(self.ArchivosTotales()).Where(function (x) { return x.ArchivoId() == archivoId; }).FirstOrDefault());
    };
    /* Fin Archivos Editables */

    self.LoadVM = function () {
        self.IniciarSubirArchivosNuevos();
    };
};

var masterModalSubirArchivoVM = null;

$(document).ready(function () {
    masterModalSubirArchivoVM = new ModalSubirArchivoVM();
    ko.applyBindings(masterModalSubirArchivoVM, document.getElementById("ModalSubirArchivo"));

    masterModalSubirArchivoVM.LoadVM();
});