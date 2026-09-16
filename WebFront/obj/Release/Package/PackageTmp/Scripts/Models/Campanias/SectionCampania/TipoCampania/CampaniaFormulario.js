function CampaniaFormularioVM() {
    var self = this;

    self.visibleTipoCampania = ko.observable(false);
    self.tipoCampania = ko.observable();
    self.campaniaPublicidad = ko.observable(null);

    self.visibleAgregar = ko.observable(false);

    self.formulariosList = ko.observableArray([]);
    self.formulariosEliminarList = ko.observableArray([]);

    self.url = ko.observable();

    self.buttonAgregarFormulario = function () {
        var formularioClass = new FormulariosClass();

        formularioClass.CampoId(Guid.NewGuid());
        formularioClass.TiposDatosList(new Enums().TipoDatosList);

        self.formulariosList.push(formularioClass);

        $("#CampaniaFormulario select").select2();
    };

    self.buttonEliminarFormulario = function () {
        self.formulariosList.removeAll(Enumerable.From(self.formulariosEliminarList()).Where(function (x) { return x.Selected(); }).ToArray());
        self.formulariosEliminarList.removeAll(Enumerable.From(self.formulariosEliminarList()).Where(function (x) { return x.Selected(); }).ToArray());
    };

    self.botonAgregar = function () {
        self.tipoCampania().Validar(true);

        self.formulariosList.removeAll();
        self.formulariosEliminarList.removeAll();

        self.botonArchivoEliminar();

        if (self.campaniaPublicidad() != null) {
            self.url(self.campaniaPublicidad().Url);

            $.each(self.campaniaPublicidad().CampaniasPublicidadesFormCampos, function (i, campaniaPublicidadFormCampo) {
                var formularioClass = new FormulariosClass();

                formularioClass.CampoId(campaniaPublicidadFormCampo.CampoId);
                formularioClass.Nombre(campaniaPublicidadFormCampo.Texto);
                formularioClass.TiposDatosList(new Enums().TipoDatosList);
                formularioClass.TipoDato(campaniaPublicidadFormCampo.TipoDato);
                formularioClass.Obligatorio(campaniaPublicidadFormCampo.Obligatorio);

                self.formulariosList.push(formularioClass);
            });

            $("#CampaniaFormulario select").select2();

            if (self.campaniaPublicidad().ArchivoEstiloPath != "") {
                self.visbleArchivoEliminar(true);
                self.archivoTexto(self.campaniaPublicidad().ArchivoEstiloPath.split("_")[2]);
            };
        } else {
            self.url(sessionData.WebUrlCampaignPublic + "/Campanias/Forms/" + sessionData.TokenId + "#code/" + masterCrearCampaniasVM.codigoCampania());
        };

        self.visibleAgregar(true);
    };

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    self.visbleArchivoEliminar = ko.observable(false);
    self.archivoTexto = ko.observable("Subir arichvo con estilo.");
    self.archivo = ko.observable(new modelFile());

    document.querySelector("#inputFileCssFormulario").addEventListener("change", function () {
        var reader = new FileReader();
        var addFileControl = document.querySelector("#inputFileCssFormulario").files[0];

        var fileExtension = addFileControl.name.toLowerCase().substring(addFileControl.name.toLowerCase().lastIndexOf(".") + 1);

        if (fileExtension !== "css") {
            Command: toastr["warning"]("El archivo debe ser extension .css", "Atención");
            self.botonArchivoEliminar();
        } else {
            reader.onload = function () {
                var array = self.archivo().arrayBufferToBase64(this.result);

                if (array != false) {
                    self.archivo().addFile(addFileControl.name, this.result, fileExtension, array, "CampaniasFormularios", Guid.NewGuid());

                    self.visbleArchivoEliminar(true);
                    self.archivoTexto(addFileControl.name);
                };
            };

            reader.readAsArrayBuffer(this.files[0]);
        };
    }, false);

    self.botonArchivoEliminar = function () {
        self.archivo(new modelFile());
        document.getElementById("inputFileCssFormulario").value = "";
        self.visbleArchivoEliminar(false);
        self.archivoTexto("Subir arichvo con estilo.");
    };

    self.botonDescargarArchivoSubido = function () {
        var link = document.createElement("a");

        if (self.archivo().files()[0] != undefined) {
            link.href = self.archivo().files()[0].href();
            link.download = self.archivo().files()[0].name();  
        } else {
            link.href = "https://files.botiseller.com" + self.campaniaPublicidad().ArchivoEstiloPath;
            link.download = self.campaniaPublicidad().ArchivoEstiloPath.split("_")[2];  
        };

        link.click();
    };

    function FormulariosClass() {
        var me = this;

        me.CampoId = ko.observable();
        me.Nombre = ko.observable();

        me.TiposDatosList = ko.observableArray([]);
        me.TipoDato = ko.observable();

        me.Obligatorio = ko.observable(false);

        me.VisibleSelected = ko.observable(false);
        me.Selected = ko.observable(false);

        me.SeleccionarFila = function () {
            if (me.VisibleSelected()) {
                me.VisibleSelected(false);
                self.formulariosEliminarList.remove(me);
            } else {
                me.VisibleSelected(true);
                self.formulariosEliminarList.push(me);
            };

            return true;
        };
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesForm();
    };

    function GetCampaniasPublicidadesForm() {
        var archivoEstiloPath = "";
        var archivoEstilo = null;

        if (self.archivo().files()[0] != undefined) {
            archivoEstiloPath = "/Campanias/" + self.archivo().files()[0].guid() + "_Formulario_" + self.archivo().files()[0].name();
            archivoEstilo = self.archivo().files()[0].file();
        } else {
            if (self.campaniaPublicidad() != null && self.campaniaPublicidad().ArchivoEstiloPath != "" && self.visbleArchivoEliminar()) {
                archivoEstiloPath = self.campaniaPublicidad().ArchivoEstiloPath;
            };
        };

        var campaniasPublicidadForm = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaFormulario,
            Url: self.url(),
            ArchivoEstiloPath: archivoEstiloPath,
            ArchivoEstilo: archivoEstilo,
            CampaniasPublicidadesFormCampos: self.formulariosList().length ? GetCampaniasPublicidadesFormCampos() : null
        };

        return campaniasPublicidadForm;
    };

    function GetCampaniasPublicidadesFormCampos() {
        var campaniasPublicidadFormCamposList = [];

        $.each(self.formulariosList(), function (i, formulario) {
            var campaniasPublicidadFormCampos = {
                CampoId: formulario.CampoId(),
                Texto: formulario.Nombre(),
                TipoDato: formulario.TipoDato(),
                Obligatorio: formulario.Obligatorio()
            };

            campaniasPublicidadFormCamposList.push(campaniasPublicidadFormCampos);
        });

        return campaniasPublicidadFormCamposList;
    };
};


$(document).ready(function () {
    masterCampaniaFormularioVM = new CampaniaFormularioVM();
    ko.applyBindings(masterCampaniaFormularioVM, document.getElementById('CampaniaFormulario'));
});