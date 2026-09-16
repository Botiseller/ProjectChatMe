function SectionFinVM() {
    var self = this;

    self.LoadVM = function () {
    };

    self.EditVM = function (campania) {

    };

    self.buttonGuardar = function () {
        facCampanias.GuardarCampanias(GetCampaniasRequest()).done(function (campaniaId) {
            Command: toastr["success"]("Campaña se guardo correctamente.", "Éxito");

            //setTimeout(function () {
            //    location.href = "/Campanias/Campanias/Campanias";
            //}, 2000);

            masterCampaniasVM.LoadVM();


            $("#divValidarFormSectionFin").show();
            $("#divEnProcesoSectionFin").hide();

            $("#modalCrearCampania").modal("hide");


        }).fail(function () {
            $("#divValidarFormSectionFin").show();
            $("#divEnProcesoSectionFin").hide();
        });
    };

    function GetCampaniasRequest() {
        var campaniaRequest = {
            CampaniasDto: GetCampaniasDto(),
            CampaniasPublicidadesRequestList: GetCampaniasPublicidadesRequest()
        };

        return campaniaRequest;
    };

    function GetCampaniasDto() {
        var campania = {
            CampaniaId: masterCrearCampaniasVM.campaniaId(),
            CampaniaSegmentoId: masterSectionSegmentosVM.campaniaSegmentoId(),
            CodigoCampania: masterCrearCampaniasVM.codigoCampania(),
            Nombre: masterSectionDatosGeneralesVM.nombre(),
            Descripcion: masterSectionDatosGeneralesVM.descripcion(),
            FechaInicio: masterSectionDatosGeneralesVM.fechaInicio(),
            FechaFin: masterSectionDatosGeneralesVM.fechaFin(),
            Habilitado: masterSectionDatosGeneralesVM.habilitado(),
            CampaniasComunicaciones: GetCampaniasComunicaciones(),
            CampaniasSegmentosImportados: GetCampaniasSegmentosImportados()
        };

        return campania;
    };

    function GetCampaniasComunicaciones() {
        var tipoComunicacionOtro = null;

        if (masterSectionDatosGeneralesVM.tipoComunicacion() == "4") {
            tipoComunicacionOtro = masterSectionDatosGeneralesVM.otrosTexto();
        } else if (masterSectionDatosGeneralesVM.tipoComunicacion() == "3" && masterSectionDatosGeneralesVM.tipoComunicacionDetalle() == "3") {
            tipoComunicacionOtro = masterSectionDatosGeneralesVM.compraOtrosTexto()
        };

        var campaniaComunicacion = {
            TipoComunicacion: masterSectionDatosGeneralesVM.tipoComunicacion(),
            TipoComunicacionDetalle: masterSectionDatosGeneralesVM.tipoComunicacion() == "3" ? masterSectionDatosGeneralesVM.tipoComunicacionDetalle() : null,
            TipoComunicacionOtro: tipoComunicacionOtro
        };

        return campaniaComunicacion;
    };

    function GetCampaniasSegmentosImportados() {
        var campaniasSegmentosImportadosList = [];

        $.each(masterSectionSegmentosVM.datosImportacionList(), function (i, datoImportacionFilas) {
            var datoImportacionClass = {
                CampaniaSegmentoImportadoId: Guid.NewGuid(),
                VariablesDto: {
                    VariablesList: []
                }
            };

            $.each(datoImportacionFilas, function (i, datoImportacion) {
                var variable = {
                    Parametro: datoImportacion.Parametro(),
                    Valor: datoImportacion.Valor()
                };

                datoImportacionClass.VariablesDto.VariablesList.push({ Key: Guid.NewGuid(), Value: variable });
            });

            campaniasSegmentosImportadosList.push(datoImportacionClass);
        });

        return campaniasSegmentosImportadosList;
    };

    function GetCampaniasPublicidadesRequest() {
        var campaniasPublicidadesRequestList = [];

        $.each(masterSectionCampaniaVM.tipoCampaniasList(), function (i, tipoCampania) {
            if (tipoCampania.Validar()) {
                var campaniasPublicidadesRequest = {
                    TipoCampania: tipoCampania.TipoCampania(),
                    CampaniasPublicidadesStringfy: JSON.stringify(tipoCampania.MasterTipoCampania().GetObjeto())
                };

                campaniasPublicidadesRequestList.push(campaniasPublicidadesRequest);
            };
        });

        return campaniasPublicidadesRequestList;
    };
};


$(document).ready(function () {
    masterSectionFinVM = new SectionFinVM();
    ko.applyBindings(masterSectionFinVM, document.getElementById('SectionFin'));

    ValidarForumlarios("btnValidarFormSectionFin", "formValidarSectionFin", "divValidarFormSectionFin", "divEnProcesoSectionFin");
});