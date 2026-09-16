function HeaderVM() {
    var self = this;

    self.buscadorGeneral = ko.observable();

    self.buttonBuscadorGeneral = function () {
        if (self.buscadorGeneral() == undefined || self.buscadorGeneral() == null || self.buscadorGeneral() == "") return false;
        if (self.buscadorGeneral().length >= 3) {
            //Dejo un espacio solo y lo codifico. 
            var buscadorGeneralSinEspacios = self.buscadorGeneral().replace(/\s+/gi, ' ').trim();

            //Armo el hash de la url
            var hash = "#buscadorGeneral/" + jQuery.base64.encode(buscadorGeneralSinEspacios);

            //Redirecciono a BuscadorGeneral 
            //location.href = "/Shared/_BuscadorGeneral" + hash;
        } else {
            Command: toastr["info"]("La busqueda debe contener un mínimo de 3 caracteres.", "Información");
        };
    };

    //self.buttonBloquear = function () {
    //    sessionStorage.setItem("urlAnterior", location.href);
    //    location.href = "/Authentication/Block";
    //};

    self.buttonLogout = function () {
        location.href = "/Authentication/Logout";
    };

    //Carga inicial
    self.LoadVM = function () {
    };
};

$(document).ready(function () {
    masterHeaderVM = new HeaderVM();
    ko.applyBindings(masterHeaderVM, document.getElementById('_Header'));

    masterHeaderVM.LoadVM();
});