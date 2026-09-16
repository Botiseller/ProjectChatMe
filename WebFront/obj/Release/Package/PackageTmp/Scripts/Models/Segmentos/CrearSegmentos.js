masterCrearSegmentosVM = null;
function CrearSegmentosVM(campaniaSegmentoId, flagCampanias) {
    var self = this;

    self.visibleEliminar = ko.observable(false);
    self.callbackSave = ko.observable(null);
    self.campaniaSegmentoId = ko.observable(campaniaSegmentoId);
    self.flagCampanias = ko.observable(flagCampanias);

    self.nombre = ko.observable();
    self.incluyeLead = ko.observable(false);
    self.incluyeContacto = ko.observable(false);
    self.descripcion = ko.observable();

    self.estadosList = ko.observableArray([]);
    self.grupoList = ko.observableArray([]);

    self.datosAdicionalesList = ko.observableArray([]);

    self.LoadVM = function (campaniaSegmento) {
        var segmentoFiltroDto = null;

        if (campaniaSegmento != null) {
            self.nombre(campaniaSegmento.Nombre);
            self.descripcion(campaniaSegmento.Descripcion);
            self.incluyeContacto(campaniaSegmento.IncluyeContacto);
            self.incluyeLead(campaniaSegmento.IncluyeLead);
            if (isNaN(campaniaSegmento.SegmentoFiltro)) {
                segmentoFiltroDto = JSON.parse(jQuery.base64.decode(campaniaSegmento.SegmentoFiltro));
            };
        };

        facCrm.ConseguirEstadosLead().done(function (estadosList) {
            self.estadosList.removeAll();

            $.each(estadosList, function (i, estado) {
                var estadoClass = new EstadosClass();

                estadoClass.EstadoLeadId(estado.EstadoLeadId);
                estadoClass.Nombre(estado.Nombre);

                if (isNaN(segmentoFiltroDto) && segmentoFiltroDto.EstadosLead != null) {
                    if (Enumerable.From(segmentoFiltroDto.EstadosLead).Where(function (x) { return x == estado.EstadoLeadId; }).FirstOrDefault() != undefined) {
                        estadoClass.Check(true);
                    };
                };

                self.estadosList.push(estadoClass);
            });
        });

        facCrm.ConseguirGruposLead().done(function (grupoList) {
            self.grupoList.removeAll();

            $.each(grupoList, function (i, grupo) {
                var grupoClass = new GruposClass();

                grupoClass.GrupoLeadId(grupo.GrupoLeadId);
                grupoClass.Nombre(grupo.Nombre);

                if (isNaN(segmentoFiltroDto) && segmentoFiltroDto.EstadosLead != null) {
                    if (Enumerable.From(segmentoFiltroDto.GruposLead).Where(function (x) { return x == grupo.GrupoLeadId; }).FirstOrDefault() != undefined) {
                        grupoClass.Check(true);
                    };
                };

                self.grupoList.push(grupoClass);
            });
        });

        facCrm.ConseguirDatosAdicionales(0).done(function (datosAdicionalesList) {
            self.datosAdicionalesList.removeAll();

            datosAdicionalesList.sort(function (a, b) {
                return b.Tipo - a.Tipo;
            });

            $.each(datosAdicionalesList, function (i, datoAdicional) {
                var datoAdicionalClass = new DatosAdicionalesClass();

                datoAdicionalClass.DatoAdicionalId(datoAdicional.DatoAdicionalId);
                datoAdicionalClass.Nombre(datoAdicional.Nombre);
                datoAdicionalClass.Tipo(datoAdicional.Tipo);
                datoAdicionalClass.Maximo(datoAdicional.Maximo);

                if (datoAdicional.Tipo == new Enums().TipoDatoAdicional.fecha) {
                    if (isNaN(segmentoFiltroDto) && segmentoFiltroDto.DatosAdicionalesFiltros != null && segmentoFiltroDto.DatosAdicionalesFiltros.Fechas != null) {
                        var fecha = Enumerable.From(segmentoFiltroDto.DatosAdicionalesFiltros.Fechas).Where(function (x) { return x.Key == datoAdicional.DatoAdicionalId; }).FirstOrDefault();

                        if (fecha != undefined) {
                            if (fecha.Value.FechaDesde != null) {
                                datoAdicionalClass.ValorFechaDesde(moment(fecha.Value.FechaDesde).format("DD/MM/YYYY"));
                            };

                            if (fecha.Value.FechaHasta != null) {
                                datoAdicionalClass.ValorFechaHasta(moment(fecha.Value.FechaHasta).format("DD/MM/YYYY"));
                            };
                        };
                    };
                };

                if (datoAdicional.Tipo == new Enums().TipoDatoAdicional.entero || datoAdicional.Tipo == new Enums().TipoDatoAdicional.numericoDecimal) {
                    if (isNaN(segmentoFiltroDto) && segmentoFiltroDto.DatosAdicionalesFiltros != null && segmentoFiltroDto.DatosAdicionalesFiltros.Cantidades != null) {
                        var cantidad = Enumerable.From(segmentoFiltroDto.DatosAdicionalesFiltros.Cantidades).Where(function (x) { return x.Key == datoAdicional.DatoAdicionalId; }).FirstOrDefault();

                        if (cantidad != undefined) {
                            if (cantidad.Value.Desde != null) {
                                datoAdicionalClass.ValorCantidadDesde(cantidad.Value.Desde);
                            };

                            if (cantidad.Value.Hasta != null) {
                                datoAdicionalClass.ValorCantidadHasta(cantidad.Value.Hasta);
                            };
                        };
                    };
                };

                $.each(datoAdicional.DatosAdicionalesLista, function (i, datoAdicionalLista) {
                    var datoAdicionalListaClass = new DatosAdicionalesListaClass();

                    datoAdicionalListaClass.DatoAdicionalListaId(datoAdicionalLista.DatoAdicionalListaId);
                    datoAdicionalListaClass.DatoAdicionalId(datoAdicionalLista.DatoAdicionalId);
                    datoAdicionalListaClass.Valor(datoAdicionalLista.Valor);

                    if (isNaN(segmentoFiltroDto) && segmentoFiltroDto.DatosAdicionalesFiltros != null && segmentoFiltroDto.DatosAdicionalesFiltros.ValoresList != null) {
                        if (Enumerable.From(segmentoFiltroDto.DatosAdicionalesFiltros.ValoresList).Where(function (x) { return x.Value.DatoAdicionalListaId == datoAdicionalLista.DatoAdicionalListaId; }).FirstOrDefault() != undefined) {
                            datoAdicionalListaClass.Check(true);
                        };
                    };

                    datoAdicionalClass.DatosAdicionalesLista.push(datoAdicionalListaClass);
                });

                self.datosAdicionalesList.push(datoAdicionalClass);
            });

            //Se activa inputmask de la lista
            $(":input").inputmask();

            //Se activa el rango de fecha desde hasta
            $('.datepicker-bottom-left').datepicker({
                language: 'es',
                format: "dd/mm/yyyy",
                /* orientation: "bottom left",*/
                todayHighlight: true,
                autoclose: true,
                /* showAnim: 'slideDown',*/
                clearBtn: true,
                templates: {
                    leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
                    rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
                }
            });

            $('.divRangoFechaCreacion').datepicker();
        });
    };

    self.EditVM = function () {
        facSegmentos.ConseguirSegmentosPorId(self.campaniaSegmentoId()).done(function (campaniaSegmento) {
            $(".subheader-title").find("small").html("Editar segmento: " + campaniaSegmento.Nombre);
            self.visibleEliminar(true);

            self.LoadVM(campaniaSegmento);
        });
    };

    self.CleanCampos = function () {
        if (!self.flagCampanias()) {
            $(".subheader-title").find("small").html("Crear un nuevo segmento");
        } else {
            var campaniaSegmentoClass = new CampaniasSegmentosClass();

            campaniaSegmentoClass.CampaniaSegmentoId(self.campaniaSegmentoId());
            campaniaSegmentoClass.Nombre(self.nombre());
            campaniaSegmentoClass.CampaniasActivas(0);

            masterSectionSegmentosVM.segmentosList.push(campaniaSegmentoClass);
        };

        self.campaniaSegmentoId(Guid.Empty);
        self.nombre("");
        self.descripcion("");
        self.incluyeContacto(false);
        self.incluyeLead(false);

        Enumerable.From(self.estadosList()).Select(function (x) { return x.Check(false); }).ToArray();
        Enumerable.From(self.grupoList()).Select(function (x) { return x.Check(false); }).ToArray();

        $.each(self.datosAdicionalesList(), function (i, datoAdicional) {
            if (datoAdicional.Tipo() == new Enums().TipoDatoAdicional.fecha) {
                datoAdicional.ValorFechaDesde("");
                datoAdicional.ValorFechaHasta("");
            };

            if (datoAdicional.Tipo() == new Enums().TipoDatoAdicional.entero || datoAdicional.Tipo() == new Enums().TipoDatoAdicional.numericoDecimal) {
                datoAdicional.ValorCantidadDesde("");
                datoAdicional.ValorCantidadHasta("");
            };

            $.each(datoAdicional.DatosAdicionalesLista(), function (i, datoAdicionalLista) {
                datoAdicionalLista.Check(false);
            });
        });
    };

    self.buttonGuardar = function () {
        facSegmentos.GuardarSegmentos(GetCampaniasSegmentos()).done(function (campaniaSegmentoId) {
            Command: toastr["success"]("El segmento se ha guardado correctamente.", "Éxito");
            self.campaniaSegmentoId(campaniaSegmentoId);
            self.CleanCampos();
            if (self.callbackSave() != null) {
                var cb = self.callbackSave();
                cb();
            }

            
            //if (!self.flagCampanias()) {
            //    //setTimeout(function () {
            //    //    location.href = "/Segmentos/Segmentos/Segmentos";
            //    //}, 1000);
            //} else {
            //    self.CleanCampos();
            //};
        }).fail(function () {
            $("#divValidarForm").show();
            $("#divEnProceso").hide();
            $("#modalCrearSegmentos").modal("hide");
        });
        return true;
    };

    self.botonEliminar = function () {
        var swalWithBootstrapButtons = Swal.mixin(
            {
                customClass:
                {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-danger mr-2"
                },
                buttonsStyling: false
            });
        swalWithBootstrapButtons
            .fire(
                {
                    title: "Estas seguro/a?",
                    text: "No podrás revertir esto!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Si, eliminar segmento!",
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: true
                })
            .then(function (result) {
                if (result.value) {
                    facSegmentos.EliminarSegmentos(GetCampaniasSegmentos()).done(function (result) {
                        swalWithBootstrapButtons.fire(
                            "Eliminado!",
                            "Su segmento ha sido eliminado.",
                            "success"
                        ).then(function (result) {
                            location.href = "/Segmentos/Segmentos/Segmentos";
                        });
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelado",
                        "Tú segmento está seguro :)",
                        "error"
                    );
                };
            });
    };

    self.botonCancelar = function () {
        if (!self.flagCampanias()) {
            $("#modalCrearSegmentos").modal("hide");
        } else {
            $("#divAgregarSegmento").hide();

        };
        
    };
    
    self.Initialize = function (segmentoId, callback) {
        masterCrearSegmentosVM.campaniaSegmentoId(segmentoId)
        self.callbackSave(callback);
        
        if (segmentoId == null) {

            self.LoadVM(null);
        } else {
            self.EditVM();
        }

       
        $("#modalCrearSegmentos").modal("show");
    }

    function GruposClass() {
        var me = this;

        me.GrupoLeadId = ko.observable();
        me.Nombre = ko.observable();

        me.Check = ko.observable(false);
    };

    function EstadosClass() {
        var me = this;

        me.EstadoLeadId = ko.observable();
        me.Nombre = ko.observable();

        me.Check = ko.observable(false);
    };

    function DatosAdicionalesClass() {
        var me = this;

        me.DatoAdicionalId = ko.observable();
        me.Nombre = ko.observable();
        me.Tipo = ko.observable();
        me.Maximo = ko.observable();

        me.DatosAdicionalesLista = ko.observableArray([]);

        me.Valor = ko.observable("");

        me.ValorFechaDesde = ko.observable("");
        me.ValorFechaHasta = ko.observable("");

        me.ValorCantidadDesde = ko.observable("");
        me.ValorCantidadHasta = ko.observable("");

        me.changeCantidad = function () {
            if (me.ValorCantidadDesde() != "") {
                if (me.Tipo() == new Enums().TipoDatoAdicional.entero) {
                    if (parseInt(me.ValorCantidadDesde()) > parseInt(me.ValorCantidadHasta())) {
                        me.ValorCantidadHasta("");
                    };
                };

                if (me.Tipo() == new Enums().TipoDatoAdicional.numericoDecimal) {
                    if (parseFloat(me.ValorCantidadDesde()) > parseFloat(me.ValorCantidadHasta())) {
                        me.ValorCantidadHasta("");
                    };
                };
            };
        };
    };

    function DatosAdicionalesListaClass() {
        var me = this;

        me.DatoAdicionalListaId = ko.observable(null);
        me.DatoAdicionalId = ko.observable();
        me.Valor = ko.observable();

        me.Check = ko.observable(false);
    };

    function CampaniasSegmentosClass() {
        var me = this;

        me.CampaniaSegmentoId = ko.observable();
        me.Nombre = ko.observable();
        me.CampaniasActivas = ko.observable();
    };

    function GetCampaniasSegmentos() {
        var campaniaSegmento = {
            CampaniaSegmentoId: self.campaniaSegmentoId(),
            Nombre: self.nombre(),
            Descripcion: self.descripcion(),
            IncluyeLead: self.incluyeLead(),
            IncluyeContacto: self.incluyeContacto(),
            SegmentoFiltroDto: {
                EstadosLead: [],
                GruposLead: [],
                DatosAdicionalesFiltros: {
                    Fechas: [],
                    Cantidades: [],
                    ValoresList: []
                }
            }
        };

        $.each(Enumerable.From(self.estadosList()).Where(function (x) { return x.Check(); }).ToArray(), function (i, estado) {
            campaniaSegmento.SegmentoFiltroDto.EstadosLead.push(estado.EstadoLeadId());
        });

        $.each(Enumerable.From(self.grupoList()).Where(function (x) { return x.Check(); }).ToArray(), function (i, grupo) {
            campaniaSegmento.SegmentoFiltroDto.GruposLead.push(grupo.GrupoLeadId());
        });

        $.each(self.datosAdicionalesList(), function (i, datoAdicional) {
            if (datoAdicional.Tipo() == new Enums().TipoDatoAdicional.fecha) {
                if (datoAdicional.ValorFechaDesde() != "" || datoAdicional.ValorFechaHasta() != "") {
                    var fecha = {
                        FechaDesde: !isNaN(datoAdicional.ValorFechaDesde()) ? null : moment(datoAdicional.ValorFechaDesde(), "DD/MM/YYYY").add(1, 'days').format("YYYY-MM-DDTHH:mm:ss") + "Z",
                        FechaHasta: !isNaN(datoAdicional.ValorFechaHasta()) ? null : moment(datoAdicional.ValorFechaHasta(), "DD/MM/YYYY").add(1, 'days').format("YYYY-MM-DDTHH:mm:ss") + "Z"
                    };

                    campaniaSegmento.SegmentoFiltroDto.DatosAdicionalesFiltros.Fechas.push({ Key: datoAdicional.DatoAdicionalId(), Value: fecha });
                };
            };

            if (datoAdicional.Tipo() == new Enums().TipoDatoAdicional.lista || datoAdicional.Tipo() == new Enums().TipoDatoAdicional.listaMultipleSelect) {
                $.each(Enumerable.From(datoAdicional.DatosAdicionalesLista()).Where(function (x) { return x.Check(); }).ToArray(), function (i, datoAdicionalLista) {
                    var valoresList = {
                        DatoAdicionalId: datoAdicionalLista.DatoAdicionalId(),
                        DatoAdicionalListaId: datoAdicionalLista.DatoAdicionalListaId()
                    };

                    campaniaSegmento.SegmentoFiltroDto.DatosAdicionalesFiltros.ValoresList.push({ Key: Guid.NewGuid(), Value: valoresList });
                });
            };

            if (datoAdicional.Tipo() == new Enums().TipoDatoAdicional.entero || datoAdicional.Tipo() == new Enums().TipoDatoAdicional.numericoDecimal) {
                if (datoAdicional.ValorCantidadDesde() != "" || datoAdicional.ValorCantidadHasta() != "") {
                    var cantidad = {
                        Desde: datoAdicional.ValorCantidadDesde() != "" ? datoAdicional.ValorCantidadDesde().parseDecimal() : null,
                        Hasta: datoAdicional.ValorCantidadHasta() != "" ? datoAdicional.ValorCantidadHasta().parseDecimal() : null
                    };

                    campaniaSegmento.SegmentoFiltroDto.DatosAdicionalesFiltros.Cantidades.push({ Key: datoAdicional.DatoAdicionalId(), Value: cantidad });
                };
            };
        });

        return campaniaSegmento;
    }
};

$(document).ready(function () {
    
    masterCrearSegmentosVM = new CrearSegmentosVM();
    ko.applyBindings(masterCrearSegmentosVM, document.getElementById('modalCrearSegmentos'));

    //ValidarForumlarios("btnValidarForm", "formValidar", "divValidarForm", "divEnProceso");


    //masterCrearSegmentosVM.LoadVM(null);

    //if (flagCampanias) {
    //    $("#CrearSegmentos").children().removeClass("panel").children().removeClass("panel-container");
    //    $("#CrearSegmentos #formValidar").children().removeClass("panel-content");
    //};
});

function CrearSegmentosCampaña(campaniaSegmentoId) {
    masterCrearSegmentosVM.flagCampanias(true)
    if (campaniaSegmentoId == Guid.Empty) {
        masterCrearSegmentosVM.LoadVM(null);
    } else {
        masterCrearSegmentosVM.EditVM();
    };

    $("#CrearSegmentos").children().removeClass("panel").children().removeClass("panel-container");
    $("#CrearSegmentos #formValidar").children().removeClass("panel-content");
};
