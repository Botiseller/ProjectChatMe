function FactorySelling() {
    var self = this;

    //GET
    self.ConseguirSellingTodos = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Selling/ConseguirSellingTodos'
        });
    };

    self.ConseguirSelling = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Selling/ConseguirSelling'
        });
    };

    self.ConseguirSellingPorId = function (_sellingId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Selling/ConseguirSellingPorId',
            data: { sellingId: _sellingId }
        });
    };

    //POST
    self.GuardarSelling = function (_sellingDto) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Selling/GuardarSelling',
            data: { sellingDto: _sellingDto }
        });
    };

    self.EliminarSelling = function (_sellingDto) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Selling/EliminarSelling',
            data: { sellingDto: _sellingDto }
        });
    };

    self.GuardarHabilitarDeshabilitar = function (_sellingDto) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Selling/GuardarHabilitarDeshabilitar',
            data: { sellingDto: _sellingDto }
        });
    };

    self.ConseguirReporteSelling = function (_filtroReporte) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Selling/ConseguirReporteSelling',
            data: { filtroReporte: _filtroReporte }
        });
    };
};



