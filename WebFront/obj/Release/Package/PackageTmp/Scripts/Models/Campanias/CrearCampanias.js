masterCrearCampaniasVM = null;
function CrearCampaniasVM() {
    var self = this;

    self.campaniaId = ko.observable();
    self.codigoCampania = ko.observable(null);
    self.editable = ko.observable(true);
    self.editable.subscribe(function (){
        if (self.editable()) {
            $('#notEditable').css('display', 'none')
            $('[data-visible="SeccionButtons"]').css('display', 'block')

            $('[data-visible="SeccionData"]').css('display', 'block')
        } else {
            $('#notEditable').css('display', 'contents')
            document.querySelector('[data-visible="SeccionButtons"]').style.setProperty('display', 'none', 'important');

            $('[data-visible="SeccionData"]').css('display', 'none')
            $('[data-visible="SeccionFin"]').css('display', 'none')



        }  
    })
    self.LoadVM = function (campaniaId) {
        self.campaniaId(campaniaId);
        
        //masterSectionDatosGeneralesVM = new SectionDatosGeneralesVM();
        //masterSectionCampaniaVM = new SectionCampaniaVM();
        //masterSectionSegmentosVM = new SectionSegmentosVM();
        //masterSectionFinVM = new SectionFinVM();

        masterSectionDatosGeneralesVM.LoadVM();
        masterSectionCampaniaVM.LoadVM();
        masterSectionSegmentosVM.LoadVM();
        masterSectionFinVM.LoadVM();

        if (self.campaniaId() == Guid.Empty) {
            facShared.ConseguirUniqueString().done(function (uniqueString) {
                self.codigoCampania(uniqueString);
            });
            self.editable(true);
        } else {
            $('[data-visible="loading"]').css('display', 'block')
            $('[data-visible="content"]').css('display', 'none')
            facCampanias.ConseguirCampaniasPorId(self.campaniaId()).done(function (campania) {
                self.codigoCampania(campania.CodigoCampania);

                masterSectionDatosGeneralesVM.EditVM(campania);

                masterSectionCampaniaVM.EditVM(campania);
                flagActivoCampanias = true;

                if (self.visibleTabSegmento()) {
                    masterSectionSegmentosVM.EditVM(campania);
                    flagActivoSegmentos = true;
                };

                masterSectionFinVM.EditVM(campania);
                flagActivoFin = true;

                //if (moment(campania.FechaInicio).isBefore(moment()) && campania.Habilitado) {
                //    $(document).ajaxStop(function () {
                //        // Obtén el div que contiene los elementos que deseas deshabilitar
                //        var miDiv = document.getElementById('divDisable');

                //        // Obtén todos los elementos dentro del div
                //        var elementos = miDiv.getElementsByTagName('*');
                //        for (var i = 0; i < elementos.length; i++) {
                //            // Excluye el editor de Froala del deshabilitado
                //            if (elementos[i].id !== 'eg-dark-theme-mail' && elementos[i].id !== 'eg-dark-theme-banner') {
                //                // Deshabilita los elementos dentro del div
                //                elementos[i].disabled = true;
                //            };
                //        };

                //        $(".divVisibleFalse").hide();

                //        $("#eg-dark-theme-mail")[0]['data-froala.editor'].edit.off();
                //        $("#eg-dark-theme-banner")[0]['data-froala.editor'].edit.off();
                //    });
                //};

                $('[data-visible="loading"]').css('display', 'none')
                $('[data-visible="content"]').css('display', 'block')
            });
        };
    };

    self.buttonSeleccionarTab = function (posicionFutura) {
        SeleccionarTab(posicionFutura);
    };

    self.visibleTabSegmento = ko.observable(false);

    self.computedVisibleTabSegmento = ko.computed(function () {
        var tipoCampaniaMailTemplate = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) {
            return x.TipoCampania() == new Enums().TipoCampania.CampaniaWhatsappTemplate && x.Validar() ||
                x.TipoCampania() == new Enums().TipoCampania.CampaniaMail && x.Validar();
        }).FirstOrDefault();

        if (tipoCampaniaMailTemplate != undefined) {
            self.visibleTabSegmento(true);
        } else {
            self.visibleTabSegmento(false);
        };
    }, this);

    self.Initialize = function (campaniaId) {
        self.buttonSeleccionarTab(1);
        self.LoadVM(campaniaId);
        $("#modalCrearCampania").modal("show");
    }


};


$(document).ready(function () {
    masterCrearCampaniasVM = new CrearCampaniasVM();
    ko.applyBindings(masterCrearCampaniasVM, document.getElementById('CrearCampanias'));
    

    //ValidarForumlarios("btnValidarFormModalMensajesPush", "formValidarModalMensajesPush", "divValidarFormModalMensajesPush", "divEnProcesoModalMensajesPush");
});



var posicionBarra = 1;

var flagActivoCampanias = false;
var flagActivoSegmentos = false;
var flagActivoFin = false;

function SeleccionarTab(posicionFutura) {
    if (ValidarPorPosicion(posicionBarra, posicionFutura)) {
        
        $("#btnSiguiente").attr("disabled", false);
        $("#btnAnterior").attr("disabled", false);

        $.each(masterSectionCampaniaVM.tipoCampaniasList(), function (i, o) {
            o.SeleccionarFila("");
            o.MasterTipoCampania().visibleTipoCampania(false);
        });

        switch (posicionBarra) {
            case 1:
                //Activar Tab Datos Generales
                if (masterCrearCampaniasVM.editable()) {
                    $("#btnAnterior").attr("disabled", true);
                    $('[data-visible="SeccionData"]').show();
                    $('[data-visible="SeccionFin"]').hide();
                }
                $("#SectionDatosGeneralesTab").addClass("active").children().addClass("greenImportant");
                $("#SectionDatosGeneralesPanel").addClass("active show");
                
                break;
            case 2:
                //Activar Tab Campania
                if (!flagActivoCampanias) {
                    masterSectionCampaniaVM.LoadVM();
                    flagActivoCampanias = true;
                };

                if (masterCrearCampaniasVM.editable()) {
                    
                    $('[data-visible="SeccionData"]').show();
                    $('[data-visible="SeccionFin"]').hide();
                }
                $("#SectionCampaniaTab").addClass("active").children().addClass("greenImportant");
                $("#SectionCampaniaPanel").addClass("active show");

                break;
            case 3:
                //Activar Tab Segmento
                if (!flagActivoSegmentos) {
                    masterSectionSegmentosVM.LoadVM();
                    flagActivoSegmentos = true;
                };

                var tipoCampaniaTemplate = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) { return x.TipoCampania() == new Enums().TipoCampania.CampaniaWhatsappTemplate }).FirstOrDefault();

                if (tipoCampaniaTemplate != undefined) {
                    masterSectionSegmentosVM.CargarColumnasImportacion(tipoCampaniaTemplate.MasterTipoCampania().variablesList());
                } else {
                    var tipoCampaniaMail = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) { return x.TipoCampania() == new Enums().TipoCampania.CampaniaMail }).FirstOrDefault();
                    masterSectionSegmentosVM.CargarColumnasImportacion(null);
                };

                if (masterCrearCampaniasVM.editable()) {
                    $('[data-visible="SeccionData"]').show();
                    $('[data-visible="SeccionFin"]').hide();
                   
                }
                $("#SectionSegmentoTab").addClass("active").children().addClass("greenImportant");
                $("#SectionSegmentoPanel").addClass("active show");
                
                break;
            case 4:
                //Activar Tab Fin
                if (!flagActivoFin) {
                    masterSectionFinVM.LoadVM();
                    flagActivoFin = true;
                };

                if (masterCrearCampaniasVM.editable()) {
                    $("#btnSiguiente").attr("disabled", true);
                    $('[data-visible="SeccionData"]').hide();
                    $('[data-visible="SeccionFin"]').show();
                }
                $("#SectionFinTab").addClass("active").children().addClass("greenImportant");
                $("#SectionFinPanel").addClass("active show");
                
                
                break;
        };
    };
};

function ValidarPorPosicion(posicionActual, posicionFutura) {
    $(".nav-link, .tab-pane").removeClass("active show").children().removeClass("greenImportant");

    //Me fijo si no existe el tab segmentos y acomodo la posicion 
    var tipoCampaniaMailTemplate = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) {
        return x.TipoCampania() == new Enums().TipoCampania.CampaniaWhatsappTemplate && x.Validar() ||
            x.TipoCampania() == new Enums().TipoCampania.CampaniaMail && x.Validar();
    }).FirstOrDefault();

    if (posicionFutura == 3 && tipoCampaniaMailTemplate == undefined) {
        if (posicionActual < posicionFutura) {
            posicionFutura = 4;
        } else {
            posicionFutura = 2;
        };
    };

    var validacion = true;
    var form = null;

    while (posicionActual < posicionFutura) {
        switch (posicionActual) {
            case 1:
                //Valido Datos Generales
                form = $("#formValidarDatosGenerales");

                if (form[0].checkValidity() === false) {
                    $("#SectionDatosGeneralesTab").addClass("active").children().addClass("greenImportant");
                    $("#SectionDatosGeneralesPanel").addClass("active show");

                    validacion = false;
                };
                break;
            case 2:
                //Valido Campanias
                var tipoCampaniasList = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) { return x.Validar(); }).OrderBy("$.Orden()").ToArray();

                if (!tipoCampaniasList.length) {
                    Command: toastr["info"]("Debe seleccionar minimo un tipo de campaña.", "Información");
                    posicionFutura = posicionActual;
                } else {
                    $.each(tipoCampaniasList, function (i, tipoCampania) {
                        if (validacion) {
                            form = $("#formValidar" + tipoCampania.TipoCampaniaId());

                            if (form[0].checkValidity() === false) {
                                SeleccionarCampania();
                            };

                            if (tipoCampania.TipoCampania() == new Enums().TipoCampania.CampaniaBanner && $("#eg-dark-theme-banner")[0]['data-froala.editor'].html.get() == '' ||
                                tipoCampania.TipoCampania() == new Enums().TipoCampania.CampaniaMail && $("#eg-dark-theme-mail")[0]['data-froala.editor'].html.get() == '') {
                                SeleccionarCampania();
                                Command: toastr["info"]("Debe completar cuerpo.", "Información");
                            };

                            if (tipoCampania.TipoCampania() == new Enums().TipoCampania.CampaniaFormulario && !tipoCampania.MasterTipoCampania().formulariosList().length) {
                                SeleccionarCampania();
                                Command: toastr["info"]("Debe agregar un elemento a la lista.", "Información");
                            };

                            if (tipoCampania.TipoCampania() == new Enums().TipoCampania.CampaniaWhatsappTemplate && tipoCampania.MasterTipoCampania().tipoEnvioId() == 2 &&
                                !tipoCampania.MasterTipoCampania().diasSemanaList().filter(x => x.Check).length) {
                                SeleccionarCampania();
                                Command: toastr["info"]("Debe seleccionar un día de la semana.", "Información");
                            };

                            if (tipoCampania.TipoCampania() == new Enums().TipoCampania.CampaniaMail && tipoCampania.MasterTipoCampania().tipoEnvioId() == 2 &&
                                !tipoCampania.MasterTipoCampania().diasSemanaList().filter(x => x.Check).length) {
                                SeleccionarCampania();
                                Command: toastr["info"]("Debe seleccionar un día de la semana.", "Información");
                            };

                            function SeleccionarCampania() {
                                $("#SectionCampaniaTab").addClass("active").children().addClass("greenImportant");
                                $("#SectionCampaniaPanel").addClass("active show");

                                tipoCampania.ButtonSeleccionar();
                                validacion = false;
                            };
                        };
                    });
                };
                break;
            case 3:
                //Validar Segmentos
                if (tipoCampaniaMailTemplate != undefined && !masterSectionSegmentosVM.datosImportacionList().length && masterSectionSegmentosVM.campaniaSegmentoId() == null) {
                    Command: toastr["info"]("Debe seleccionar al menos un segmento o importar datos.", "Información");
                    posicionFutura = posicionActual;
                };
                break;
            case 4:
                //Validar Fin
                break;
        };

        if (!validacion) {
            if (form != null) {
                event.preventDefault();
                event.stopPropagation();

                form.addClass('was-validated');
            };

            posicionFutura = posicionActual;
        } else {
            posicionActual += 1;
        };
    };

    posicionBarra = posicionFutura;

    return validacion;
};

function buttonGuardar() {
    masterSectionFinVM.buttonGuardar();
}




