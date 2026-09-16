function FactorySegmentos() {
    var self = this;

    //GET
    self.ConseguirSegmentos = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Segmentos/ConseguirSegmentos'
        });
    };

    self.ConseguirSegmentosPorId = function (_campaniaSegmentoId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Segmentos/ConseguirSegmentosPorId',
            data: { campaniaSegmentoId: _campaniaSegmentoId }
        });
    };

    //POST
    self.GuardarSegmentos = function (_campaniaSegmento) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Segmentos/GuardarSegmentos',
            data: { campaniaSegmento: _campaniaSegmento }
        });
    };

    self.EliminarSegmentos = function (_campaniaSegmento) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Segmentos/EliminarSegmentos',
            data: { campaniaSegmento: _campaniaSegmento }
        });
    };
};



