function MenuDerechaVM() {
    var self = this;

    //Carga inicial
    self.LoadVM = function () {
    };
};

$(document).ready(function () {
    masterMenuDerechaVM = new MenuDerechaVM();
    ko.applyBindings(masterMenuDerechaVM, document.getElementById('_MenuDerecha'));

    masterMenuDerechaVM.LoadVM();
});