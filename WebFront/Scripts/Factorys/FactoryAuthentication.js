function FactoryAuthentication() {
    var self = this;

    //Los tres pasos del login por SMS. Las rutas las resuelve la ruta Default de RouteConfig
    //(controller/action), igual que el resto de las acciones de Authentication.
    self.RequestCode = function (obj) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Authentication/RequestCode',
            data: obj
        });
    };

    self.VerifyCode = function (obj) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Authentication/VerifyCode',
            data: obj
        });
    };

    self.CompleteProfile = function (obj) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Authentication/CompleteProfile',
            data: obj
        });
    };

};
