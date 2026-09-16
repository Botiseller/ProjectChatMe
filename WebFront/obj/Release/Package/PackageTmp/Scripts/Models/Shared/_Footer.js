function FooterVM() {
    var self = this;

    //Carga inicial
    self.LoadVM = function () {
    };
};

$(document).ready(function () {
    masterFooterVM = new FooterVM();
    ko.applyBindings(masterFooterVM, document.getElementById('_Footer'));

    masterFooterVM.LoadVM();
});