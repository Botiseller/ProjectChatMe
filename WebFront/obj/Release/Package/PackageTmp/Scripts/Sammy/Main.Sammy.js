
var sammy = $.sammy(function () {
    var self = this;

    self._checkFormSubmission = function (form) {
        return true;
    };

    self.get('#Home', function (context) {
    });

    self.get('#authentication/:usuarioId/:empresa', function (context) {
        var usuarioId = this.params['usuarioId'];
        var empresa = this.params['empresa'];

        PanelAuthenticationCampaniasSammy(usuarioId, empresa, null);
    });

    self.get('#authenticationView/:usuarioId/:empresa/:view', function (context) {
        var usuarioId = this.params['usuarioId'];
        var empresa = this.params['empresa'];
        var view = this.params['view'];

        PanelAuthenticationCampaniasSammy(usuarioId, empresa, view);
    });

    self.get('#segmentos/:campaniaSegmentoId', function (context) {
        var campaniaSegmentoId = jQuery.base64.decode(this.params['campaniaSegmentoId']); 
        CrearSegmentosSammy(campaniaSegmentoId, false);
    });

    //self.get('#campanias/:campaniaId', function (context) {
    //    var campaniaId = jQuery.base64.decode(this.params['campaniaId']);

    //    CrearCampaniasSammy(campaniaId);
    //});

    self.get('#selling/:sellingId', function (context) {
        var sellingId = jQuery.base64.decode(this.params['sellingId']);

        CrearSellingSammy(sellingId);
    });
});

$(function () {
    sammy.run('#Home');
});