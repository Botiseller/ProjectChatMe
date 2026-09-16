function SellingVM() {
    var self = this;
    self.load = ko.observable(false);
    var sellingListGlobal = [];

    self.sellingList = ko.observableArray([]);

    self.tipoSellingList = ko.observableArray([]);

    $("#txtBuscar").keyup(function (e) {
        self.FiltrarSelling();
    });

    //Filtro 
    self.buttonCheck = function () {
        self.FiltrarSelling();
        return true;
    };

    self.FiltrarSelling = function () {
        var sellingListGeneral = sellingListGlobal;

        sellingListGeneral = sellingListGlobal.filter(function (x) { return (x.Nombre().toLowerCase()).includes($("#txtBuscar").val().toLowerCase()); });

        var tipoSellingFilter = ko.observableArray([]);

        $.each(Enumerable.From(self.tipoSellingList()).Where(function (x) { return x.Check(); }).ToArray(), function (i, tipoSellingCheck) {
            $.each(sellingListGlobal, function (i, sellingGlobal) {
                if (sellingGlobal.TipoSelling().TipoSelling() == tipoSellingCheck.TipoSelling()) {
                    tipoSellingFilter.push(sellingGlobal);
                };
            });
        });

        if (Enumerable.From(self.tipoSellingList()).Where(function (x) { return x.Check(); }).ToArray().length != 0) {
            sellingListGeneral = sellingListGeneral.filter(x => tipoSellingFilter().includes(x));
        };

        let result = sellingListGeneral.filter((sellingGeneral, index) => {
            return sellingListGeneral.indexOf(sellingGeneral) === index;
        });

        self.sellingList(result);
        $('.has-tooltip').tooltip();
    };

    self.LoadVM = function () {
        self.load(false);
        self.tipoSellingList.removeAll();
        $.each(new Enums().TipoSellingList, function (i, tipoSelling) {
            var tipoSellingClass = new TipoSellingClass();

            tipoSellingClass.TipoSellingId(tipoSelling.TipoSellingId);
            tipoSellingClass.TipoSelling(tipoSelling.TipoSelling);
            tipoSellingClass.Nombre(tipoSelling.Nombre);
            tipoSellingClass.Icono(tipoSelling.Icono);
            tipoSellingClass.Descripcion(tipoSelling.Descripcion);
            tipoSellingClass.Orden(tipoSelling.Orden);

            self.tipoSellingList.push(tipoSellingClass);
        });

        facSelling.ConseguirSellingTodos().done(function (sellingList) {
            self.sellingList.removeAll();

            $.each(sellingList, function (i, selling) {
                var sellingClass = new SellingClass();

                sellingClass.SellingId(selling.SellingId);
                sellingClass.Nombre(selling.Nombre);

                sellingClass.FechaInicio(moment(selling.FechaInicio).format('DD/MM/YYYY'));

                if (selling.FechaFin != null) {
                    sellingClass.FechaFin(moment(selling.FechaFin).format('DD/MM/YYYY'));
                };

                sellingClass.FechaStr("Fecha: " + sellingClass.FechaInicio() + (sellingClass.FechaFin() != null ? " al " + sellingClass.FechaFin() : ""));
                sellingClass.Descripcion(selling.Descripcion);
                sellingClass.Habilitado(selling.Habilitado);

                var tipoSelling = self.tipoSellingList().find(function (tipoSelling) {
                    return tipoSelling.TipoSelling() == selling.TipoSelling;
                });

                sellingClass.TipoSelling().TipoSelling(tipoSelling.TipoSelling());
                sellingClass.TipoSelling().Icono(tipoSelling.Icono());
                sellingClass.TipoSelling().Nombre(tipoSelling.Nombre());

                sellingClass.HorasConcatenadas(selling.SellingSelling.Avisos.map(function (avisoItem) {
                    return avisoItem.Hora + ' horas';
                }).join(' - '));

                $.each(Enumerable.From(selling.SellingProductos.ProductosVinculados).Distinct(x => x.ProductoPrincipalId).ToArray(), function (i, productoVinculadoItem) {
                    if (i < 6) {
                        var productoVinculadoClass = new ProductosVinculadosClass();

                        productoVinculadoClass.ProductoPrincipalId(productoVinculadoItem.ProductoPrincipalId);
                        productoVinculadoClass.NombreProductoPrincipal(productoVinculadoItem.NombreProductoPrincipal);
                        productoVinculadoClass.ImagenProductoPrincipal(productoVinculadoItem.ImagenProductoPrincipal);

                        sellingClass.ProductosVinculadosList.push(productoVinculadoClass);
                    };
                });

                self.sellingList.push(sellingClass);
            });

            sellingListGlobal = self.sellingList();
            $('.has-tooltip').tooltip();
            self.load(true);
        });
    };

    self.buttonCrearSelling = function () {
        masterCrearSellingVM.Initialize(Guid.Empty, masterSellingVM.CallBackSave);
        //var hash = "#selling/" + jQuery.base64.encode(Guid.Empty);
        //location.href = "/Selling/Selling/CrearSelling" + hash;
    };

    self.CallBackSave = function () {
        $("#modalCrearSelling").modal("hide");
        self.LoadVM();
    }

    function SellingClass() {
        var me = this;

        me.SellingId = ko.observable();
        me.Nombre = ko.observable();
        me.FechaInicio = ko.observable();
        me.FechaFin = ko.observable(null);
        me.FechaStr = ko.observable();
        me.Descripcion = ko.observable();
        me.Habilitado = ko.observable();

        me.TipoSelling = ko.observable(new TipoSellingClass());

        me.HorasConcatenadas = ko.observable();

        me.ProductosVinculadosList = ko.observableArray([]);

        me.ButtonCrearSelling = function () {

            masterCrearSellingVM.Initialize(me.SellingId(), masterSellingVM.CallBackSave);

            //var hash = "#selling/" + jQuery.base64.encode(me.SellingId());
            //location.href = "/Selling/Selling/CrearSelling" + hash;
        };

        me.ButtonHabilitar = function (a, event) {
            event.stopPropagation();

            me.Habilitado(!me.Habilitado());
            self.FiltrarSelling();

            $('.has-tooltip').tooltip();

            facSelling.GuardarHabilitarDeshabilitar({ SellingId: me.SellingId(), Habilitado: me.Habilitado() }).done(function () {
            });

            return true;
        };
    };

    function TipoSellingClass() {
        var me = this;

        me.TipoSellingId = ko.observable();
        me.TipoSelling = ko.observable();
        me.Nombre = ko.observable();
        me.Icono = ko.observable();
        me.Descripcion = ko.observable();
        me.Orden = ko.observable();

        me.Check = ko.observable(false);
    };

    function ProductosVinculadosClass() {
        var me = this;

        me.ProductoPrincipalId = ko.observable();
        me.NombreProductoPrincipal = ko.observable();
        me.ImagenProductoPrincipal = ko.observable();

        me.ProductoSincronizadoId = ko.observable();
        me.NombreProductoSincronizado = ko.observable();
        me.ImagenProductoSincronizado = ko.observable();
    };
};

$(document).ready(function () {

    masterSellingVM = new SellingVM();

    ko.applyBindings(masterSellingVM, document.getElementById('Selling'));
    masterSellingVM.LoadVM();
});



function ButtonCrearSelling() {
    var hash = "#selling/" + jQuery.base64.encode(Guid.Empty);
    location.href = "/Selling/Selling/CrearSelling" + hash;
};