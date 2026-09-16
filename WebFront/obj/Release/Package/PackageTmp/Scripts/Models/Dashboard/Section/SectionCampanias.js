function SectionCampaniasVM() {
    var self = this;

    self.visibleLoadingCampanias = ko.observable(true);

    self.campaniasActivas = ko.observable(0);
    self.canalesHabilitados = ko.observable(0);
    self.personasConectadas = ko.observable(0);

    self.campaniasList = ko.observableArray([]);
    self.fechaFiltro = ko.observable();

    self.campaniasPublicidadesList = ko.observableArray([]);

    self.inicioSesion = ko.observable(0);
    self.cantidadUsuarios = ko.observable(0);
    self.noEnviadas = ko.observable(0);

    self.viewCampaniasEmbudoVentasList = ko.observableArray([]);

    self.pageViewCampaniasDetallesEnvios = ko.observable(new PaginatorDos());
    self.propertyName = ko.observable("FechaEnvio");
    self.orden = ko.observable(true);
    self.visibleLoadingViewCampaniasDetallesEnvios = ko.observable(true);

    self.buttonCampaniaCheck = function (campaniaId) {
        if (campaniaId == Guid.Empty + '_Campanias') {
            Enumerable.From(self.campaniasList()).Where(function (x) { return x.CampaniaId() != Guid.Empty + '_Campanias'; }).Select(function (x) { return x.Check(false); }).ToArray();
        } else {
            if (!Enumerable.From(self.campaniasList()).Where(function (x) { return x.CampaniaId() != Guid.Empty + '_Campanias' && x.Check(); }).ToArray().length) {
                Enumerable.From(self.campaniasList()).Where(function (x) { return x.CampaniaId() == Guid.Empty + '_Campanias'; }).Select(function (x) { return x.Check(true); }).FirstOrDefault();
            } else {
                Enumerable.From(self.campaniasList()).Where(function (x) { return x.CampaniaId() == Guid.Empty + '_Campanias'; }).Select(function (x) { return x.Check(false); }).FirstOrDefault();
            };
        };

        self.visibleLoadingCampanias(true);

        LoadCampaniasPublicidadesFiltros();
        LoadSesionesGraficoEmbudoFiltros();
        LoadDetalleEnvioFiltros();

        return true;
    };

    self.changeFechaFiltro = function () {
        self.visibleLoadingCampanias(true);

        LoadSesionesGraficoEmbudoFiltros();
        LoadDetalleEnvioFiltros();
    };

    self.LoadVM = function () {
        self.visibleLoadingCampanias(true);
        LoadFiltros();

        facCampanias.ConseguirCampaniasActivas().done(function (campaniasActivas) {
            self.campaniasActivas(campaniasActivas);
        });

        facCampanias.ConseguirCampaniasPublicidades().done(function (campaniasPublicidadesList) {
            self.canalesHabilitados(campaniasPublicidadesList.length);
        });

        $(document).ajaxStop(function () {
            if ($('#SectionCampaniasTab').hasClass('active')) {
                self.visibleLoadingCampanias(false);
            };
        });
    };

    function LoadFiltros() {
        $('#txtFechaFiltroCampanias').daterangepicker({
            locale: {
                format: 'DD/MM/YYYY'
            },
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
            ranges:
            {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Ultimos 7 dias': [moment().subtract(6, 'days'), moment()],
                'Ultimos 30 dias': [moment().subtract(29, 'days'), moment()],
                'Este mes': [moment().startOf('month'), moment().endOf('month')],
                'Anterior mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });

        facCampanias.ConseguirCampanias().done(function (campaniasList) {
            self.campaniasList.removeAll();

            $.each(campaniasList, function (i, campania) {
                var campaniaClass = new CampaniasClass();

                campaniaClass.CampaniaId(campania.CampaniaId);
                campaniaClass.Nombre(campania.Nombre);

                if (campania.Habilitado) {
                    campaniaClass.Check(true);
                };

                self.campaniasList.push(campaniaClass);
            });

            var campaniaClass = new CampaniasClass();

            campaniaClass.CampaniaId(Guid.Empty + '_Campanias');
            campaniaClass.Nombre("Todas");

            if (self.campaniasList().filter(x => x.Check()).length) {
                campaniaClass.Check(false);
            } else {
                campaniaClass.Check(true);
            };

            self.campaniasList.unshift(campaniaClass);

            LoadCampaniasPublicidadesFiltros();
        });
    };

    function LoadCampaniasPublicidadesFiltros() {
        self.campaniasPublicidadesList.removeAll();

        $.each(new Enums().TipoCampaniasList, function (i, tipoCampania) {

            var campaniaPublicidadClass = new CampaniasPublicidadesClass();

            campaniaPublicidadClass.TipoCampaniaId(tipoCampania.TipoCampaniaId);
            campaniaPublicidadClass.TipoCampania(tipoCampania.TipoCampania);
            campaniaPublicidadClass.Nombre(tipoCampania.Nombre);

            self.campaniasPublicidadesList.push(campaniaPublicidadClass);
        });

        facCampanias.ConseguirCampaniasPublicidadesByFiltros(GetFiltrosReporte()).done(function (campaniasPublicidadesList) {
            $.each(campaniasPublicidadesList, function (i, campaniaPublicidad) {
                Enumerable.From(self.campaniasPublicidadesList()).Where(function (x) { return x.TipoCampania() == campaniaPublicidad.TipoCampania; }).Select(function (x) { return x.Validar(true); }).FirstOrDefault();
            });
        });
    };

    function LoadSesionesGraficoEmbudoFiltros() {
        facCampanias.ConseguirInicioSesionByFiltros(GetFiltrosReporte()).done(function (inicioSesion) {
            self.inicioSesion(inicioSesion);
        });

        facCampanias.ConseguirCantidadUsuariosByFiltros(GetFiltrosReporte()).done(function (cantidadUsuarios) {
            self.cantidadUsuarios(cantidadUsuarios);
        });

        facCampanias.ConseguirNoEnviadasByFiltros(GetFiltrosReporte()).done(function (noEnviadas) {
            self.noEnviadas(noEnviadas);
        });

        facCampanias.ConseguirViewCampaniasEmbudoVentas(GetFiltrosReporte()).done(function (viewCampaniasEmbudoVentasList) {
            var inicioSesion = 0;

            $.each(viewCampaniasEmbudoVentasList, function (index, itemViewCampaniaEmbudoVentas) {
                var viewCampaniaEmbudoVentaClass = new ViewCampaniaEmbudoVentaClass();

                viewCampaniaEmbudoVentaClass.NegocioId(itemViewCampaniaEmbudoVentas.NegocioId);
                viewCampaniaEmbudoVentaClass.ComunicacionId(itemViewCampaniaEmbudoVentas.ComunicacionId);
                viewCampaniaEmbudoVentaClass.CampaniaId(itemViewCampaniaEmbudoVentas.CampaniaId);
                viewCampaniaEmbudoVentaClass.NombreLeadNegocio(itemViewCampaniaEmbudoVentas.NombreLeadNegocio);
                viewCampaniaEmbudoVentaClass.NombreNegocio(itemViewCampaniaEmbudoVentas.NombreNegocio);
                viewCampaniaEmbudoVentaClass.EstadoNegocio(itemViewCampaniaEmbudoVentas.EstadoNegocio);
                viewCampaniaEmbudoVentaClass.TipoEstadoNegocio(itemViewCampaniaEmbudoVentas.TipoEstadoNegocio);
                viewCampaniaEmbudoVentaClass.FechaAltaNegocio(itemViewCampaniaEmbudoVentas.FechaAltaNegocio);
                viewCampaniaEmbudoVentaClass.FechaHoraInicioComunicacion(itemViewCampaniaEmbudoVentas.FechaHoraInicioComunicacion);
                viewCampaniaEmbudoVentaClass.FechaHoraFinComunicacion(itemViewCampaniaEmbudoVentas.FechaHoraFinComunicacion);

                inicioSesion = itemViewCampaniaEmbudoVentas.InicioSesion;

                self.viewCampaniasEmbudoVentasList.push(viewCampaniaEmbudoVentaClass);
            });

            Highcharts.chart('funnelChart', {
                chart: {
                    type: 'funnel',
                    marginRight: 100
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y})',
                            color: 'black',
                            softConnector: true
                        },
                        center: ['40%', '50%'],
                        neckWidth: '0%',
                        neckHeight: '0%',
                        width: '50%'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Cantidad',
                    data: [
                        ['Inicio sesiones', inicioSesion],
                        ['Negocios abierto', self.viewCampaniasEmbudoVentasList().length ? self.viewCampaniasEmbudoVentasList().filter(x => x.TipoEstadoNegocio() == 0).length : 0],
                        ['Negocios ganados', self.viewCampaniasEmbudoVentasList().length ? self.viewCampaniasEmbudoVentasList().filter(x => x.TipoEstadoNegocio() == 1).length : 0],
                        ['Negocios perdidos', self.viewCampaniasEmbudoVentasList().length ? self.viewCampaniasEmbudoVentasList().filter(x => x.TipoEstadoNegocio() == 2).length : 0]
                    ]
                }]
            });

            $(".highcharts-credits").hide();
        });
    };

    function LoadDetalleEnvioFiltros() {
        self.pageViewCampaniasDetallesEnvios().list.removeAll();
        self.visibleLoadingViewCampaniasDetallesEnvios(true);

        facCampanias.ConseguirViewCampaniasDetallesEnvios(GetConfiguracionReporte(self.pageViewCampaniasDetallesEnvios().pagina(), 10, self.propertyName(), self.orden())).done(function (reporteGeneral) {
            $.each(reporteGeneral.ViewCampaniasDetallesEnvios, function (index, itemViewCampaniaDetalleEnvio) {
                var viewCampaniaDetalleEnvioClass = new ViewCampaniaDetalleEnvioClass();

                viewCampaniaDetalleEnvioClass.FechaEnvio(itemViewCampaniaDetalleEnvio.FechaEnvio);
                viewCampaniaDetalleEnvioClass.Contacto(itemViewCampaniaDetalleEnvio.Contacto);
                viewCampaniaDetalleEnvioClass.Canal(itemViewCampaniaDetalleEnvio.Canal);
                viewCampaniaDetalleEnvioClass.Respondida(itemViewCampaniaDetalleEnvio.Respondida);
                viewCampaniaDetalleEnvioClass.Chat(itemViewCampaniaDetalleEnvio.Chat);

                self.pageViewCampaniasDetallesEnvios().list.push(viewCampaniaDetalleEnvioClass);
            });

            self.pageViewCampaniasDetallesEnvios().totalRows(reporteGeneral.CantidadFilas);
            self.visibleLoadingViewCampaniasDetallesEnvios(false);
        });
    };

    self.changePage = function (page) {
        self.pageViewCampaniasDetallesEnvios().changePage(page);
        LoadDetalleEnvioFiltros();
    };

    self.previusPage = function () {
        self.pageViewCampaniasDetallesEnvios().previusPage();
        LoadDetalleEnvioFiltros();
    };

    self.nextPage = function () {
        self.pageViewCampaniasDetallesEnvios().nextPage();
        LoadDetalleEnvioFiltros();
    };

    self.firstPage = function () {
        self.pageViewCampaniasDetallesEnvios().firstPage();
        LoadDetalleEnvioFiltros();
    };

    self.lastPage = function () {
        self.pageViewCampaniasDetallesEnvios().lastPage();
        LoadDetalleEnvioFiltros();
    };

    self.sort = function (data) {
        self.propertyName(data);
        self.orden(self.orden() ? false : true);

        LoadDetalleEnvioFiltros();
    };

    function GetConfiguracionReporte(pagina, cantidad, campoOrden, tipoOrden) {
        var configuracionReporte = {
            Filtros: GetFiltrosReporte(),
            Paginacion: {
                Pagina: pagina,
                Cantidad: cantidad
            },
            Orden: {
                CampoOrden: campoOrden,
                TipoOrden: tipoOrden
            }
        };

        return configuracionReporte;
    };

    function GetFiltrosReporte() {
        var filtrosReporte = {
            Fecha: {
                FechaDesde: self.fechaFiltro().split(" - ")[0],
                FechaHasta: self.fechaFiltro().split(" - ")[1]
            },
            Campanias: []
        };

        $.each(Enumerable.From(self.campaniasList()).Where(function (x) { return x.CampaniaId() != Guid.Empty + '_Campanias' && x.Check(); }).ToArray(), function (i, campania) {
            filtrosReporte.Campanias.push(campania.CampaniaId());
        });

        return filtrosReporte;
    };

    function CampaniasClass() {
        var me = this;

        me.CampaniaId = ko.observable();
        me.Nombre = ko.observable();

        me.Check = ko.observable(false);
    };

    function CampaniasPublicidadesClass() {
        var me = this;

        me.TipoCampaniaId = ko.observable();
        me.TipoCampania = ko.observable();
        me.Nombre = ko.observable();
        me.Validar = ko.observable(false);
    };

    function ViewCampaniaDetalleEnvioClass() {
        var me = this;

        me.FechaEnvio = ko.observable();
        me.Contacto = ko.observable();
        me.Canal = ko.observable();
        me.Respondida = ko.observable();
        me.Chat = ko.observable();
    };

    function ViewCampaniaEmbudoVentaClass() {
        var me = this;

        me.NegocioId = ko.observable();
        me.ComunicacionId = ko.observable();
        me.CampaniaId = ko.observable();
        me.NombreLeadNegocio = ko.observable();
        me.NombreNegocio = ko.observable();
        me.EstadoNegocio = ko.observable();
        me.TipoEstadoNegocio = ko.observable();
        me.FechaAltaNegocio = ko.observable();
        me.FechaHoraInicioComunicacion = ko.observable();
        me.FechaHoraFinComunicacion = ko.observable();
    };
};

$(document).ready(function () {
    masterSectionCampaniasVM = new SectionCampaniasVM();
    ko.applyBindings(masterSectionCampaniasVM, document.getElementById('SectionCampanias'));
});