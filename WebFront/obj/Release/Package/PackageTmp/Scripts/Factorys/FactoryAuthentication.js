function FactoryAuthentication() {
    var self = this;

    self.AutenticarUsuario = function (_usuarioId, _empresa) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            loader: true,
            url: '/Authentication/AutenticarUsuario',
            data: { usuarioId: _usuarioId, empresa: _empresa }
        });
    };

    //POST
    self.Unlock = function (_clave) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            loader: true,
            url: '/Authentication/Unlock',
            data: { clave: _clave }
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