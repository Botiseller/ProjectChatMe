function SegmentosVM() {
    var self = this;

    var segmentosListGlobal = [];

    self.segmentosList = ko.observableArray([]);
    self.datosAdicionalesList = ko.observableArray([]);
    self.showPanel = ko.observable(false);

    $("#txtBuscar").keyup(function (e) {
        self.FiltrarSegmentos();
    });

    self.FiltrarSegmentos = function () {
        var listGeneral = segmentosListGlobal;

        listGeneral = segmentosListGlobal.filter(function (x) { return (x.Nombre().toLowerCase()).includes($("#txtBuscar").val().toLowerCase()); });

        let result = listGeneral.filter((item, index) => {
            return listGeneral.indexOf(item) === index;
        });

        self.segmentosList(result);
    };

    self.LoadVM = function () {

        facCrm.ConseguirDatosAdicionales(0).done(function (datosAdicionalesList) {
            
            $.each(datosAdicionalesList, function (i, datoAdicional) {
                var datoAdicionalClass = new DatosAdicionalesClass();

                datoAdicionalClass.DatoAdicionalId(datoAdicional.DatoAdicionalId);
                datoAdicionalClass.Nombre(datoAdicional.Nombre);
                self.datosAdicionalesList.push(datoAdicionalClass);
                
            });

            self.LoadSegmentos();

        });


        
    };

    self.CallBackSave = function () {
        $("#modalCrearSegmentos").modal("hide");
        self.LoadSegmentos();
    }

    self.LoadSegmentos = function () {
        self.showPanel(false);
        facSegmentos.ConseguirSegmentos().done(function (segmentosList) {
            self.segmentosList.removeAll();

            $.each(segmentosList, function (i, campaniaSegmento) {
                var campaniaSegmentoClass = new CampaniasSegmentosClass();

                campaniaSegmentoClass.CampaniaSegmentoId(campaniaSegmento.CampaniaSegmentoId);
                campaniaSegmentoClass.Nombre(campaniaSegmento.Nombre);
                campaniaSegmentoClass.CampaniasActivas(campaniaSegmento.CampaniasActivas);

                campaniaSegmentoClass.IncluyeContacto(campaniaSegmento.IncluyeContacto);
                campaniaSegmentoClass.IncluyeLead(campaniaSegmento.IncluyeLead);
                campaniaSegmentoClass.Descripcion(campaniaSegmento.Descripcion);


                if (isNaN(campaniaSegmento.SegmentoFiltro)) {
                    var filtros = JSON.parse(jQuery.base64.decode(campaniaSegmento.SegmentoFiltro));

                    if (filtros.EstadosLead != null && filtros.EstadosLead.length > 0) {
                        campaniaSegmentoClass.Filtros.push("Estado");
                    }

                    if (filtros.GruposLead != null && filtros.GruposLead.length > 0) {
                        campaniaSegmentoClass.Filtros.push("Grupo");
                    }

                    if (filtros.DatosAdicionalesFiltros?.Cantidades != null) {
                        $.each(Object.keys(filtros.DatosAdicionalesFiltros.Cantidades), function (i, o) {
                            var datoAdicional = Enumerable.From(self.datosAdicionalesList()).Where(function (x) { return x.DatoAdicionalId() == o }).FirstOrDefault();
                            if (datoAdicional != null)
                                campaniaSegmentoClass.Filtros.push(datoAdicional.Nombre());
                        });
                    }

                    if (filtros.DatosAdicionalesFiltros?.Fechas != null) {
                        $.each(Object.keys(filtros.DatosAdicionalesFiltros.Fechas), function (i, o) {
                            var datoAdicional = Enumerable.From(self.datosAdicionalesList()).Where(function (x) { return x.DatoAdicionalId() == o }).FirstOrDefault();
                            if (datoAdicional != null)
                                campaniaSegmentoClass.Filtros.push(datoAdicional.Nombre());
                        });
                    }

                    if (filtros.DatosAdicionalesFiltros?.ValoresList != null) {
                        $.each(Object.keys(filtros.DatosAdicionalesFiltros.ValoresList), function (i, o) {
                            var datoAdicional = Enumerable.From(self.datosAdicionalesList()).Where(function (x) { return x.DatoAdicionalId() == o }).FirstOrDefault();
                            if (datoAdicional != null)
                                campaniaSegmentoClass.Filtros.push(datoAdicional.Nombre());
                        });
                    }

                };

                $.each(campaniaSegmento.CampaniasPublicidadesList, function (i, campaniaPublicidad) {
                    var campaniaPublicidadClass = new CampaniasPublicidadesClass();

                    campaniaPublicidadClass.TipoCampania(campaniaPublicidad.TipoCampania);
                    campaniaPublicidadClass.NombreStr(campaniaPublicidad.NombreStr);

                    campaniaSegmentoClass.CampaniasPublicidadesList.push(campaniaPublicidadClass);
                });

                self.segmentosList.push(campaniaSegmentoClass);
            });

            segmentosListGlobal = self.segmentosList();
            self.showPanel(true);
        });

    }

    self.buttonCrearSegmento = function () {
        //var hash = "#segmentos/" + jQuery.base64.encode(Guid.Empty);
        //location.href = "/Segmentos/Segmentos/CrearSegmentos" + hash;
        masterCrearSegmentosVM.Initialize(null);
    };

    function CampaniasSegmentosClass() {
        var me = this;

        me.CampaniaSegmentoId = ko.observable();
        me.Nombre = ko.observable();
        me.CampaniasActivas = ko.observable();
        me.CampaniasPublicidadesList = ko.observableArray([]);

        me.IncluyeContacto = ko.observable();
        me.IncluyeLead = ko.observable();
        me.Descripcion = ko.observable();
        me.Filtros = ko.observableArray([]);
        

        me.ButtonCrearSegmento = function () {
            //var hash = "#segmentos/" + jQuery.base64.encode(me.CampaniaSegmentoId());
            //location.href = "/Segmentos/Segmentos/CrearSegmentos" + hash;
            masterCrearSegmentosVM.Initialize(me.CampaniaSegmentoId(), masterSegmentosVM.CallBackSave);
        };
    };

    function DatosAdicionalesClass() {
        var me = this;

        me.DatoAdicionalId = ko.observable();
        me.Nombre = ko.observable();
        
    };


    function CampaniasPublicidadesClass() {
        var me = this;

        me.TipoCampania = ko.observable();
        me.NombreStr = ko.observable();
    };
};

$(document).ready(function () {
    $(".subheader-title").find("small").html("Para crear un nuevo segmento haz click <a class='cursor-pointer' onclick='ButtonCrearSegmento()'>aqui</a>.")

    masterSegmentosVM = new SegmentosVM();

    ko.applyBindings(masterSegmentosVM, document.getElementById('Segmentos'));
    masterSegmentosVM.LoadVM();
});

function ButtonCrearSegmento() {
    var hash = "#segmentos/" + jQuery.base64.encode(Guid.Empty);
    location.href = "/Segmentos/Segmentos/CrearSegmentos" + hash;
};