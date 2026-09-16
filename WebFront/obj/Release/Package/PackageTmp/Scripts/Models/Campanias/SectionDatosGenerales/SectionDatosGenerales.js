function SectionDatosGeneralesVM() {
    var self = this;

    self.nombre = ko.observable();
    self.habilitado = ko.observable(false);

    self.conFechaFin = ko.observable(false);
    self.fechaInicio = ko.observable();
    self.fechaFin = ko.observable();

    self.tipoComunicacion = ko.observable("1");

    self.tipoComunicacionDetalle = ko.observable("1");
    self.compraOtrosTexto = ko.observable("");

    self.otrosTexto = ko.observable("");

    self.descripcion = ko.observable();

    self.LoadVM = function () {
        self.nombre('');
        self.habilitado(false);
        self.conFechaFin(false);
        self.fechaInicio(null);
        self.fechaFin(null);
        self.tipoComunicacion("1");
        self.tipoComunicacionDetalle("1");
        self.compraOtrosTexto("");
        self.otrosTexto("");
        self.descripcion("");

    };

    self.EditVM = function (campania) {
        self.nombre(campania.Nombre);
        self.fechaInicio(moment(campania.FechaInicio).format("DD/MM/YYYY"));

        self.changeFechaInicio();

        if (campania.FechaFin != null) {
            self.conFechaFin(true);
            self.fechaFin(moment(campania.FechaFin).format("DD/MM/YYYY"));

            self.changeConFechaFin();
            self.changeFechaFin();
        };

        self.descripcion(campania.Descripcion);
        self.habilitado(campania.Habilitado);

        self.tipoComunicacion(campania.CampaniasComunicaciones.TipoComunicacion.toString());

        if (campania.CampaniasComunicaciones.TipoComunicacionDetalle != null) {
            self.tipoComunicacionDetalle(campania.CampaniasComunicaciones.TipoComunicacionDetalle.toString());
        };
     
        self.buttonTipoComunicacion();
        self.buttonTipoComunicacionDetalle();

        if (campania.CampaniasComunicaciones.TipoComunicacion == "4") {
            self.otrosTexto(campania.CampaniasComunicaciones.TipoComunicacionOtro);
        } else if (campania.CampaniasComunicaciones.TipoComunicacion == "3" && campania.CampaniasComunicaciones.TipoComunicacionDetalle == "3") {
            self.compraOtrosTexto(campania.CampaniasComunicaciones.TipoComunicacionOtro)
        };

        if (moment().isSameOrAfter(moment(campania.FechaInicio)) && self.habilitado()) {
            masterCrearCampaniasVM.editable(false)
        }

        //Se activa el rango de fecha desde hasta
        //$('.datepicker-bottom-left').datepicker({
        //    language: 'es',
        //    format: "dd/mm/yyyy",
        //    /* orientation: "bottom left",*/
        //    /*todayHighlight: true,*/
        //    autoclose: true,
        //    /* showAnim: 'slideDown',*/
        //    clearBtn: true,
        //    templates: {
        //        leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
        //        rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
        //    }
        //});

        /*$('.divRangoFechaCreacion').datepicker();*/


    };

    self.changeConFechaFin = function () {
        if (!self.conFechaFin()) {
            self.fechaFin(null);
            document.getElementById("txtFechaInicio").max = null;
            $("#txtFechaFin").prop('required', false);
        } else {
            $("#txtFechaFin").prop('required', true);
        };
    };

    self.changeFechaInicio = function () {
        document.getElementById("txtFechaFin").min = moment(self.fechaInicio()).format("YYYY-MM-DD");
    };

    self.changeFechaFin = function () {
        document.getElementById("txtFechaInicio").max = moment(self.fechaFin()).format("YYYY-MM-DD");
    };

    self.buttonTipoComunicacion = function () {
        if (self.tipoComunicacion() == "4") {
            $("#txtOtrosTexto").prop('required', true);
        } else {
            self.otrosTexto("");
            $("#txtOtrosTexto").prop('required', false);
        };

        if (self.tipoComunicacion() != "3") {
            self.tipoComunicacionDetalle("1");
            self.buttonTipoComunicacionDetalle();
        };

        return true;
    };

    self.buttonTipoComunicacionDetalle = function () {
        if (self.tipoComunicacionDetalle() == "3") {
            $("#txtCompraOtrosTexto").prop('required', true);
        } else {
            self.compraOtrosTexto("");
            $("#txtCompraOtrosTexto").prop('required', false);
        };

        return true;
    };
};


$(document).ready(function () {
    masterSectionDatosGeneralesVM = new SectionDatosGeneralesVM();
    ko.applyBindings(masterSectionDatosGeneralesVM, document.getElementById('SectionDatosGenerales'));
});