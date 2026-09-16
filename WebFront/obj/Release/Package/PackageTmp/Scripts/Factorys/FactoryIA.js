function FactoryIA() {
    var self = this;

   
    self.ConseguirIntentsShort = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/IA/ConseguirIntentsShort'
        });
    };

    self.ConseguirAccesosRapidosIntenciones = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/IA/ConseguirAccesosRapidosIntenciones'
        });
    };

    self.ConseguirVariables = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/IA/ConseguirVariables'
        });
    };

    self.ConseguirConstantes = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/IA/ConseguirConstantes'
        });
    };
};