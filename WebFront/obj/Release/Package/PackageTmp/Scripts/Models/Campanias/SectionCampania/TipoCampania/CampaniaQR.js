function CampaniaQRVM() {
    var self = this;

    self.visibleTipoCampania = ko.observable(false);
    self.tipoCampania = ko.observable();
    self.campaniaPublicidad = ko.observable(null);

    self.visibleAgregar = ko.observable(false);

    self.urlRedirigir = ko.observable();
    self.urlCodigoQR = ko.observable();

    self.Imagen = ko.observable(new modelFile());

    self.botonAgregar = function () {
        self.tipoCampania().Validar(true);

        if (self.campaniaPublicidad() != null) {
            self.urlCodigoQR(self.campaniaPublicidad().Qr);
            self.urlRedirigir(self.campaniaPublicidad().UrlDestino);
        } else {
            self.urlCodigoQR("http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=" + sessionData.WebUrlCampaignPublic + "/Campanias/Qr/" + sessionData.TokenId + "#code/" + masterCrearCampaniasVM.codigoCampania());
            self.urlRedirigir("");
        };

        self.visibleAgregar(true);
    };

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    self.botonImprimirQR = function () {
        var pwin = window.open(self.urlCodigoQR(), "_blank");

        pwin.onload = function () {
            window.print();
        };
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesQr();
    };

    function GetCampaniasPublicidadesQr() {
        var campaniaPublicidadQr = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaQR,
            Qr: self.urlCodigoQR(),
            UrlDestino: self.urlRedirigir()
        };

        return campaniaPublicidadQr;
    };
};


$(document).ready(function () {
    masterCampaniaQRVM = new CampaniaQRVM();
    ko.applyBindings(masterCampaniaQRVM, document.getElementById('CampaniaQR'));
});