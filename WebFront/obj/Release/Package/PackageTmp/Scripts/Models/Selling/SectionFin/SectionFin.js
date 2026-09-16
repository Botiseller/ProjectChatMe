function SectionFinVM() {
    var self = this;

    self.LoadVM = function () {
    };

    self.EditVM = function (selling) {

    };
};


$(document).ready(function () {
    masterSectionFinVM = new SectionFinVM();
    ko.applyBindings(masterSectionFinVM, document.getElementById('SectionFin'));

    ValidarForumlarios("btnValidarFormSectionFin", "formValidarSectionFin", "divValidarFormSectionFin", "divEnProcesoSectionFin");
});