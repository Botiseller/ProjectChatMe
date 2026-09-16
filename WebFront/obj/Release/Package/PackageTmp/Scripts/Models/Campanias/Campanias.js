function CampaniasVM() {
    var self = this;

    var CANTIDAD_LOTE = 28; // debe coincidir con "cantidadLote" del manager en el back

    self.campaniasList = ko.observableArray([]);
    self.tipoCampaniasList = ko.observableArray([]);
    self.estadosList = ko.observableArray([]);
    self.showPanel = ko.observable(false);
    
    self.lote = 1;
    self.cargandoLote = ko.observable(false)
    self.hayMasResultados = true;

    var buscarTimeout = null;
    $("#txtBuscar").keyup(function(e) {
        clearTimeout(buscarTimeout);
        buscarTimeout = setTimeout(function() {
            self.FiltrarCampanias();
        }, 300);
    });

    self.buttonCheck = function() {
        self.FiltrarCampanias();
        return true;
    };

    self.buttonCheckEstado = function(estadoClicked) {
        if (estadoClicked.EstadoCampania() == null) {
            $.each(self.estadosList(), function(i, estado) {
                estado.Check(estado === estadoClicked);
            });
        } else {
            var todas = self.estadosList()[0];
            todas.Check(false);

            if (Enumerable.From(self.estadosList()).Where(function(x) { return x.Check(); }).ToArray().length == 0) {
                todas.Check(true);
            }
        }

        self.FiltrarCampanias();
        return true;
    };

    self.ObtenerFiltros = function() {
        return {
            lote: self.lote,
            buscador: $("#txtBuscar").val(),
            estados: Enumerable.From(self.estadosList())
                .Where(function(x) { return x.Check() && x.EstadoCampania() != null; })
                .Select(function(x) { return x.EstadoCampania(); })
                .ToArray(),
            canales: Enumerable.From(self.tipoCampaniasList())
                .Where(function(x) { return x.Check(); })
                .Select(function(x) { return x.TipoCampania(); })
                .ToArray()
        };
    };

    // se llama cuando cambia un filtro (buscador/estado/canal): arranca de nuevo desde el lote 1
    self.FiltrarCampanias = function() {
        self.lote = 1;
        self.hayMasResultados = true;
        self.ConseguirCampanias(false);
    };

    // se llama al scrollear cerca del final: pide el lote siguiente y lo agrega al final
    self.SiguienteLote = function() {
        if (!self.hayMasResultados || self.cargandoLote()) { // antes: self.cargandoLote
            return;
        }

        self.lote = self.lote + 1;
        self.ConseguirCampanias(true);
    };

    self.LoadVM = function() {
        var todas = new EstadoClass();
        todas.Nombre("Todas");
        todas.EstadoCampania(null);
        todas.Check(false);
        self.estadosList.push(todas);

        $.each([
            { EstadoCampania: 1, Nombre: "En curso" },
            { EstadoCampania: 2, Nombre: "Deshabilitada" },
            { EstadoCampania: 3, Nombre: "Terminada" }
        ], function(i, estado) {
            var estadoClass = new EstadoClass();
            estadoClass.EstadoCampania(estado.EstadoCampania);
            estadoClass.Nombre(estado.Nombre);
            if (estado.EstadoCampania == 1)
                estadoClass.Check(true);
            self.estadosList.push(estadoClass);
        });

        $.each(new Enums().TipoCampaniasList, function(i, tipoCampania) {
            var tipoCampaniaClass = new TipoCampaniasClass();

            tipoCampaniaClass.TipoCampaniaId(tipoCampania.TipoCampaniaId);
            tipoCampaniaClass.TipoCampania(tipoCampania.TipoCampania);
            tipoCampaniaClass.Nombre(tipoCampania.Nombre);
            tipoCampaniaClass.Orden(tipoCampania.Orden);

            self.tipoCampaniasList.push(tipoCampaniaClass);
        });

        self.ConseguirCampanias(false);
    };

    // append == false: reemplaza la lista (primer pedido o cambio de filtro)
    // append == true: agrega al final (scroll infinito)
    self.ConseguirCampanias = function(append) {
        if (self.cargandoLote()) {
            return;
        }
        if (!append) {
            self.campaniasList.removeAll();
        }
        self.cargandoLote(true);
        self.showPanel(true);
        var filtros = self.ObtenerFiltros();

        facCampanias.ConseguirCampanias(filtros).done(function(campaniasList) {
            

            $.each(campaniasList, function(i, campania) {
                var campaniaClass = new CampaniasClass();

                campaniaClass.CampaniaId(campania.CampaniaId);
                campaniaClass.Nombre(campania.Nombre);

                campaniaClass.FechaInicio(moment(campania.FechaInicio).format('DD/MM/YYYY'));

                if (campania.FechaFin != null) {
                    campaniaClass.FechaFin(moment(campania.FechaFin).format('DD/MM/YYYY'));
                };

                campaniaClass.FechaStr("Fecha: " + campaniaClass.FechaInicio() + (campaniaClass.FechaFin() != null ? " al " + campaniaClass.FechaFin() : ""));

                campaniaClass.Habilitado(campania.Habilitado);

                if (campania.CampaniasSegmentos != null) {
                    campaniaClass.CampaniasSegmentosNombre("Segmento: " + campania.CampaniasSegmentos.Nombre);
                };

                if (campania.CampaniasSegmentosImportados != null) {
                    campaniaClass.CampaniasSegmentosImportado(campania.CampaniasSegmentosImportados.length);
                };

                $.each(campania.CampaniasPublicidades, function(i, tipoPublicida) {
                    var tipoCampaniaClass = new TipoCampaniasClass();

                    tipoCampaniaClass.TipoCampania(tipoPublicida.TipoCampania);
                    tipoCampaniaClass.NombreStr(tipoPublicida.NombreStr);

                    campaniaClass.CampaniasPublicidadesList.push(tipoCampaniaClass);
                });

                self.campaniasList.push(campaniaClass);
            });

            self.hayMasResultados = campaniasList.length === CANTIDAD_LOTE;
            
            self.cargandoLote(false);
            $('.has-tooltip').tooltip();
        }).fail(function() {
            self.cargandoLote(false)
        });
    };

    self.buttonCrearCampania = function() {
        masterCrearCampaniasVM.Initialize(Guid.Empty);
    };

    function CampaniasClass() {
        var me = this;

        me.CampaniaId = ko.observable();
        me.Nombre = ko.observable();
        me.FechaInicio = ko.observable();
        me.FechaFin = ko.observable(null);
        me.FechaStr = ko.observable();
        me.Habilitado = ko.observable();
        me.CampaniasSegmentosNombre = ko.observable(null);
        me.CampaniasSegmentosImportado = ko.observable(null);

        me.CampaniasPublicidadesList = ko.observableArray([]);

        me.ButtonCrearCampania = function() {
            masterCrearCampaniasVM.Initialize(me.CampaniaId());
        };

        me.ButtonHabilitar = function(a, event) {
            event.stopPropagation();

            me.Habilitado(!me.Habilitado());

            $('.has-tooltip').tooltip();

            facCampanias.GuardarHabilitarDeshabilitar({ CampaniaId: me.CampaniaId(), Habilitado: me.Habilitado() }).done(function() {
            });

            return true;
        };
    };

    function TipoCampaniasClass() {
        var me = this;

        me.TipoCampaniaId = ko.observable();
        me.TipoCampania = ko.observable();
        me.Nombre = ko.observable();
        me.NombreStr = ko.observable();
        me.Orden = ko.observable(false);

        me.Check = ko.observable(false);
    };

    function EstadoClass() {
        var me = this;

        me.EstadoCampania = ko.observable();
        me.Nombre = ko.observable();
        me.Check = ko.observable(false);
    };
};

$(document).ready(function() {
    masterCampaniasVM = new CampaniasVM();

    ko.applyBindings(masterCampaniasVM, document.getElementById('Campanias'));
    masterCampaniasVM.LoadVM();

    $('#Campanias .overflow-auto').on('scroll', function() {
        var $el = $(this);
        var scrollRestante = $el[0].scrollHeight - $el.scrollTop() - $el.innerHeight();

        if (scrollRestante < 300) {
            masterCampaniasVM.SiguienteLote();
        }
    });
});


function ButtonCrearCampania() {
    //var hash = "#campanias/" + jQuery.base64.encode(Guid.Empty);
    //location.href = "/Campanias/Campanias/CrearCampanias" + hash;
    masterCrearCampaniasVM.Initialize(Guid.Empty);
    

};