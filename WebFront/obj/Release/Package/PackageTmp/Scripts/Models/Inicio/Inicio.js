function InicioVM() {
    var self = this;

    self.campaniasPublicidadesList = ko.observableArray([]);

    self.LoadVM = function () {
        facCampanias.ConseguirCampaniasPublicidades().done(function (campaniasPublicidadesList) {
            $.each(campaniasPublicidadesList, function (i, campaniaPublicidad) {
                var campaniaPublicidadClass = new CampaniasPublicidadesClass();

                campaniaPublicidadClass.TipoCampania(campaniaPublicidad.TipoCampania);
                campaniaPublicidadClass.NombreStr(campaniaPublicidad.NombreStr);

                self.campaniasPublicidadesList.push(campaniaPublicidadClass);
            });
        });
    };

    self.buttonCampanias = function () {
        location.href = "/Campanias/Campanias/Campanias";
    };

    self.buttonSegmentos = function () {
        location.href = "/Segmentos/Segmentos/Segmentos";
    };

    self.buttonSelling = function () {
        location.href = "/Selling/Selling/Selling";
    };

    self.buttonDashboard = function () {
        location.href = "/Dashboard/Dashboard";
    };

    function CampaniasPublicidadesClass() {
        var me = this;

        me.TipoCampania = ko.observable();
        me.NombreStr = ko.observable();
    };
};

$(document).ready(function () {
    $('.subheader').remove();

    masterInicioVM = new InicioVM();

    ko.applyBindings(masterInicioVM, document.getElementById('Inicio'));
    masterInicioVM.LoadVM();
});