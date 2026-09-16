function SectionDatosGeneralesVM() {
    var self = this;
    self.load = ko.observable(false);

    self.nombre = ko.observable();
    self.habilitado = ko.observable(false);

    self.conFechaFin = ko.observable(false);
    self.fechaInicio = ko.observable();
    self.fechaFin = ko.observable();

    self.descripcion = ko.observable();

    self.LoadVM = function () {
        self.load(true);
    };

    self.EditVM = function (selling) {
        self.nombre(selling.Nombre);
        self.fechaInicio(moment(selling.FechaInicio).format("YYYY-MM-DD"));

        self.changeFechaInicio();

        if (selling.FechaFin != null) {
            self.conFechaFin(true);
            self.fechaFin(moment(selling.FechaFin).format("YYYY-MM-DD"));

            self.changeConFechaFin();
            self.changeFechaFin();
        };

        self.descripcion(selling.Descripcion);
        self.habilitado(selling.Habilitado);
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
};


$(document).ready(function () {
    masterSectionDatosGeneralesVM = new SectionDatosGeneralesVM();
    ko.applyBindings(masterSectionDatosGeneralesVM, document.getElementById('SectionDatosGenerales'));
});