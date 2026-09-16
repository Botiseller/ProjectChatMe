function FactoryCampanias() {
    var self = this;

    //GET
    self.ConseguirCampaniasPublicidades = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Campanias/ConseguirCampaniasPublicidades'
        });
    };

    self.ConseguirCampanias = function (_filtros) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirCampanias',
            data: { filtros: _filtros }
        });
    };

    self.ConseguirCampaniasPorId = function (_campaniaId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Campanias/ConseguirCampaniasPorId',
            data: { campaniaId: _campaniaId }
        });
    };

    self.ConseguirCampaniasActivas = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Campanias/ConseguirCampaniasActivas'
        });
    };

    //POST
    self.GuardarCampanias = function (_campaniaRequest) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/GuardarCampanias',
            data: { campaniaRequest: _campaniaRequest }
        });
    };

    self.GuardarHabilitarDeshabilitar = function (_campania) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/GuardarHabilitarDeshabilitar',
            data: { campania: _campania }
        });
    };

    self.ConseguirCampaniasPublicidadesByFiltros = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirCampaniasPublicidadesByFiltros',
            data: { filtroReporte: _filtroReporte }
        });
    };

    self.ConseguirInicioSesionByFiltros = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirInicioSesionByFiltros',
            data: { filtroReporte: _filtroReporte }
        });
    };

    self.ConseguirCantidadUsuariosByFiltros = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirCantidadUsuariosByFiltros',
            data: { filtroReporte: _filtroReporte }
        });
    };

    self.ConseguirNoEnviadasByFiltros = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirNoEnviadasByFiltros',
            data: { filtroReporte: _filtroReporte }
        });
    };

    self.ConseguirViewCampaniasDetallesEnvios = function (_configuracionReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirViewCampaniasDetallesEnvios',
            data: { configuracionReporte: _configuracionReporte }
        });
    };

    self.ConseguirViewCampaniasEmbudoVentas = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Campanias/ConseguirViewCampaniasEmbudoVentas',
            data: { filtroReporte: _filtroReporte }
        });
    };
};



