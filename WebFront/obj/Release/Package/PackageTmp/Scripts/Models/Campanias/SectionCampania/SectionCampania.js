function SectionCampaniaVM() {
    var self = this;

    self.tipoCampaniasList = ko.observableArray([]);

    self.LoadVM = function () {
        self.tipoCampaniasList.removeAll();
        $.each(new Enums().TipoCampaniasList, function (i, tipoCampania) {
            var tipoCampaniaClass = new TipoCampaniaClass();

            tipoCampaniaClass.TipoCampaniaId(tipoCampania.TipoCampaniaId);
            tipoCampaniaClass.TipoCampania(tipoCampania.TipoCampania);
            tipoCampaniaClass.Nombre(tipoCampania.Nombre);
            tipoCampaniaClass.Orden(tipoCampania.Orden);
            tipoCampaniaClass.Validar(tipoCampania.Validar);
            tipoCampaniaClass.Icono(tipoCampania.Icono);

            switch (tipoCampania.TipoCampania) {
                case new Enums().TipoCampania.CampaniaWhatsappTemplate:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaWhatsappTemplateVM);
                    break;
                case new Enums().TipoCampania.CampaniaWhatsappButton:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaWhatsappButtonVM);
                    break;
                case new Enums().TipoCampania.CampaniaFormulario:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaFormularioVM);
                    break;
                case new Enums().TipoCampania.CampaniaBanner:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaBannerVM);
                    break;
                case new Enums().TipoCampania.CampaniaQR:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaQRVM);
                    break;
                case new Enums().TipoCampania.CampaniaMail:
                    tipoCampaniaClass.MasterTipoCampania(masterCampaniaMailVM);
                    break;
            };

            self.tipoCampaniasList.push(tipoCampaniaClass);
        });
    };

    self.EditVM = function (campania) {
        self.LoadVM();

        $.each(campania.CampaniasPublicidades, function (i, campaniaPublicidad) {
            var tipoCampania = Enumerable.From(self.tipoCampaniasList()).Where(function (x) {
                return x.TipoCampania() == campaniaPublicidad.TipoCampania;
            }).FirstOrDefault();

            tipoCampania.MasterTipoCampania().tipoCampania(tipoCampania);
            tipoCampania.MasterTipoCampania().campaniaPublicidad(campaniaPublicidad);
            tipoCampania.MasterTipoCampania().botonAgregar();
        });
    };

    function TipoCampaniaClass() {
        var me = this;

        me.TipoCampaniaId = ko.observable();
        me.TipoCampania = ko.observable();
        me.Nombre = ko.observable();
        me.Orden = ko.observable(false);
        me.Validar = ko.observable(false);
        me.Icono = ko.observable();
        me.MasterTipoCampania = ko.observable();

        me.SeleccionarFila = ko.observable();

        me.ButtonSeleccionar = function () {
            $.each(self.tipoCampaniasList(), function (i, o) {
                if (o.TipoCampaniaId() == me.TipoCampaniaId()) {
                    o.SeleccionarFila("seleccionarFila");
                    me.MasterTipoCampania().tipoCampania(me);
                    me.MasterTipoCampania().visibleTipoCampania(true);
                } else {
                    o.SeleccionarFila("");
                    o.MasterTipoCampania().visibleTipoCampania(false);
                };
            });
        };
    };
};


$(document).ready(function () {
    masterSectionCampaniaVM = new SectionCampaniaVM();
    ko.applyBindings(masterSectionCampaniaVM, document.getElementById('SectionCampania'));
});