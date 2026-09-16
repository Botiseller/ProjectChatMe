masterCrearSellingVM = new CrearSellingVM();
function CrearSellingVM() {
    var self = this;
    

    self.sellingId = ko.observable();
    self.callback = ko.observable();

    self.LoadVM = function (sellingId) {
        self.sellingId(sellingId);
        
        
        $("#btnEliminarSelling").hide();

        $.when(
            masterSectionDatosGeneralesVM.LoadVM(),
            masterSectionSellingVM.LoadVM(),
            masterSectionProductosVM.LoadVM(),
            masterSectionFinVM.LoadVM()
        ).done(function () {
            // Todas las funciones LoadVM se han completado, ahora proceder con facSelling.ConseguirSellingPorId
            if (self.sellingId() != Guid.Empty) {
                facSelling.ConseguirSellingPorId(self.sellingId()).done(function (selling) {
                    
                    $("#btnEliminarSelling").show();

                    masterSectionDatosGeneralesVM.EditVM(selling);
                    masterSectionSellingVM.EditVM(selling);
                    masterSectionProductosVM.EditVM(selling);
                    masterSectionFinVM.EditVM(selling);

                    masterSectionDatosGeneralesVM.load(true);
                    
                });
            };
        });
    };

    self.botonGuardar = function () {
        facSelling.GuardarSelling(GetSelling()).done(function (sellingId) {
            Command: toastr["success"]("Selling se guardo correctamente.", "Éxito");

            setTimeout(function () {
                $("#btnGuardar").show();
                $("#btnProcesando").hide();

                BotonCancelar();
            }, 100);
        }).fail(function () {
            $("#btnGuardar").show();
            $("#btnProcesando").hide();
        });
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
                    title: "Estás seguro/a?",
                    text: "No podrás revertir esto!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar selling!",
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: true
                })
            .then(function (result) {
                if (result.value) {
                    facSelling.EliminarSelling({ SellingId: self.sellingId(), Nombre: masterSectionDatosGeneralesVM.nombre() }).done(function () {
                        Swal.fire(
                            "Eliminado",
                            "Selling se ha eliminado correctamente.",
                            "success"
                        ).then(function () {
                            BotonCancelar(); // Se ejecuta después de dar OK
                        });
                    });
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        "Cancelado",
                        "Tú selling está seguro :)",
                        "error"
                    );
                }
            });
    };

    self.Initialize = function (sellingId, callback) {
        self.LoadVM(sellingId)
        self.callback(callback);

        $("#modalCrearSelling").modal("show");
    }

    self.buttonSeleccionarTab = function (posicionFutura) {
        SeleccionarTab(posicionFutura);
    };

    function GetSelling() {
        var sellingSelling = masterSectionSellingVM.GetSelling();
        var sellingProductos = masterSectionProductosVM.GetProductos();

        var selling = {
            SellingId: self.sellingId(),
            Nombre: masterSectionDatosGeneralesVM.nombre(),
            Habilitado: masterSectionDatosGeneralesVM.habilitado(),
            FechaInicio: masterSectionDatosGeneralesVM.fechaInicio(),
            FechaFin: masterSectionDatosGeneralesVM.fechaFin(),
            Descripcion: masterSectionDatosGeneralesVM.descripcion(),
            TipoSelling: masterSectionSellingVM.tipoSellingList().find(function (tipoSelling) {
                return tipoSelling.Check();
            }).TipoSelling(),
            Configuracion: JSON.stringify({ SellingSelling: sellingSelling, SellingProductos: sellingProductos })
        };

        return selling;
    };
};




$(document).ready(function () {

    masterCrearSellingVM = new CrearSellingVM();
    ko.applyBindings(masterCrearSellingVM, document.getElementById('CrearSelling'));
   
});


var posicionBarra = 1;

function SeleccionarTab(posicionFutura) {
    if (ValidarPorPosicion(posicionBarra, posicionFutura)) {
        switch (posicionBarra) {
            case 1:
                //Activar Tab Datos Generales
                $("#SectionDatosGeneralesTab").addClass("active").children().addClass("greenImportant");
                $("#SectionDatosGeneralesPanel").addClass("active show");
                break;
            case 2:
                //Activar Tab Selling
                $("#SectionSellingTab").addClass("active").children().addClass("greenImportant");
                $("#SectionSellingPanel").addClass("active show");
                break;
            case 3:
                //Activar Tab Productos
                $("#SectionProductosTab").addClass("active").children().addClass("greenImportant");
                $("#SectionProductosPanel").addClass("active show");
                break;
            case 4:
                //Activar Tab Fin
                $("#SectionFinTab").addClass("active").children().addClass("greenImportant");
                $("#SectionFinPanel").addClass("active show");
                break;
        };
    };
};

function ValidarPorPosicion(posicionActual, posicionFutura) {
    $(".nav-link, .tab-pane").removeClass("active show").children().removeClass("greenImportant");

    var validacion = true;
    var form = null;
    var camposIncompletos = [];

    while (posicionActual < posicionFutura) {
        switch (posicionActual) {
            case 1:
                //Valido Datos Generales
                form = $("#formValidarSectionDatosGenerales");
                camposIncompletos = [];

                form.find("[required]").each(function () {
                    if (!$(this).val()) {
                        camposIncompletos.push(this);
                    };
                });

                if (camposIncompletos.length > 0) {
                    $("#SectionDatosGeneralesTab").addClass("active").children().addClass("greenImportant");
                    $("#SectionDatosGeneralesPanel").addClass("active show");

                    validacion = false;
                };
                break;
            case 2:
                //Valido Selling
                form = $("#formValidarSectionSelling");
                camposIncompletos = [];

                form.find("[required]").each(function () {
                    if (!$(this).val()) {
                        camposIncompletos.push(this);
                    };
                });

                if (camposIncompletos.length > 0) {
                    $("#SectionSellingTab").addClass("active").children().addClass("greenImportant");
                    $("#SectionSellingPanel").addClass("active show");

                    validacion = false;
                };
                break;
            case 3:
                //Validar Productos
                form = $("#formValidarSectionProductos");
                camposIncompletos = [];

                form.find("[required]").each(function () {
                    if (!$(this).val()) {
                        camposIncompletos.push(this);
                    };
                });

                if (camposIncompletos.length > 0) {
                    ValidarProductos();
                };

                if (!masterSectionProductosVM.productosVinculadosList().length) {
                    Command: toastr["info"]("Debe sincronizar al menos un producto.", "Información");
                    ValidarProductos();
                };

                function ValidarProductos() {
                    $("#SectionProductosTab").addClass("active").children().addClass("greenImportant");
                    $("#SectionProductosPanel").addClass("active show");

                    validacion = false;
                };
                break;
            case 4:
                //Validar Fin
                form = $("#formValidarSectionFin");
                camposIncompletos = [];

                form.find("[required]").each(function () {
                    if (!$(this).val()) {
                        camposIncompletos.push(this);
                    };
                });

                if (camposIncompletos.length > 0) {
                    $("#SectionFinTab").addClass("active").children().addClass("greenImportant");
                    $("#SectionFinPanel").addClass("active show");

                    validacion = false;
                };
                break;
        };

        if (!validacion) {
            if (form != null) {
                event.preventDefault();
                event.stopPropagation();

                form.addClass('was-validated');

                $(camposIncompletos[0]).focus();
            };

            posicionFutura = posicionActual;
        } else {
            if (form != null) {
                form.removeClass('was-validated');
            };

            posicionActual += 1;
        };
    };

    posicionBarra = posicionFutura;

    return validacion;
};

function BotonCancelar() {
    var f = masterCrearSellingVM.callback();
    f();
};

function BotonEliminar() {
    masterCrearSellingVM.botonEliminar();
};

function BotonGuardar() {
    $("#btnGuardar").hide();
    $("#btnProcesando").show();

    var posicion = posicionBarra;

    if (ValidarPorPosicion(1, 4)) {
        SeleccionarTab(posicion);
        masterCrearSellingVM.botonGuardar();
    } else {
        $("#btnGuardar").show();
        $("#btnProcesando").hide();
    };
};





