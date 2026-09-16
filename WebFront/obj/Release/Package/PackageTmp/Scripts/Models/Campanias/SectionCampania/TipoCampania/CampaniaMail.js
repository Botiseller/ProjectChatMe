function CampaniaMailVM() {
    var self = this;

    var self = this;

    self.visibleTipoCampania = ko.observable(false);
    self.tipoCampania = ko.observable();
    self.campaniaPublicidad = ko.observable(null);

    self.visibleAgregar = ko.observable(false);

    self.imagen = ko.observable(new modelFile());

    self.asunto = ko.observable();
    self.mailOrigen = ko.observable();

    self.tipoEnviosList = ko.observableArray([]);
    self.tipoEnvioId = ko.observable();

    self.diasSemanaList = ko.observableArray([]);

    self.hora = ko.observable();
    self.dia = ko.observable();
    self.anual = ko.observable();
    self.unicaVez = ko.observable();

    self.cuerpo = ko.observable();

    self.botonAgregar = function () {
        self.tipoCampania().Validar(true);

        self.asunto("");
        self.mailOrigen("");

        self.diasSemanaList(new Enums().DiasSemanaList);

        self.tipoEnvioId(null);
        self.tipoEnviosList(new Enums().TipoEnviosList);
        if (self.campaniaPublicidad() != null) {
            self.tipoEnvioId(self.campaniaPublicidad().CampaniasPublicidadesEnvios.TipoEnvio);
            $('#select-envioMail').trigger("change");
        } else {
            self.changeTipoEnvio();
        };

        $("#eg-dark-theme-mail")[0]['data-froala.editor'].html.set("");

        if (self.campaniaPublicidad() != null) {
            self.asunto(self.campaniaPublicidad().Asunto);
            self.mailOrigen(self.campaniaPublicidad().MailOrigen);
            $("#eg-dark-theme-mail")[0]['data-froala.editor'].html.set(self.campaniaPublicidad().MailCode);
        };

        self.visibleAgregar(true);
    };

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    self.changeTipoEnvio = function () {
        $("#txtHoraMail").prop('required', false);
        $("#txtDiaMail").prop('required', false);
        $("#txtAnualMail").prop('required', false);
        $("#txtUnicaVezMail").prop('required', false);

        self.diasSemanaList(new Enums().DiasSemanaList);

        self.hora(null);
        self.dia(null);
        self.anual(null);
        self.unicaVez(null);

        switch (self.tipoEnvioId()) {
            case 1:
                $("#txtHoraMail").prop('required', true);
                if (self.campaniaPublicidad() != null) {
                    var horaFormateada = moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Hora).format("HH:mm");
                    self.hora(horaFormateada);
                };
                break;
            case 2:
                $("#txtHoraMail").prop('required', true);
                if (self.campaniaPublicidad() != null) {
                    var horaFormateada = moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Hora).format("HH:mm");
                    self.hora(horaFormateada);

                    $.each(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles, function (i, campaniaPublicidadEnvioDetalle) {
                        var diaSemana = Enumerable.From(self.diasSemanaList()).Where(function (x) { return x.DiaSemanaId == campaniaPublicidadEnvioDetalle.DiaSemana; }).FirstOrDefault();
                        diaSemana.Check = true;
                        $("#" + diaSemana.DiaSemanaId + "_Mail").click();
                    });
                };
                break;
            case 3:
                if (self.campaniaPublicidad() != null) {
                    self.dia(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD"));
                };

                $('#txtDiaMail').datepicker({
                    language: 'es',
                    format: "dd",
                    orientation: "bottom left",
                    todayHighlight: true,
                    autoclose: true,
                    showAnim: 'slideDown',
                    clearBtn: true,
                    templates: {
                        leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
                        rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
                    }
                });

                $("#txtDiaMail").prop('required', true);
                break;
            case 4:
                if (self.campaniaPublicidad() != null) {
                    self.anual(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD") + "/" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Mes, "M").format("MM"));
                };

                $('#txtAnualMail').datepicker({
                    language: 'es',
                    format: "dd/mm",
                    orientation: "bottom left",
                    todayHighlight: true,
                    autoclose: true,
                    showAnim: 'slideDown',
                    clearBtn: true,
                    templates: {
                        leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
                        rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
                    }
                });

                $("#txtAnualMail").prop('required', true);
                break;
            case 5:
                if (self.campaniaPublicidad() != null) {
                    self.unicaVez(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Anio, "Y").format("YYYY") + "-" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Mes, "M").format("MM") + "-" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD"));
                };

                $("#txtUnicaVezMail").prop('required', true);
                break;
        };
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesMail();
    };

    function GetCampaniasPublicidadesMail() {
        var campaniaPublicidadMail = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaMail,
            Asunto: self.asunto(),
            MailOrigen: self.mailOrigen(),
            MailCode: encodeURIComponent($("#eg-dark-theme-mail")[0]['data-froala.editor'].html.get()),
            CampaniasPublicidadesEnvios: GetCampaniasPublicidadesEnvios()
        };

        return campaniaPublicidadMail;
    };

    function GetCampaniasPublicidadesEnvios() {
        var campaniaPublicidadEnvio = {
            CampaniaPublicidadEnvioId: Guid.NewGuid(),
            TipoEnvio: self.tipoEnvioId(),
            CampaniasPublicidadesEnviosDetalles: GetCampaniasPublicidadesEnviosDetalles()
        };

        return campaniaPublicidadEnvio;
    };

    function GetCampaniasPublicidadesEnviosDetalles() {
        var campaniaPublicidadEnvioDetallesList = [];

        if (self.tipoEnvioId() == 2) {
            $.each(self.diasSemanaList(), function (i, diaSemana) {
                if (diaSemana.Check) {
                    var campaniaPublicidadEnvioDetalle = {
                        CampaniaPublicidadEnvioDetalleId: Guid.NewGuid(),
                        DiaSemana: diaSemana.DiaSemanaId,
                        Hora: self.hora()
                    };

                    campaniaPublicidadEnvioDetallesList.push(campaniaPublicidadEnvioDetalle);
                };
            });
        } else {
            var campaniaPublicidadEnvioDetalle = {
                CampaniaPublicidadEnvioDetalleId: Guid.NewGuid(),
                Hora: self.hora(),
                Dia: self.dia() != null ? self.dia() : (self.anual() != null ? moment(self.anual(), "DD/MM").format("DD") : (self.unicaVez() != null ? moment(self.unicaVez()).format("DD") : null)),
                Mes: self.anual() != null ? moment(self.anual(), "DD/MM").format("MM") : (self.unicaVez() != null ? moment(self.unicaVez()).format("MM") : null),
                Anio: self.unicaVez() != null ? moment(self.unicaVez()).format("YYYY") : null
            };

            campaniaPublicidadEnvioDetallesList.push(campaniaPublicidadEnvioDetalle);
        };

        return campaniaPublicidadEnvioDetallesList;
    };
};


$(document).ready(function () {
    ko.bindingHandlers.froala = {
        init: function (element, valueAccessor) {
            var editor = new FroalaEditor(element, {
                //toolbarButtons: ['insertFiles', 'bold' ]
                theme: 'dark',
                //height: 200,
                //height: 'calc(100% - 220px)',
                placeholderText: 'Cuerpo',
                charCounterMax: 8000,
                imageUploadMethod: 'POST',
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                fontSize: ['8', '9', '10', '11', '12', '13', '14', '16', '18', '20', '22', '24', '30', '34', '38', '42', '50', '56', '62', '68', '74', '82'],
                events: {
                    'image.beforeUpload': function (images) {
                        var reader = new FileReader();
                        var addFileControl = images[0];

                        reader.onload = function () {
                            var array = masterCampaniaMailVM.imagen().arrayBufferToBase64(this.result);

                            if (array != false) {
                                var guid = Guid.NewGuid();

                                masterCampaniaMailVM.imagen().addFile(addFileControl.name, this.result, addFileControl.type, array, null, guid);
                            };
                        };
                        reader.readAsArrayBuffer(images[0]);
                    },
                    'image.inserted': function ($img) {
                        //facWebs.GuardarImagen(GetArchivos()).done(function (urlImage) {
                        //    $img[0].src = urlImage;
                        //});
                    },
                    'image.replaced': function ($img) {
                        //facWebs.GuardarImagen(GetArchivos()).done(function (urlImage) {
                        //    $img[0].src = urlImage;
                        //});
                    },
                    'image.removed': function ($img) {
                        //facWebs.EliminarImagen({ ArchivoPath: $img[0].src }).done(function () {
                        //});
                    },
                },
                //imageMaxSize: 5 * 1024 * 1024
            });
        }
    };

    masterCampaniaMailVM = new CampaniaMailVM();
    ko.applyBindings(masterCampaniaMailVM, document.getElementById('CampaniaMail'));
});