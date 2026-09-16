function CampaniaWhatsappTemplateVM() {
    var self = this;

    self.visibleTipoCampania = ko.observable(false);
    self.tipoCampania = ko.observable();
    self.campaniaPublicidad = ko.observable(null);

    self.visibleAgregar = ko.observable(false);

    self.plantilla = ko.observable();
    self.plantillaList = ko.observableArray([]);

    self.variablesList = ko.observableArray([]);

    self.visibleMensaje = ko.observable(false);
    self.textoMensaje = ko.observable();

    self.tipoEnviosList = ko.observableArray([]);
    self.tipoEnvioId = ko.observable();

    self.diasSemanaList = ko.observableArray([]);

    self.hora = ko.observable();
    self.dia = ko.observable();
    self.anual = ko.observable();
    self.unicaVez = ko.observable();

    self.datosAdicionalesLeadsList = ko.observableArray([]);
    self.datosAdicionalesNegociosList = ko.observableArray([]);

    self.botonAgregar = function () {
        self.tipoCampania().Validar(true);

        self.diasSemanaList(new Enums().DiasSemanaList);

        self.tipoEnvioId(null);
        self.tipoEnviosList(new Enums().TipoEnviosList);
        if (self.campaniaPublicidad() != null) {
            self.tipoEnvioId(self.campaniaPublicidad().CampaniasPublicidadesEnvios.TipoEnvio);
            $('#select-envioTemplate').trigger("change");
        } else {
            self.changeTipoEnvio();
        };

        self.plantilla(null);
        $('#selectPlantilla').trigger("change");

        if (self.plantillaList().length == 0 || self.campaniaPublicidad() != null) {
            self.plantillaList.removeAll();
            self.datosAdicionalesLeadsList.removeAll();
            self.datosAdicionalesNegociosList.removeAll();

            $.when(facCrm.ConseguirPlantillasPorEstado(1), facCrm.ConseguirDatosAdicionales(0), facCrm.ConseguirDatosAdicionales(1)).then(function (plantillasList, datosAdicionalesLeadList, datosAdicionalesNegociosList) {

                

                $.each(plantillasList[0], function (i, plantilla) {
                    if (plantilla.Habilitada) {
                        var plantillaClass = new PlantillaClass();

                        plantillaClass.PlantillaId(plantilla.PlantillaId);
                        plantillaClass.Nombre(plantilla.Nombre);
                        plantillaClass.Mensaje(plantilla.Mensaje);

                        self.plantillaList.push(plantillaClass);
                    }
                   
                });

                $.each(datosAdicionalesLeadList[0], function (i, datoAdicional) {
                    var datoAdicionalClass = new DatoAdicionalClass();

                    datoAdicionalClass.DatoAdicionalId(datoAdicional.DatoAdicionalId);
                    datoAdicionalClass.Nombre(datoAdicional.Nombre);

                    self.datosAdicionalesLeadsList.push(datoAdicionalClass);
                });

                $.each(datosAdicionalesNegociosList[0], function (i, datoAdicional) {
                    var datoAdicionalClass = new DatoAdicionalClass();

                    datoAdicionalClass.DatoAdicionalId(datoAdicional.DatoAdicionalId);
                    datoAdicionalClass.Nombre(datoAdicional.Nombre);

                    self.datosAdicionalesNegociosList.push(datoAdicionalClass);
                });

                if (self.campaniaPublicidad() != null) {
                    self.plantilla(self.campaniaPublicidad().TemplateId);
                    $('#selectPlantilla').trigger("change");
                };
            });
        };

        self.visibleAgregar(true);
    };

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    
    self.changeTipoEnvio = function () {
        $("#txtHoraTemplate").prop('required', false);
        $("#txtDiaTemplate").prop('required', false);
        $("#txtAnualTemplate").prop('required', false);
        $("#txtUnicaVezTemplate").prop('required', false);

        self.diasSemanaList(new Enums().DiasSemanaList);

        self.hora(null);
        self.dia(null);
        self.anual(null);
        self.unicaVez(null);

        switch (self.tipoEnvioId()) {
            case 1:
                $("#txtHoraTemplate").prop('required', true);
                if (self.campaniaPublicidad() != null) {
                    var horaFormateada = moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Hora).format("HH:mm");
                    self.hora(horaFormateada);
                };
                break;
            case 2:
                $("#txtHoraTemplate").prop('required', true);

                if (self.campaniaPublicidad() != null) {
                    var horaFormateada = moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Hora).format("HH:mm");
                    self.hora(horaFormateada);

                    $.each(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles, function (i, campaniaPublicidadEnvioDetalle) {
                        var diaSemana = Enumerable.From(self.diasSemanaList()).Where(function (x) { return x.DiaSemanaId == campaniaPublicidadEnvioDetalle.DiaSemana; }).FirstOrDefault();
                        diaSemana.Check = true;
                        $("#" + diaSemana.DiaSemanaId + "_Template").click();
                    });
                };
                break;
            case 3:
                if (self.campaniaPublicidad() != null) {
                    self.dia(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD"));
                };

                $('#txtDiaTemplate').datepicker({
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

                $("#txtDiaTemplate").prop('required', true);
                break;
            case 4:
                if (self.campaniaPublicidad() != null) {
                    self.anual(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD") + "/" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Mes, "M").format("MM"));
                };

                $('#txtAnualTemplate').datepicker({
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

                $("#txtAnualTemplate").prop('required', true);
                break;
            case 5:
                if (self.campaniaPublicidad() != null) {
                    self.unicaVez(moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Anio, "Y").format("YYYY") + "-" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Mes, "M").format("MM") + "-" +
                        moment(self.campaniaPublicidad().CampaniasPublicidadesEnvios.CampaniasPublicidadesEnviosDetalles[0].Dia, "D").format("DD"));
                };

                $("#txtUnicaVezTemplate").prop('required', true);
                break;
        };
    };

    self.changePlantilla = function () {
        self.variablesList.removeAll();

        if (self.plantilla() != undefined) {
            var plantilla = Enumerable.From(self.plantillaList()).Where(function (x) { return x.PlantillaId() == self.plantilla(); }).FirstOrDefault();

            var listaVariables = [...plantilla.Mensaje().matchAll(/\$\{(.*?)\}/g)].map(m => m[1].replace(/[^\w\s]/gi, ''));

            $.each(listaVariables, function (i, variable) {
                var variableClass = new VariableClass();

                variableClass.VariableId(i);
                variableClass.Nombre(variable);

                $.each(new Enums().ParametrosList, function (i, parametro) {
                    var parametroClass = new ParametrosClass();

                    parametroClass.ParametroId(parametro.ParametroId);
                    parametroClass.Nombre(parametro.Nombre);

                    variableClass.ParametrosList.push(parametroClass);
                });

                $.each(self.datosAdicionalesLeadsList(), function (i, datoAdicionalLead) {
                    var parametroClass = new ParametrosClass();

                    parametroClass.ParametroId(datoAdicionalLead.DatoAdicionalId());
                    parametroClass.Nombre(datoAdicionalLead.Nombre());

                    variableClass.ParametrosList.push(parametroClass);
                });

                $.each(self.datosAdicionalesNegociosList(), function (i, datoAdicionalNegocio) {
                    var parametroClass = new ParametrosClass();

                    parametroClass.ParametroId(datoAdicionalNegocio.DatoAdicionalId());
                    parametroClass.Nombre(datoAdicionalNegocio.Nombre());

                    variableClass.ParametrosList.push(parametroClass);
                });

                if (self.campaniaPublicidad() != null) {
                    var campaniaPublicidadWhatsappTemplateVariable = Enumerable.From(self.campaniaPublicidad().CampaniasPublicidadesWhatsappTemplateVariable).Where(function (x) { return x.Variable == variable; }).FirstOrDefault();
                    variableClass.ParametroId(campaniaPublicidadWhatsappTemplateVariable.Campo);
                };

                self.variablesList.push(variableClass);
            });

            $(".select-control-lista").select2();

            self.textoMensaje(plantilla.Mensaje());
            self.visibleMensaje(true);
        } else {
            self.visibleMensaje(false);
            self.textoMensaje("");
        };
    };

    function PlantillaClass() {
        var me = this;

        me.PlantillaId = ko.observable();
        me.Nombre = ko.observable();
        me.Mensaje = ko.observable();
    };

    function VariableClass() {
        var me = this;

        me.VariableId = ko.observable();
        me.Nombre = ko.observable();

        me.ParametrosList = ko.observableArray([]);
        me.ParametroId = ko.observable();
    };

    function ParametrosClass() {
        var me = this;

        me.ParametroId = ko.observable();
        me.Nombre = ko.observable();
    };

    function DatoAdicionalClass() {
        var me = this;

        me.DatoAdicionalId = ko.observable();
        me.Nombre = ko.observable();
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesWhatsappTemplate();
    };

    function GetCampaniasPublicidadesWhatsappTemplate() {
        var campaniaPublicidadWhatsappTemplate = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaWhatsappTemplate,
            TemplateId: self.plantilla(),
            CampaniasPublicidadesWhatsappTemplateVariable: self.variablesList().length ? GetCampaniasPublicidadesWhatsappTemplateVariable() : null,
            CampaniasPublicidadesEnvios: GetCampaniasPublicidadesEnvios()
        };

        return campaniaPublicidadWhatsappTemplate;
    };

    function GetCampaniasPublicidadesWhatsappTemplateVariable() {
        var campaniaPublicidadWhatsappTemplateVariableList = [];

        $.each(self.variablesList(), function (i, variable) {
            var campaniaPublicidadWhatsappTemplateVariable = {
                Variable: variable.Nombre(),
                Campo: variable.ParametroId()
            };

            campaniaPublicidadWhatsappTemplateVariableList.push(campaniaPublicidadWhatsappTemplateVariable);
        });

        return campaniaPublicidadWhatsappTemplateVariableList;
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
    masterCampaniaWhatsappTemplateVM = new CampaniaWhatsappTemplateVM();
    ko.applyBindings(masterCampaniaWhatsappTemplateVM, document.getElementById('CampaniaWhatsappTemplate'));
});