function FactoryArchivos() {
    var self = this;

    //GET
    self.ConseguirArchivoPorId = function (_archivoId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Archivos/ConseguirArchivoPorId',
            data: { archivoId: _archivoId }
        });
    };  

    self.Ping = function () {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            loader: false,
            url: '/Authentication/Ping'
        });
    };
};



