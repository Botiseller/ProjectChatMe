var facArchivos = new FactoryArchivos();
var facCampanias = new FactoryCampanias();
var facCrm = new FactoryCrm();
var facIA = new FactoryIA();
var facSegmentos = new FactorySegmentos();
var facShared = new FactoryShared();
var facSelling = new FactorySelling();

var localLeadId = null;
var localLeadNombre = "";

$(document).ready(function () {
    /*Control Buscador Leads*/
    $(".select-control-buscarLeads").select2(
        {
            ajax:
            {
                url: '/Shared/ConseguirBusquedaGeneral',
                dataType: 'json',
                type: 'get',
                delay: 250,
                data: function (params) {
                    return {
                        textoBusqueda: params.term.replace(/\s+/gi, ' ').trim().replace(/\s/g, "+"),
                        tipoBusquedaGeneral: new Enums().TipoBusquedaGeneral.leads,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    //parse the results into the format expected by Select2
                    $.each(data.Leads, function (i, item) {
                        item.id = item.LeadId;
                        item.full_name = item.Nombre + ' ' + item.Apellido;

                        localLeadId = item.LeadId;
                        localLeadNombre = item.Nombre + ' ' + item.Apellido;
                    });

                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;

                    return {
                        results: data.Leads,
                        pagination:
                        {
                            more: (params.page * 30) < data.Leads.length
                        }
                    };
                },
                cache: true
            },
            placeholder: 'Buscar leads...',
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 3,
            allowClear: true,
            templateResult: formatRepoLeads,
            templateSelection: formatRepoSelection
        });
    /* Fin Control Buscador Leads */


    function formatRepoLeads(repo) {
        if (repo.loading) {
            return repo.text;
        };

        var imagen = "";

        if (repo.Imagen == null || repo.Imagen == "") {
            imagen = "<div class='select2-result-repository__avatar mr-2'><span class='iconoAvatar iconoAvatarSmall " + repo.Nombre.charAt(0).toLocaleLowerCase() + "' style='display: block;'>" + repo.Nombre.charAt(0).toLocaleUpperCase() + repo.Apellido.charAt(0).toLocaleUpperCase() + "</span></div>";
        } else {
            imagen = "<div class='select2-result-repository__avatar mr-2'><img src='" + repo.Imagen + "' class='width-2 height-2 mt-1 rounded' /></div>";
        };

        var markup = "<div class='select2-result-repository clearfix d-flex'>" +
            imagen +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title fs-lg fw-500'>" + repo.full_name + "</div>";



        markup += "<div class='select2-result-repository__statistics d-flex fs-sm'>" +
            "<div class='select2-result-repository__forks mr-2'><i class='fal fa-envelope' style='color:darkorange;'></i> " + repo.Mail + "</div>" +
            "</div>" +
            "</div></div>";

        return markup;
    };

    function formatRepoSelection(repo) {
        return repo.full_name || repo.text;
    };

    $(".select-control").select2();

    $(".select-control-buscarLeadsChange").change(function (event) {
        $("#" + event.target.id).prev().children("div.buscarLeadsChange").remove()

        if ($("#" + event.target.id).val() !== null) {
            $("#" + event.target.id).prev().append("<div class='dropdown buscarLeadsChange float-right ml-1' style='height: 0px;'>" +
                "<a href='#' class='waves-effect waves-themed has-tooltip' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='Opciones del Lead'>" +
                "<i class='fal fa-angle-down'></i>" +
                "</a>" +
                "<div class='dropdown-menu fadeindown pt-0'>" +
                "<div class='dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top' style='padding: 10px!important;'>" +
                "<div class='d-flex flex-row align-items-center mt-1 mb-1 color-white'>" +
                "<div class='info-card-text'>" +
                "<div class='fs-lg text-truncate text-truncate-lg'>Acciones</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<a class='dropdown-item' onclick='ButtonAgregarTicket();'><i class='fal fa-tired' style='margin-right:10px; '></i>Agregar ticket</a>" +
                "<a class='dropdown-item' onclick='ButtonAgregarCalendario();'><i class='fal fa-calendar-alt' style='margin-right: 10px;'></i>Agregar cita en el calendario</a>" +
                "<div class='dropdown-divider m-0'></div>" +
                "<a class='dropdown-item' onclick='ButtonAgregarTarea();'><i class='fal fa-tasks' style='margin-right: 10px;'></i>Agregar tarea</a>" +
                "<a class='dropdown-item' onclick='ButtonAgregarCall();'><i class='fal fa-phone' style='margin-right: 10px;'></i>Registrar llamado</a>" +
                "</div>" +
                "</div>");
        };
    });

    $('.datepicker-bottom-left').datepicker({
        language: 'es',
        format: "dd/mm/yyyy",
        orientation: "bottom left",
        todayHighlight: true,
        autoclose: true,
        showAnim: 'slideDown',
        clearBtn: true,
        templates: {
            leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
            rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
        }
    });

    $('.datepicker-top-left').datepicker({
        language: 'es',
        format: "dd/mm/yyyy",
        orientation: "top left",
        todayHighlight: true,
        autoclose: true,
        showAnim: 'slideDown',
        clearBtn: true,
        templates: {
            leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
            rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
        }
    });
});

function SetInitialValueSelect(control, object) {
    $(control).append($('<option>', {
        value: object.id,
        text: object.text
    }));
    control.trigger("change");

    localLeadId = object.id;
    localLeadNombre = object.text;
};

function SetInitialLeadSelect(control, lead) {
    if (lead != null && lead != undefined) {
        SetInitialValueSelect(control, { id: lead.LeadId, text: (lead.Nombre == null ? '' : lead.Nombre) + ' ' + (lead.Apellido == null ? '' : lead.Apellido) });
    };
};


function DecodeMessageEmoji(message) {
    var regex = /&#(\d+);/g;

    // Reemplaza los emojis con sus representaciones de emoji
    var textoConEmojisReemplazados = message.replace(regex, function (match, code) {
        var emoji = String.fromCodePoint(parseInt(code, 10));
        return emoji;
    });

    return textoConEmojisReemplazados;
};

function EncodeMessageEmoji(message) {
    $.each($('.emoji'), function (i, o) {
        message = message.replaceAll($(o).html(), "&#" + $(o).attr("data-emoji-code").replace(' ', '').replace('amp', '&') + ";");
    });

    var msgEncoded = encodeURIComponent(message);
    return msgEncoded;
};

function InitEmoji() {
    $('[data-emoji] div.emoji').click(function (i) {
        var ico = i.target.innerHTML;
        var dataEmoji = $($(i.target).closest("[data-emoji]")[0]).attr('data-emoji');
        var inputElement = $('[data-input-value=' + dataEmoji + ']')[0]

        var dataBindAttribute = inputElement.getAttribute("data-bind");
        var match = dataBindAttribute.match(/value:\s*([^;]+)/);
        if (!match) { match = dataBindAttribute.match(/textInput:\s*([^;]+)/); };

        if (match) {
            var viewModel = ko.dataFor(inputElement);
            var valorObservable = viewModel;
            var partes = match[1].split(".");
            for (var i = 0; i < partes.length; i++) {
                if (i < partes.length - 1) {
                    if (partes[i].includes('()')) {
                        valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')]();
                    };
                } else {
                    valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')];
                };
            };

            var valueText = valorObservable() != 'undefined' && valorObservable() != null ? valorObservable() : '';
            valorObservable(valueText + ' ' + ico + ' ');
            $('.emoji-container').parent().removeClass('show');
            SeleccionarCursor(inputElement.id, valorObservable().length);
        };
    });
};

function InitVarConsts(variablesConsts) {
    var divConClase = $('.varsConst-ico');
    var input = divConClase.parent().find('input[type="text"]');
    var textArea = divConClase.parent().find('textarea');

    $.when(facIA.ConseguirVariables(), facIA.ConseguirConstantes()).done(function (dataVariables, dataConstantes) {
        $.each(dataVariables[0], function (i, o) {
            variablesConsts.push({ name: o.Nombre, type: 'var', valorClave: '${' + o.Nombre.trim() + '}', id: o.VariableId });
        });

        $.each(dataConstantes[0], function (i, o) {
            variablesConsts.push({ name: o.Nombre, type: 'const', valorClave: '${' + o.Nombre.trim() + '}', id: o.ConstanteId });
        });

        // Ordenar y asignar a variablesConsts
        variablesConsts(Enumerable.From(variablesConsts()).OrderBy(function (x) { return x.name; }).ToArray());

        if (input.length) {
            input.searchList({
                list: variablesConsts().map(function (v) { return v.name; }),
                match: /^\$/,
            });
        };

        if (textArea.length) {
            textArea.searchList({
                list: variablesConsts().map(function (v) { return v.name; }),
                match: /^\$/,
            });
        };

        $('[data-varsConst] button.btnVarConsts').click(function (i) {
            var varData = i.target.parentElement.getAttribute("data-value") != undefined ? i.target.parentElement.getAttribute("data-value") : "";
            var dataVarConsts = $($(i.target).closest("[data-varsConst]")[0]).attr('data-varsConst');
            var inputElement = $('[data-input-value=' + dataVarConsts + ']')[0];

            var dataBindAttribute = inputElement.getAttribute("data-bind");
            var match = dataBindAttribute.match(/value:\s*([^;]+)/);

            if (!match) { match = dataBindAttribute.match(/textInput:\s*([^;]+)/); };

            if (match) {
                var viewModel = ko.dataFor(inputElement);
                var valorObservable = viewModel;
                var partes = match[1].split(".");

                for (var i = 0; i < partes.length; i++) {
                    if (i < partes.length - 1) {
                        if (partes[i].includes('()')) {
                            valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')]();
                        };
                    } else {
                        valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')];
                    };
                };

                var valueText = valorObservable() != 'undefined' && valorObservable() != null ? valorObservable() : '';

                valorObservable(valueText + varData);
                $('.varsConst-container').parent().removeClass('show');

                SeleccionarCursor(inputElement.id, valorObservable().length)
            };
        });

        initApp.listFilter($('[data-filter-variable=filter-action-mensaje] .filter-content'), $('[data-filter-variable=filter-action-mensaje] input.filter-search'));
    });
};

(function ($) {
    $.fn.searchList = function (options) {
        var o = {
            match: /^\$/,
            list: [],
            observable: null
        };

        p = $.extend({}, o, options);

        return this.each(function () {
            // Realiza acciones personalizadas en cada elemento del conjunto jQuery
            var e = this;
            var elemento = $(e);

            function search() {
                var valorInput = elemento.val();
                var palabras = valorInput.split(' '); // Divide el valor del input en palabras
                var ultimaPalabra = palabras[palabras.length - 1]; // Obtiene la última palabra

                // Verifica si la última palabra comienza con el patrón
                if (p.match.test(ultimaPalabra)) {
                    var coincidencias = [];

                    var palabraSinCaracterEspecial = ultimaPalabra.replace(p.match, '');


                    p.list.forEach(function (item) {
                        if (item.toUpperCase().startsWith(palabraSinCaracterEspecial.toUpperCase())) {
                            coincidencias.push(item);
                        };
                    });

                    showResult(coincidencias);
                } else {
                    $('.note-hint-popover').remove();
                };
            };

            function showResult(coincidencias) {
                // Limpia el contenido del div de resultados
                $('.note-hint-popover').remove();
                if (coincidencias.length > 0) {
                    var resultadoDiv = $('<div class="note-popover popover in note-hint-popover"><div class="popover-content note-children-container"> <div class="note-hint-group note-hint-group-0"></div></div></div>)');

                    coincidencias.forEach(function (item) {
                        var elementoLista = $('<div class="note-hint-item">' + item + '</div>');

                        // Agrega un evento de clic para la selección y el alert
                        elementoLista.on('click', function () {
                            selectResult(item);
                            resultadoDiv.hide(); // Oculta el div de resultados después de la selección
                        });

                        resultadoDiv.find('.note-hint-group').append(elementoLista);
                    });

                    // Muestra el div de resultados
                    elemento.parent().append(resultadoDiv);
                    resultadoDiv.show();
                };;
            }

            function selectResult(input) {
                var palabras = elemento.val().split(' ');

                palabras.pop();

                var text = palabras.join(' ') + ' ${' + input + '} ';

                if (p.observable != null) {
                    p.observable(text);
                    //SeleccionarCursor(elemento.attr('id'), valorObservable().length);
                } else {
                    //trata de buscar un observable
                    var dataBindAttribute = elemento.attr("data-bind");
                    var match = dataBindAttribute.match(/textInput:\s*([^;]+)/);
                    if (!match) { match = dataBindAttribute.match(/value:\s*([^;]+)/); }

                    if (match) {
                        var viewModel = ko.dataFor(e);
                        var valorObservable = viewModel;
                        var partes = match[1].split(".");
                        for (var i = 0; i < partes.length; i++) {


                            if (i < partes.length - 1) {
                                if (partes[i].includes('()')) {
                                    valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')]();
                                }
                            } else {
                                valorObservable = valorObservable[partes[i].replace('(', '').replace(')', '')];
                            };
                        };
                        valorObservable(text);
                    };
                };
            };

            // Agrega un evento de escucha al input para buscar coincidencias en tiempo real
            elemento.on('input', search);
        });
    };
})(jQuery);

(function ($) {
    $.fn.selectVariable = function (options) {
        console.log(this);
    };
})(jQuery);


