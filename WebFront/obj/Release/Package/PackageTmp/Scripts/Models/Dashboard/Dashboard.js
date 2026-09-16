function DashboardVM() {
    var self = this;

    self.flagActivoCampanias = ko.observable(false);
    self.flagActivoSelling = ko.observable(false);

    self.buttonSeleccionarTab = function (posicion) {
        $("#Dashboard .nav-link, .tab-pane").removeClass("active show").children().removeClass("greenImportant");

        switch (posicion) {
            case 1:
                //Activar Campanias
                if (!self.flagActivoCampanias()) {
                    self.flagActivoCampanias(true);
                    masterSectionCampaniasVM.LoadVM();
                };

                $("#SectionCampaniasTab").addClass("active").children().addClass("greenImportant");
                $("#SectionCampaniasPanel").addClass("active show");
                break;
            case 2:
                //Activar Selling
                if (!self.flagActivoSelling()) {
                    self.flagActivoSelling(true);
                    masterSectionSellingVM.LoadVM();
                };

                $("#SectionSellingTab").addClass("active").children().addClass("greenImportant");
                $("#SectionSellingPanel").addClass("active show");
                break;
        };
    };
};

$(document).ready(function () {
    $('.subheader').remove();

    masterDashboardVM = new DashboardVM();
    ko.applyBindings(masterDashboardVM, document.getElementById("Dashboard"));

    masterDashboardVM.buttonSeleccionarTab(1);
});



