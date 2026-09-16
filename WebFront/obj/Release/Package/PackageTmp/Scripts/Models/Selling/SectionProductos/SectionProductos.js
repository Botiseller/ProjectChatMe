function SectionProductosVM() {
    var self = this;

    var catalogosListGlobal = [];

    self.fullCatalogosList = ko.observableArray([]);
    self.fullCatalogosSincronizarList = ko.observableArray([]);
    self.visibleCatalogosSincronizar = ko.observable(false);

    self.productosVinculadosList = ko.observableArray([]);

    self.checkVinculados = ko.observable(false);
    self.checkSincronizados = ko.observable(false);

    $("#txtBuscarProductos").keyup(function (e) {
        self.FiltrarProductos(self.fullCatalogosList, self.productosClasificacionesList, $("#txtBuscarProductos").val().toLowerCase(), self.checkVinculados(), false);
    });

    $("#txtBuscarProductosSincronizar").keyup(function (e) {
        self.FiltrarProductos(self.fullCatalogosSincronizarList, self.productosSincronizarClasificacionesList, $("#txtBuscarProductosSincronizar").val().toLowerCase(), false, self.checkSincronizados());
    });

    //Filtro 
    self.productosClasificacionesList = ko.observableArray([]);
    self.productosSincronizarClasificacionesList = ko.observableArray([]);

    self.buttonProductosCheck = function () {
        self.FiltrarProductos(self.fullCatalogosList, self.productosClasificacionesList, $("#txtBuscarProductos").val().toLowerCase(), self.checkVinculados(), false);
        return true;
    };

    self.buttonProductosSincronizarCheck = function () {
        self.FiltrarProductos(self.fullCatalogosSincronizarList, self.productosSincronizarClasificacionesList, $("#txtBuscarProductosSincronizar").val().toLowerCase(), false, self.checkSincronizados());
        return true;
    };

    self.FiltrarProductos = function (listaCatalogosFull, listaProductosClasificaciones, search, checkVinculados, checkSincronizados) {
        var filtrarPorNombre = function (catalogo) {
            var catalogoFiltrado = new CatalogoClass();
            catalogoFiltrado.CatalogoId(catalogo.CatalogoId());
            catalogoFiltrado.Nombre(catalogo.Nombre());

            var hasVisibleGroup = false;

            catalogo.GrupoProductos().forEach(function (grupoProducto) {
                var grupoProd = new GrupoProductoClass();
                grupoProd.GrupoProductoId(grupoProducto.GrupoProductoId());
                grupoProd.Nombre(grupoProducto.Nombre());

                var filteredProductos = grupoProducto.Productos().filter(function (producto) {
                    return producto.Nombre().toLowerCase().includes(search);
                });

                if (filteredProductos.length > 0) {
                    grupoProd.Productos(filteredProductos);
                    catalogoFiltrado.GrupoProductos.push(grupoProd);
                    hasVisibleGroup = true;
                };
            });

            return hasVisibleGroup ? catalogoFiltrado : null;
        };

        var filtrarPorClasificaciones = function (catalogo) {
            var catalogoFiltrado = new CatalogoClass();

            catalogoFiltrado.CatalogoId(catalogo.CatalogoId());
            catalogoFiltrado.Nombre(catalogo.Nombre());

            var hasVisibleGroup = false;

            catalogo.GrupoProductos().forEach(function (grupoProducto) {
                var grupoProd = new GrupoProductoClass();

                grupoProd.GrupoProductoId(grupoProducto.GrupoProductoId());
                grupoProd.Nombre(grupoProducto.Nombre());

                var filteredProductos = grupoProducto.Productos().filter(function (producto) {
                    return producto.ProductosClasificaciones().some(function (productoClasificacion) {
                        return listaProductosClasificaciones().some(function (clasificacion) {
                            return clasificacion.Check() && productoClasificacion.Nombre().toLowerCase().includes(clasificacion.Nombre().toLowerCase());
                        });
                    });
                });

                if (filteredProductos.length > 0) {
                    grupoProd.Productos(filteredProductos);
                    catalogoFiltrado.GrupoProductos.push(grupoProd);
                    hasVisibleGroup = true;
                };
            });

            return hasVisibleGroup ? catalogoFiltrado : null;
        };

        var filtrarPorVinculados = function (catalogo) {
            var catalogoFiltrado = new CatalogoClass();

            catalogoFiltrado.CatalogoId(catalogo.CatalogoId());
            catalogoFiltrado.Nombre(catalogo.Nombre());

            var hasVisibleGroup = false;

            catalogo.GrupoProductos().forEach(function (grupoProducto) {
                var grupoProd = new GrupoProductoClass();
                grupoProd.GrupoProductoId(grupoProducto.GrupoProductoId());
                grupoProd.Nombre(grupoProducto.Nombre());

                var filteredProductos = grupoProducto.Productos().filter(function (producto) {
                    return producto.ProductoVinculadoPrincipal();
                });

                if (filteredProductos.length > 0) {
                    grupoProd.Productos(filteredProductos);
                    catalogoFiltrado.GrupoProductos.push(grupoProd);
                    hasVisibleGroup = true;
                };
            });

            return hasVisibleGroup ? catalogoFiltrado : null;
        };

        var filtrarPorSincronizados = function (catalogo) {
            var catalogoFiltrado = new CatalogoClass();

            catalogoFiltrado.CatalogoId(catalogo.CatalogoId());
            catalogoFiltrado.Nombre(catalogo.Nombre());

            var hasVisibleGroup = false;

            catalogo.GrupoProductos().forEach(function (grupoProducto) {
                var grupoProd = new GrupoProductoClass();
                grupoProd.GrupoProductoId(grupoProducto.GrupoProductoId());
                grupoProd.Nombre(grupoProducto.Nombre());

                var filteredProductos = grupoProducto.Productos().filter(function (producto) {
                    return producto.ProductoSincronizado();
                });

                if (filteredProductos.length > 0) {
                    grupoProd.Productos(filteredProductos);
                    catalogoFiltrado.GrupoProductos.push(grupoProd);
                    hasVisibleGroup = true;
                };
            });

            return hasVisibleGroup ? catalogoFiltrado : null;
        };

        var catalogosListGeneral = [];

        catalogosListGlobal.forEach(function (catalogo) {
            var catalogoFiltradoPorNombre = filtrarPorNombre(catalogo);
            var catalogoFiltradoPorClasificaciones = filtrarPorClasificaciones(catalogo);

            if (catalogoFiltradoPorNombre && catalogoFiltradoPorClasificaciones) {
                var catalogoFinal = new CatalogoClass();

                catalogoFinal.CatalogoId(catalogo.CatalogoId());
                catalogoFinal.Nombre(catalogo.Nombre());

                var hasVisibleGroup = false;

                catalogo.GrupoProductos().forEach(function (grupoProducto) {
                    var grupoProd = new GrupoProductoClass();

                    grupoProd.GrupoProductoId(grupoProducto.GrupoProductoId());
                    grupoProd.Nombre(grupoProducto.Nombre());

                    var filteredProductos = grupoProducto.Productos().filter(function (producto) {
                        return catalogoFiltradoPorNombre.GrupoProductos().some(function (gp) {
                            return gp.GrupoProductoId() === grupoProducto.GrupoProductoId() && gp.Productos().some(function (p) {
                                return p.ProductoId() === producto.ProductoId();
                            });
                        }) && catalogoFiltradoPorClasificaciones.GrupoProductos().some(function (gp) {
                            return gp.GrupoProductoId() === grupoProducto.GrupoProductoId() && gp.Productos().some(function (p) {
                                return p.ProductoId() === producto.ProductoId();
                            });
                        });
                    });

                    if (filteredProductos.length > 0) {
                        grupoProd.Productos(filteredProductos);
                        catalogoFinal.GrupoProductos.push(grupoProd);
                        hasVisibleGroup = true;
                    };
                });

                if (hasVisibleGroup) {
                    catalogosListGeneral.push(catalogoFinal);
                };
            } else if (catalogoFiltradoPorNombre && !listaProductosClasificaciones().some(x => x.Check())) {
                catalogosListGeneral.push(catalogoFiltradoPorNombre);
            } else if (catalogoFiltradoPorClasificaciones) {
                catalogosListGeneral.push(catalogoFiltradoPorClasificaciones);
            };
        });

        if (checkVinculados) {
            catalogosListGeneral = catalogosListGeneral.map(filtrarPorVinculados).filter(function (catalogo) {
                return catalogo !== null;
            });
        };

        if (checkSincronizados) {
            catalogosListGeneral = catalogosListGeneral.map(filtrarPorSincronizados).filter(function (catalogo) {
                return catalogo !== null;
            });
        };

        listaCatalogosFull(catalogosListGeneral);
        $('.has-tooltip').tooltip();
    };

    function LoadFiltros() {
        self.productosClasificacionesList.removeAll();
        self.productosSincronizarClasificacionesList.removeAll();

        facCrm.ConseguirProductosClasificaciones().done(function (productosClasificacionesList) {
            $.each(productosClasificacionesList, function (i, productoClasificacion) {
                var productoClasificacionClass = CrearProductoClasificacion(productoClasificacion);
                self.productosClasificacionesList.push(productoClasificacionClass);

                var productoSincronizarClasificacionClass = CrearProductoClasificacion(productoClasificacion);
                self.productosSincronizarClasificacionesList.push(productoSincronizarClasificacionClass);
            });
        });

        function CrearProductoClasificacion(productoClasificacion) {
            var productoClasificacionClass = new ProductosClasificacionesClass();

            productoClasificacionClass.ProductoClasificacionId(productoClasificacion.ProductoClasificacionId);
            productoClasificacionClass.Nombre(productoClasificacion.Nombre);

            return productoClasificacionClass;
        };
    };

    function CargarStockProductos() {
        self.fullCatalogosList.removeAll();
        self.fullCatalogosSincronizarList.removeAll();

        return facCrm.ConseguirFullProductosStock().done(function (catalogos) {
            $.each(catalogos, function (i, catalogo) {
                var catalogoClass = new CatalogoClass();

                catalogoClass.CatalogoId(catalogo.CatalogoId);
                catalogoClass.Nombre(catalogo.Nombre);

                var hasGrupoProductos = false;

                $.each(catalogo.GruposProductos, function (ig, grupoProducto) {
                    var grupoProductoClass = new GrupoProductoClass();

                    grupoProductoClass.GrupoProductoId(grupoProducto.GrupoProductoId);
                    grupoProductoClass.Nombre(grupoProducto.Nombre);

                    var hasProductos = false;

                    $.each(grupoProducto.Productos, function (ip, producto) {
                        var productoClass = new ProductoClass();

                        productoClass.ProductoId(producto.ProductoId);
                        productoClass.Codigo(producto.Codigo);
                        productoClass.Nombre(producto.Nombre);
                        productoClass.Descripcion(producto.Descripcion);
                        productoClass.Imagen(producto.Imagen);

                        $.each(producto.ProductosClasificaciones, function (pc, productoClasificacion) {
                            var productoClasificacionClass = new ProductosClasificacionesClass();

                            productoClasificacionClass.Nombre(productoClasificacion.Nombre);

                            productoClass.ProductosClasificaciones.push(productoClasificacionClass);
                        });

                        grupoProductoClass.Productos.push(productoClass);
                        hasProductos = true;
                    });

                    if (hasProductos) {
                        catalogoClass.GrupoProductos.push(grupoProductoClass);
                        hasGrupoProductos = true;
                    };
                });

                if (hasGrupoProductos) {
                    self.fullCatalogosList.push(catalogoClass);
                    self.fullCatalogosSincronizarList.push(catalogoClass);
                };
            });

            catalogosListGlobal = self.fullCatalogosList();
        });
    };

    self.LoadVM = function () {
        LoadFiltros();

        $('#expand-all-btn').on('click', function () {
            $('#main-accordion .collapse').collapse('show');
        });

        $('#collapse-all-btn').on('click', function () {
            $('#main-accordion .collapse').collapse('hide');
        });

        $('#expand-all-btn-sincronizar').on('click', function () {
            $('#main-accordion-sincronizar .collapse').collapse('show');
        });

        $('#collapse-all-btn-sincronizar').on('click', function () {
            $('#main-accordion-sincronizar .collapse').collapse('hide');
        });

        return $.when(CargarStockProductos());
    };

    self.EditVM = function (selling) {
        $.each(selling.SellingProductos.ProductosVinculados, function (i, productoVinculadoItem) {
            var productoVinculadoClass = new ProductosVinculadosClass();

            productoVinculadoClass.ProductoPrincipalId(productoVinculadoItem.ProductoPrincipalId);
            productoVinculadoClass.NombreProductoPrincipal(productoVinculadoItem.NombreProductoPrincipal);
            productoVinculadoClass.ImagenProductoPrincipal(productoVinculadoItem.ImagenProductoPrincipal);

            productoVinculadoClass.ProductoSincronizadoId(productoVinculadoItem.ProductoSincronizadoId);
            productoVinculadoClass.NombreProductoSincronizado(productoVinculadoItem.NombreProductoSincronizado);
            productoVinculadoClass.ImagenProductoSincronizado(productoVinculadoItem.ImagenProductoSincronizado);

            self.productosVinculadosList.push(productoVinculadoClass);
        });

        var productosVinculadosPrincipalesDistincList = Enumerable.From(self.productosVinculadosList()).Distinct(x => x.ProductoPrincipalId()).ToArray();

        ko.utils.arrayForEach(catalogosListGlobal, function (catalogo) {
            ko.utils.arrayForEach(catalogo.GrupoProductos(), function (grupo) {
                ko.utils.arrayForEach(grupo.Productos(), function (producto) {
                    var productoVinculadoPrincipal = ko.utils.arrayFirst(productosVinculadosPrincipalesDistincList, function (productoVinculadoPrincipal) {
                        return productoVinculadoPrincipal.ProductoPrincipalId() == producto.ProductoId();
                    });

                    if (productoVinculadoPrincipal) {
                        producto.ProductoVinculadoPrincipal(true);
                    };
                });
            });
        });
    };

    function CatalogoClass() {
        var me = this;

        me.CatalogoId = ko.observable();
        me.Nombre = ko.observable();

        me.GrupoProductos = ko.observableArray();
    };

    function GrupoProductoClass() {
        var me = this;

        me.GrupoProductoId = ko.observable();
        me.Nombre = ko.observable();

        me.Productos = ko.observableArray();
    };

    function ProductoClass() {
        var me = this;

        me.ProductoId = ko.observable();
        me.Codigo = ko.observable();
        me.Descripcion = ko.observable();
        me.Nombre = ko.observable();
        me.Imagen = ko.observable();

        me.ProductosClasificaciones = ko.observableArray();

        me.CheckedRadioProductos = ko.observable();

        me.ProductoSincronizado = ko.observable(false);
        me.ProductoVinculadoPrincipal = ko.observable(false);

        me.ButtonRadio = function () {
            ko.utils.arrayFirst(catalogosListGlobal, function (catalogo) {
                ko.utils.arrayFirst(catalogo.GrupoProductos(), function (grupo) {
                    ko.utils.arrayFirst(grupo.Productos(), function (producto) {
                        producto.CheckedRadioProductos(undefined);
                    });
                });
            });

            me.CheckedRadioProductos(me.ProductoId());

            ko.utils.arrayFirst(catalogosListGlobal, function (catalogo) {
                ko.utils.arrayFirst(catalogo.GrupoProductos(), function (grupo) {
                    ko.utils.arrayFirst(grupo.Productos(), function (producto) {
                        producto.ProductoSincronizado(false);
                    });
                });
            });

            var productosVinculadosList = ko.utils.arrayFilter(self.productosVinculadosList(), function (productoVinculado) {
                return productoVinculado.ProductoPrincipalId() == me.CheckedRadioProductos();
            });

            ko.utils.arrayForEach(catalogosListGlobal, function (catalogo) {
                ko.utils.arrayForEach(catalogo.GrupoProductos(), function (grupo) {
                    ko.utils.arrayForEach(grupo.Productos(), function (producto) {
                        // Buscar en productosVinculadosList el ProductoSincronizadoId que coincida con ProductoId del producto actual
                        var productoVinculado = ko.utils.arrayFirst(productosVinculadosList, function (productoVinculado) {
                            return productoVinculado.ProductoSincronizadoId() == producto.ProductoId();
                        });

                        // Si se encuentra una coincidencia, establecer ProductoSincronizado(true)
                        if (productoVinculado) {
                            producto.ProductoSincronizado(true);
                        };
                    });
                });
            });


            if (self.checkSincronizados()) {
                self.buttonProductosSincronizarCheck();
                $('#CatalogoSincronizar [data-action="expand-all"]').click()
            }

            self.visibleCatalogosSincronizar(true);
            return true;
        };

        me.ButtonSincronizar = function () {
            var productoPrincipal = null;

            ko.utils.arrayForEach(catalogosListGlobal, function (catalogo) {
                ko.utils.arrayForEach(catalogo.GrupoProductos(), function (grupo) {
                    ko.utils.arrayForEach(grupo.Productos(), function (producto) {
                        if (producto.CheckedRadioProductos() != undefined) {
                            productoPrincipal = producto;
                            return false; // Salir del bucle interno
                        };
                    });
                    if (productoPrincipal) return false; // Salir del bucle de grupos si el producto ya fue encontrado
                });
                if (productoPrincipal) return false; // Salir del bucle de catálogos si el producto ya fue encontrado
            });

            var productoVinculadoClass = new ProductosVinculadosClass();

            productoVinculadoClass.ProductoPrincipalId(productoPrincipal.ProductoId());
            productoVinculadoClass.NombreProductoPrincipal(productoPrincipal.Nombre());
            productoVinculadoClass.ImagenProductoPrincipal(productoPrincipal.Imagen());

            productoVinculadoClass.ProductoSincronizadoId(me.ProductoId());
            productoVinculadoClass.NombreProductoSincronizado(me.Nombre());
            productoVinculadoClass.ImagenProductoSincronizado(me.Imagen());

            self.productosVinculadosList.push(productoVinculadoClass);

            me.ProductoSincronizado(true);
            productoPrincipal.ProductoVinculadoPrincipal(true);
        };

        me.ButtonDesincronizar = function () {
            var productoPrincipal = null;

            ko.utils.arrayForEach(catalogosListGlobal, function (catalogo) {
                ko.utils.arrayForEach(catalogo.GrupoProductos(), function (grupo) {
                    ko.utils.arrayForEach(grupo.Productos(), function (producto) {
                        if (producto.CheckedRadioProductos() != undefined) {
                            productoPrincipal = producto;
                            return false; // Salir del bucle interno
                        };
                    });
                    if (productoPrincipal) return false; // Salir del bucle de grupos si el producto ya fue encontrado
                });
                if (productoPrincipal) return false; // Salir del bucle de catálogos si el producto ya fue encontrado
            });

            // Encontrar el objeto a eliminar
            var productoVinculadoParaEliminar = ko.utils.arrayFirst(self.productosVinculadosList(), function (productoVinculado) {
                return productoVinculado.ProductoPrincipalId() == productoPrincipal.ProductoId() && productoVinculado.ProductoSincronizadoId() == me.ProductoId();
            });

            // Eliminar el objeto de la lista si se encuentra
            if (productoVinculadoParaEliminar) {
                self.productosVinculadosList.remove(productoVinculadoParaEliminar);
            };

            me.ProductoSincronizado(false);

            var productoVinculadoPrincipal = Enumerable.From(self.productosVinculadosList()).Where(x => x.ProductoPrincipalId() == productoPrincipal.ProductoId()).FirstOrDefault();

            if (!productoVinculadoPrincipal) {
                productoPrincipal.ProductoVinculadoPrincipal(false);

            };
        };
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

    function ProductosClasificacionesClass() {
        var me = this;

        me.ProductoClasificacionId = ko.observable();
        me.Nombre = ko.observable();

        me.Check = ko.observable(false);
    };



    self.GetProductos = function () {
        return GetProductos();
    };

    function GetProductos() {
        var producto = {
            ProductosVinculados: []
        };

        $.each(self.productosVinculadosList(), function (i, productoVinculadoItem) {
            var productoVinculado = {
                ProductoPrincipalId: productoVinculadoItem.ProductoPrincipalId(),
                NombreProductoPrincipal: productoVinculadoItem.NombreProductoPrincipal(),
                ImagenProductoPrincipal: productoVinculadoItem.ImagenProductoPrincipal(),
                ProductoSincronizadoId: productoVinculadoItem.ProductoSincronizadoId(),
                NombreProductoSincronizado: productoVinculadoItem.NombreProductoSincronizado(),
                ImagenProductoSincronizado: productoVinculadoItem.ImagenProductoSincronizado()
            };

            producto.ProductosVinculados.push(productoVinculado);
        });

        return producto;
    };
};

$(document).ready(function () {
    masterSectionProductosVM = new SectionProductosVM();
    ko.applyBindings(masterSectionProductosVM, document.getElementById('SectionProductos'));
});