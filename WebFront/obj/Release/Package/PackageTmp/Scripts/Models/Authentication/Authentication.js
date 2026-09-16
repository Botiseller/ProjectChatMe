function LoginVM() {
    var self = this;

    var facAuthentication = new FactoryAuthentication();

    self.LoadCampaniasVM = function (usuarioId, empresa, view) {
        facAuthentication.AutenticarUsuario(usuarioId, empresa).done(function (result) {
            
            var v = "/Inicio/Inicio";
            if (view != null) {
                if (view.toUpperCase() == 'Segments') {
                    v = "/Segmentos/SegmentosFrame";
                }

                if (view.toUpperCase() == 'Campaign') {
                   v = "/Campanias/CampaniasFrame";
                }

                if (view.toUpperCase() == 'PIXEL') {
                    v = "/authentication/Pixel";
                }
            }
            window.location.href = v;
        });
    };
};

//Funcion que se llama del Sammy, entra primero.
function PanelAuthenticationCampaniasSammy(usuarioId, empresa, view) {
    var masterLoginVM = new LoginVM();
    ko.applyBindings(masterLoginVM, document.getElementById('Login'));

    masterLoginVM.LoadCampaniasVM(usuarioId, empresa, view);

   

};
