function SectionSellingVM() {
    var self = this;

    self.visibleLoadingSelling = ko.observable(true);

    self.generalSellingActivos = ko.observable(0);
    self.generalCrossSelling = ko.observable(0);
    self.generalUpSelling = ko.observable(0);
    self.generalMensajesEnviados = ko.observable(0);
    self.generalProductosConectados = ko.observable(0);

    self.carritosRecuperadosMesajesRespondidos = ko.observable(0);
    self.carritosRecuperados = ko.observable(0);
    self.carritosRecuperadosFacturacionList = ko.observableArray([]);
    self.carritosRecuperadosFacturacion = ko.observable(0);
    self.carritosRecuperadosPerformance = ko.observable(0);

    self.carritosCerradosVendidos = ko.observable(0);
    self.carritosCerradosFacturacionList = ko.observableArray([]);
    self.carritosCerradosFacturacion = ko.observable(0);
    self.carritosCerradosPerformance = ko.observable(0);

    self.monedasListRecuperados = ko.observableArray([]);
    self.monedaSeleccionadaRecuperados = ko.observable();
    self.totalesPorMonedaRecuperados = ko.observableArray([]);

    self.monedasListProductosFacturados = ko.observableArray([]);
    self.monedaSeleccionadaProductosFacturados = ko.observable();
    self.totalesPorMonedaProductosFacturados = ko.observableArray([]);

    self.monedasListSellingFacturados = ko.observableArray([]);
    self.monedaSeleccionadaSellingFacturados = ko.observable();
    self.totalesPorMonedaSellingFacturados = ko.observableArray([]);

    self.embudoVentasList = ko.observableArray([]);

    self.sellingList = ko.observableArray([]);
    self.fechaFiltro = ko.observable();

    self.buttonCheck = function (sellingId) {
        if (sellingId == Guid.Empty + "_Selling") {
            Enumerable.From(self.sellingList()).Where(function (x) { return x.SellingId() != Guid.Empty + "_Selling"; }).Select(function (x) { return x.Check(false); }).ToArray();
        } else {
            if (!Enumerable.From(self.sellingList()).Where(function (x) { return x.SellingId() != Guid.Empty + "_Selling" && x.Check(); }).ToArray().length) {
                Enumerable.From(self.sellingList()).Where(function (x) { return x.SellingId() == Guid.Empty + "_Selling"; }).Select(function (x) { return x.Check(true); }).FirstOrDefault();
            } else {
                Enumerable.From(self.sellingList()).Where(function (x) { return x.SellingId() == Guid.Empty + "_Selling"; }).Select(function (x) { return x.Check(false); }).FirstOrDefault();
            };
        };

        LoadGeneral();
        return true
    };

    self.changeFechaFiltro = function () {
        LoadGeneral();
    };

    self.LoadVM = function () {
        self.visibleLoadingSelling(true);

        LoadFiltros();

        $(document).ajaxStop(function () {
            if ($('#SectionSellingTab').hasClass('active')) {
                self.visibleLoadingSelling(false);
            };
        });
    };

    function LoadFiltros() {
        $('#txtFechaFiltroSelling').daterangepicker({
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

        facSelling.ConseguirSelling().done(function (sellingList) {
            self.sellingList.removeAll();

            $.each(sellingList, function (i, selling) {
                var sellingClass = new SellingClass();

                sellingClass.SellingId(selling.SellingId);
                sellingClass.Nombre(selling.Nombre);

                if (selling.Habilitado) {
                    sellingClass.Check(true);
                };

                self.sellingList.push(sellingClass);
            });

            var sellingClass = new SellingClass();

            sellingClass.SellingId(Guid.Empty + "_Selling");
            sellingClass.Nombre("Todas");

            if (self.sellingList().filter(x => x.Check()).length) {
                sellingClass.Check(false);
            } else {
                sellingClass.Check(true);
            };

            self.sellingList.unshift(sellingClass);
        });
    };

    function LoadGeneral() {
        self.visibleLoadingSelling(true);

        self.monedasListProductosFacturados.removeAll();
        self.totalesPorMonedaProductosFacturados.removeAll();

        self.monedasListSellingFacturados.removeAll();
        self.totalesPorMonedaSellingFacturados.removeAll();

        self.embudoVentasList.removeAll();

        $('.infoPopover').popover('dispose');

        facSelling.ConseguirReporteSelling(GetFiltrosInformes()).done(function (report) {
            self.generalSellingActivos(report.SellingsActivos);
            self.generalCrossSelling(report.CrossSelling);
            self.generalUpSelling(report.UpSelling);
            self.generalMensajesEnviados(report.MensajesEnviados);
            self.generalProductosConectados(report.ProductosConectados);



            self.carritosRecuperadosMesajesRespondidos(report.MensajesRespondidos);
            self.carritosRecuperados(report.CarritosRecuperados);
            self.carritosRecuperadosFacturacionList(report.FacturacionRecuperada);
            if (report.FacturacionRecuperada.length) {
                report.FacturacionRecuperada = report.FacturacionRecuperada.sort(function (a, b) {
                    return b.ValorTotal - a.ValorTotal;
                });

                var popoverContent = report.FacturacionRecuperada.map(function (x) {
                    return x.Moneda.Simbolo + "" + ConvertirNumeroMiles(x.ValorTotal);
                }).join('\n');

                self.carritosRecuperadosFacturacion(report.FacturacionRecuperada[0].Moneda.Simbolo + "" + ConvertirNumeroMiles(report.FacturacionRecuperada[0].ValorTotal));
                $('#infoCarritosRecuperadosFacturacion').popover({
                    content: popoverContent,
                    placement: 'bottom'
                });
            } else {
                self.carritosRecuperadosFacturacion(0);
            };
            self.carritosRecuperadosPerformance(report.PerformanceTotalRecuperados);



            self.carritosCerradosVendidos(report.CarritosVendidos);
            self.carritosCerradosFacturacionList(report.Facturacion);
            if (report.Facturacion.length) {
                report.Facturacion = report.Facturacion.sort(function (a, b) {
                    return b.ValorTotal - a.ValorTotal;
                });

                var popoverContent = report.Facturacion.map(function (x) {
                    return x.Moneda.Simbolo + "" + ConvertirNumeroMiles(x.ValorTotal);
                }).join('\n');

                self.carritosCerradosFacturacion(report.Facturacion[0].Moneda.Simbolo + "" + ConvertirNumeroMiles(report.Facturacion[0].ValorTotal));
                $('#infoCarritosCerradosFacturacion').popover({
                    content: popoverContent,
                    placement: 'bottom'
                });
            } else {
                self.carritosCerradosFacturacion(0);
            };
            self.carritosCerradosPerformance(report.PerformanceRecuepradosCerrados);

            CanvasChartGraficosProductos(report);
            CanvasChartGraficosSelling(report);

            $.each(report.EmbudoVentas, function (i, embudoVenta) {
                var embudoVentaClass = new EmbudoVentasClass();

                embudoVentaClass.EtapaId(embudoVenta.Etapa.EtapaId);
                embudoVentaClass.Nombre(embudoVenta.Etapa.Nombre);
                embudoVentaClass.Cantidad(embudoVenta.Cantidad);

                self.embudoVentasList.push(embudoVentaClass);
            });
        });
    };


    function CanvasChartGraficosProductos(report) {
        // Grafico barras Cantidad Productos
        // Ordenar los productos por cantidad de mayor a menor
        var productosOrdenados = report.Productos.sort(function (a, b) {
            return b.Cantidad - a.Cantidad;
        });

        // Crear nuevos arrays para las etiquetas y las cantidades
        var dataNombre = productosOrdenados.slice(0, 9).map(function (item) {
            return item.Producto.Nombre;
        });

        var dataCantidad = productosOrdenados.slice(0, 9).map(function (item) {
            return item.Cantidad;
        });

        // Configuración del gráfico
        var ctxBarrasCantidadProductos = document.getElementById('canvasChartCantidadProductos').getContext('2d');

        var data = {
            labels: dataNombre,
            datasets: [
                {
                    label: 'Cantidad',
                    data: dataCantidad,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        var chartInstance = Chart.getChart(ctxBarrasCantidadProductos);

        if (chartInstance) {
            chartInstance.destroy();
        }

        var myChart = new Chart(ctxBarrasCantidadProductos, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });




        // Grafico torta  Productos Facturados
        // Construir la lista de monedas y asociarlas a los productos
        $.each(report.Productos, function (i, producto) {
            $.each(producto.Total, function (i, total) {
                if (Enumerable.From(self.monedasListProductosFacturados()).Where(function (x) { return x.MonedaId() == total.Moneda.MonedaId.toLocaleLowerCase() }).FirstOrDefault() == null) {
                    var monedaClass = new MonedasClass();

                    monedaClass.MonedaId(total.Moneda.MonedaId.toLocaleLowerCase());
                    monedaClass.Nombre(total.Moneda.Nombre);
                    monedaClass.NombreDescripcion("(" + total.Moneda.Simbolo.trim() + ") " + total.Moneda.Nombre);
                    monedaClass.Simbolo(total.Moneda.Simbolo);

                    self.monedasListProductosFacturados.push(monedaClass);
                };
            });
        });

        // Seleccionar la primera moneda por defecto si no hay ninguna seleccionada
        self.monedaSeleccionadaProductosFacturados(self.monedasListProductosFacturados().length ? self.monedasListProductosFacturados()[0].MonedaId() : null);
        self.totalesPorMonedaProductosFacturados(report.Productos);

        // Filtrar y ordenar productos según la moneda seleccionada
        self.seleccionarMonedaProductosFacturados();
    };

    self.seleccionarMonedaProductosFacturados = function () {
        if (self.monedaSeleccionadaProductosFacturados() == null) { return false; }

        // Filtrar productos por la moneda seleccionada
        var filteredTotalPorMonedaProductosFacturados = self.totalesPorMonedaProductosFacturados().map(function (producto) {
            var total = producto.Total.find(function (totalItem) {
                return totalItem.Moneda.MonedaId.toLocaleLowerCase() === self.monedaSeleccionadaProductosFacturados().toLocaleLowerCase();
            });

            return {
                Nombre: producto.Producto.Nombre,
                ValorTotal: total ? total.ValorTotal : 0
            };
        });

        // Ordenar productos por ValorTotal de mayor a menor
        filteredTotalPorMonedaProductosFacturados.sort(function (a, b) {
            return b.ValorTotal - a.ValorTotal;
        });

        // Separar los primeros 9 productos
        var topProductos = filteredTotalPorMonedaProductosFacturados.slice(0, 9);

        // Sumar el ValorTotal del resto de los productos y agruparlos como "Otros"
        if (filteredTotalPorMonedaProductosFacturados.length > 9) {
            var otrosValorTotal = filteredTotalPorMonedaProductosFacturados.slice(9).reduce(function (acc, item) {
                return acc + item.ValorTotal;
            }, 0);

            topProductos.push({
                Nombre: 'Otros',
                ValorTotal: otrosValorTotal
            });
        };

        // Preparar los datos para el gráfico de torta
        var dataNombre = topProductos.map(function (item) { return item.Nombre; });
        var dataValorTotal = topProductos.map(function (item) { return item.ValorTotal; });

        var ctxTortaProductosFacturadosS = document.getElementById('canvasChartProductosFacturadosS').getContext('2d');

        var dataTorta = {
            labels: dataNombre,
            datasets: [{
                data: dataValorTotal,
                backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(201, 203, 207, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 206, 86, 0.7)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(201, 203, 207, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        };

        // Destruir el gráfico anterior si existe
        var chartInstance = Chart.getChart(ctxTortaProductosFacturadosS);
        if (chartInstance) {
            chartInstance.destroy();
        };

        // Crear el nuevo gráfico
        var myChart = new Chart(ctxTortaProductosFacturadosS, {
            type: 'pie',
            data: dataTorta,
            options: {
                maintainAspectRatio: false,
                responsive: true,
            }
        });

        return true;
    };

    self.selectedMonedaSimboloProductosFacturados = ko.computed(function () {
        var selectedMonedaroductosFacturados = ko.utils.arrayFirst(self.monedasListProductosFacturados(), function (moneda) {
            return moneda.MonedaId() === self.monedaSeleccionadaroductosFacturados();
        });

        return selectedMonedaroductosFacturados ? "(" + selectedMonedaroductosFacturados.Simbolo() + ")" : '';
    });




    function CanvasChartGraficosSelling(report) {
        // Grafico barras Cantidad Selling
        // Ordenar los sellings por cantidad de mayor a menor
        var sellingOrdenados = report.Selling.sort(function (a, b) {
            return b.Cantidad - a.Cantidad;
        });

        // Crear nuevos arrays para las etiquetas y las cantidades
        var dataNombre = sellingOrdenados.slice(0, 9).map(function (item) {
            return item.Selling.Nombre;
        });

        var dataCantidad = sellingOrdenados.slice(0, 9).map(function (item) {
            return item.Cantidad;
        });

        // Configuración del gráfico
        var ctxBarrasCantidadSelling = document.getElementById('canvasChartCantidadSelling').getContext('2d');

        var data = {
            labels: dataNombre,
            datasets: [
                {
                    label: 'Cantidad',
                    data: dataCantidad,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        var chartInstance = Chart.getChart(ctxBarrasCantidadSelling);

        if (chartInstance) {
            chartInstance.destroy();
        };

        var myChart = new Chart(ctxBarrasCantidadSelling, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });




        // Grafico torta  Selling Facturados
        // Construir la lista de monedas y asociarlas a los selling
        $.each(report.Selling, function (i, selling) {
            $.each(selling.Total, function (i, total) {
                if (Enumerable.From(self.monedasListSellingFacturados()).Where(function (x) { return x.MonedaId() == total.Moneda.MonedaId.toLocaleLowerCase() }).FirstOrDefault() == null) {
                    var monedaClass = new MonedasClass();

                    monedaClass.MonedaId(total.Moneda.MonedaId.toLocaleLowerCase());
                    monedaClass.Nombre(total.Moneda.Nombre);
                    monedaClass.NombreDescripcion("(" + total.Moneda.Simbolo.trim() + ") " + total.Moneda.Nombre);
                    monedaClass.Simbolo(total.Moneda.Simbolo);

                    self.monedasListSellingFacturados.push(monedaClass);
                };
            });
        });

        // Seleccionar la primera moneda por defecto si no hay ninguna seleccionada
        self.monedaSeleccionadaSellingFacturados(self.monedasListSellingFacturados().length ? self.monedasListSellingFacturados()[0].MonedaId() : null);
        self.totalesPorMonedaSellingFacturados(report.Selling);

        // Filtrar y ordenar selling según la moneda seleccionada
        self.seleccionarMonedaSellingFacturados();
    };

    self.seleccionarMonedaSellingFacturados = function () {
        if (self.monedaSeleccionadaSellingFacturados() == null) { return false; }

        // Filtrar selling por la moneda seleccionada
        var filteredTotalPorMonedaSellingFacturados = self.totalesPorMonedaSellingFacturados().map(function (selling) {
            var total = selling.Total.find(function (totalItem) {
                return totalItem.Moneda.MonedaId.toLocaleLowerCase() === self.monedaSeleccionadaSellingFacturados().toLocaleLowerCase();
            });

            return {
                Nombre: selling.Selling.Nombre,
                ValorTotal: total ? total.ValorTotal : 0
            };
        });

        // Ordenar selling por ValorTotal de mayor a menor
        filteredTotalPorMonedaSellingFacturados.sort(function (a, b) {
            return b.ValorTotal - a.ValorTotal;
        });

        // Separar los primeros 9 selling
        var topSelling = filteredTotalPorMonedaSellingFacturados.slice(0, 9);

        // Sumar el ValorTotal del resto de los selling y agruparlos como "Otros"
        if (filteredTotalPorMonedaSellingFacturados.length > 9) {
            var otrosValorTotal = filteredTotalPorMonedaSellingFacturados.slice(9).reduce(function (acc, item) {
                return acc + item.ValorTotal;
            }, 0);

            topSelling.push({
                Nombre: 'Otros',
                ValorTotal: otrosValorTotal
            });
        };

        // Preparar los datos para el gráfico de torta
        var dataNombre = topSelling.map(function (item) { return item.Nombre; });
        var dataValorTotal = topSelling.map(function (item) { return item.ValorTotal; });

        var ctxTortaSellingFacturadosS = document.getElementById('canvasChartSellingFacturadosS').getContext('2d');

        var dataTorta = {
            labels: dataNombre,
            datasets: [{
                data: dataValorTotal,
                backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(201, 203, 207, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 206, 86, 0.7)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(201, 203, 207, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        };

        // Destruir el gráfico anterior si existe
        var chartInstance = Chart.getChart(ctxTortaSellingFacturadosS);
        if (chartInstance) {
            chartInstance.destroy();
        };

        // Crear el nuevo gráfico
        var myChart = new Chart(ctxTortaSellingFacturadosS, {
            type: 'pie',
            data: dataTorta,
            options: {
                maintainAspectRatio: false,
                responsive: true,
            }
        });

        return true;
    };

    self.selectedMonedaSimboloSellingFacturados = ko.computed(function () {
        var selectedMonedaSellingFacturados = ko.utils.arrayFirst(self.monedasListSellingFacturados(), function (moneda) {
            return moneda.MonedaId() === self.monedaSeleccionadaSellingFacturados();
        });

        return selectedMonedaSellingFacturados ? "(" + selectedMonedaSellingFacturados.Simbolo() + ")" : '';
    });



    function GetFiltrosInformes() {
        var filtrosInformes = {
            Fecha: {
                FechaDesde: self.fechaFiltro().split(" - ")[0],
                FechaHasta: self.fechaFiltro().split(" - ")[1]
            },
            Sellings: []
        };

        $.each(Enumerable.From(self.sellingList()).Where(function (x) { return x.SellingId() != Guid.Empty + '_Selling' && x.Check(); }).ToArray(), function (i, selling) {
            filtrosInformes.Sellings.push(selling.SellingId());
        });

        return filtrosInformes;
    };





    function SellingClass() {
        var me = this;

        me.SellingId = ko.observable();
        me.Nombre = ko.observable();

        me.Check = ko.observable(false);
    };

    function MonedasClass() {
        var me = this;

        me.MonedaId = ko.observable();
        me.Simbolo = ko.observable();
        me.Nombre = ko.observable();
        me.NombreDescripcion = ko.observable();
    };

    var width = 0;
    var diferenciaCantidad = 0;

    function EmbudoVentasClass() {
        var me = this;

        me.EtapaId = ko.observable(null);
        me.Nombre = ko.observable("");
        me.Orden = ko.observable();

        me.Cantidad = ko.observable(0);

        me.CalculaWidth = function (index, embudoVentasList) {
            diferenciaCantidad = 0;

            if (index === 0) {
                width = 400;
            } else {
                diferenciaCantidad = embudoVentasList[index - 1].Cantidad() - embudoVentasList[index].Cantidad();
            };

            var borderSize = Math.abs(diferenciaCantidad) * 2;

            width -= (borderSize * 2);

            return width + "px";
        };

        me.CalculaHeight = function (index, embudoVentasList) {
            switch (embudoVentasList.length) {
                case 1:
                    return '245px';
                case 2:
                    return '120px';
                case 3:
                    return '80px';
                default:
                    return '60px';
            };
        };

        me.CalculaBorder = function (index, embudoVentasList) {
            diferenciaCantidad = 0;

            if (index == embudoVentasList.length - 1) {
                //Ultimo Item, armo el pico del final.
                diferenciaCantidad = embudoVentasList[index].Cantidad();
                return (width / 2) + 'px solid transparent';
            } else {
                diferenciaCantidad = embudoVentasList[index].Cantidad() - embudoVentasList[index + 1].Cantidad();
            };

            if (diferenciaCantidad === 0) {
                return 'none';
            };

            var borderSize = Math.abs(diferenciaCantidad) * 2;

            return borderSize + 'px solid transparent';
        };

        me.CalculaBorderTop = function (index, embudoVentasList) {
            var border = ''
            switch (embudoVentasList.length) {
                case 1:
                    border = '245px solid ';
                    break;
                case 2:
                    border = '120px solid ';
                    break;
                case 3:
                    border = '80px solid ';
                    break;
                default:
                    border = '60px solid ';
                    break;
            };
            border += me.Color(index);

            return border;
        };

        me.Color = function (index) {
            switch (index) {
                case 0:
                    return 'rgb(156, 226, 185)';
                    break;
                case 1:
                    return 'rgb(152, 202, 236)';
                    break;
                case 2:
                    return 'rgb(124, 208, 174)';
                    break;
                case 3:
                    return 'rgb(176, 219, 112)';
                    break;
            };
        }
    };
};

$(document).ready(function () {
    masterSectionSellingVM = new SectionSellingVM();
    ko.applyBindings(masterSectionSellingVM, document.getElementById('SectionSelling'));
});