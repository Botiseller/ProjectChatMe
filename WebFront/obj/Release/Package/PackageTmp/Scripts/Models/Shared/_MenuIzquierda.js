function MenuIzquierdaVM() {
    var self = this;

    //Carga inicial
    self.LoadVM = function () {
        self.SeleccionarItemMenu();
    };

    self.SeleccionarItemMenu = function () {
        $('#js-nav-menu li').removeClass("active open");

        var pathname = document.location.pathname;

        var li = Enumerable.From($('#js-nav-menu li')).Where(function (x) { return pathname.search(x.getAttribute("pathname")) == 0 }).FirstOrDefault();

        if (li == undefined) {
            var pathnameHash = pathname + location.hash;
            li = Enumerable.From($('#js-nav-menu li')).Where(function (x) { return pathnameHash.search(x.getAttribute("pathname")) == 0 }).FirstOrDefault();
        };

        if (li != undefined && li != null) {
            li.className = "active";

            if (li.parentElement.parentElement.getAttribute("name") == "menu") {
                li.parentElement.parentElement.className = "active open";
            };

            if (li.parentElement.parentElement.getAttribute("name") == "submenu") {
                li.parentElement.parentElement.className = "active open";
                li.parentElement.parentElement.parentElement.parentElement.className = "active open";
            };
        };
    };
};

$(document).ready(function () {
    masterMenuIzquierdaVM = new MenuIzquierdaVM();
    ko.applyBindings(masterMenuIzquierdaVM, document.getElementById('_MenuIzquierda'));

    masterMenuIzquierdaVM.LoadVM();
});