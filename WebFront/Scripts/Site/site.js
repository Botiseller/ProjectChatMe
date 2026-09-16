$(document).ready(function () {
    $("#btnValidarForm").click(function (event) {
        var form = $("#formValidar");

        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            form.addClass('was-validated');
        } else {
            form.removeClass('was-validated');
        };
        // Perform ajax submit here...
    });

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": 300,
        "hideDuration": 100,
        "timeOut": 5000,
        "extendedTimeOut": 1000,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    $('.has-tooltip').tooltip();

    $(document).ajaxStop(function () {
        $('.has-tooltip').tooltip();
    });

    $("input[required='required']").change(function (control) {
        var valorControl = $(control.target).val().trim();

        if (valorControl == '')
            $(control.target).val("");
    });

    window.setInterval(ConectToServer, 1000 * 60 * 5);

    function ConectToServer() {
        var facAuthentication = new FactoryAuthentication();
        facAuthentication.Ping().done(function (result) {
            console.log(moment().format('HH:mm:SS') + ' - Chat conect: Ping ' + result)
        });
    }

});

function ValidarForumlarios(idBtnValidarForm, idFormValidar, idDivValidarForm, idDivEnProceso) {
    $("#" + idBtnValidarForm).click(function (event) {
        $("#" + idDivValidarForm).hide();
        $("#" + idDivEnProceso).show();

        var form = $("#" + idFormValidar);

        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            $("#" + idDivValidarForm).show();
            $("#" + idDivEnProceso).hide();

            form.addClass('was-validated');
        } else {
            form.removeClass('was-validated');
        };
        // Perform ajax submit here...
    });
};

var Guid = {
    Empty: "00000000-0000-0000-0000-000000000000",
    NewGuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        };
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
};

function LoadFuncionesTableSelect(TablaId) {
    $('#' + TablaId).dataTable({
        responsive: true,
        dom:
            /*	--- Layout Structure
                --- Options
                l	-	length changing input control
                f	-	filtering input
                t	-	The table!
                i	-	Table information summary
                p	-	pagination control
                r	-	processing display element
                B	-	buttons
                R	-	ColReorder
                S	-	Select

                --- Markup
                < and >				- div element
                <"class" and >		- div with a class
                <"#id" and >		- div with an ID
                <"#id.class" and >	- div with an ID and a class

                --- Further reading
                https://datatables.net/reference/option/dom
                --------------------------------------
             */
            "<'row mb-3'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-8 d-flex align-items-center justify-content-end'B>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [
            {
                extend: 'colvis',
                text: 'Columnas visibles',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'csvHtml5',
                text: 'CSV',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'selectAll',
                text: 'Seleccionar todos',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'selectNone',
                text: 'Deseleccionar',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'selectRows',
                text: 'Fila',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'selectColumns',
                text: 'Columna',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'selectCells',
                text: 'Celda',
                className: 'btn-outline-secondary btn-sm'
            }

        ],
        select: true
    });
};

function LoadFuncionesTableModal(TablaId) {
    $('#' + TablaId).dataTable({
        responsive: true,
        pageLength: 6,
        dom:
            /*	--- Layout Structure
                --- Options
                l	-	length changing input control
                f	-	filtering input
                t	-	The table!
                i	-	Table information summary
                p	-	pagination control
                r	-	processing display element
                B	-	buttons
                R	-	ColReorder
                S	-	Select

                --- Markup
                < and >				- div element
                <"class" and >		- div with a class
                <"#id" and >		- div with an ID
                <"#id.class" and >	- div with an ID and a class

                --- Further reading
                https://datatables.net/reference/option/dom
                --------------------------------------
             */
            "<'row mb-3'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-8 d-flex align-items-center justify-content-end'B>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                TitleAttr: 'Generar excel',
                className: 'btn-outline-success btn-sm'
            },
            {
                extend: 'print',
                text: 'Imprimir',
                titleAttr: 'Imprimir tabla',
                className: 'btn-outline-danger'
            }

        ],
        select: true
    });
};

function LoadFuncionesTableBuscadorGeneral(TablaId) {
    $('#' + TablaId).dataTable({
        responsive: true,
        dom:
            /*	--- Layout Structure
                --- Options
                l	-	length changing input control
                f	-	filtering input
                t	-	The table!
                i	-	Table information summary
                p	-	pagination control
                r	-	processing display element
                B	-	buttons
                R	-	ColReorder
                S	-	Select

                --- Markup
                < and >				- div element
                <"class" and >		- div with a class
                <"#id" and >		- div with an ID
                <"#id.class" and >	- div with an ID and a class

                --- Further reading
                https://datatables.net/reference/option/dom
                --------------------------------------
             */
            "<'row mb-3'<'col-sm-12 col-md-4 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-8 d-flex align-items-center justify-content-end'B>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [
            {
                extend: 'colvis',
                text: 'Columnas visibles',
                TitleAttr: 'Mostrar columnas',
                className: 'btn-outline-secondary btn-sm'
            },
            {
                extend: 'excelHtml5',
                text: 'Excel',
                TitleAttr: 'Generar excel',
                className: 'btn-outline-success btn-sm'
            },
            {
                extend: 'print',
                text: 'Imprimir',
                titleAttr: 'Imprimir tabla',
                className: 'btn-outline-danger'
            }

        ],
        select: true
    });
};

function LoadFuncionesTableSelectSimple(TablaId) {
    $('#' + TablaId).dataTable({
        responsive: true,
        //lengthMenu: 1,
        pageLength: 5,
        dom:
            /*	--- Layout Structure
                --- Options
                l	-	length changing input control
                f	-	filtering input
                t	-	The table!
                i	-	Table information summary
                p	-	pagination control
                r	-	processing display element
                B	-	buttons
                R	-	ColReorder
                S	-	Select

                --- Markup
                < and >				- div element
                <"class" and >		- div with a class
                <"#id" and >		- div with an ID
                <"#id.class" and >	- div with an ID and a class

                --- Further reading
                https://datatables.net/reference/option/dom
                --------------------------------------
             */
            "<'row mb-3'<'col-sm-12 col-md-12 d-flex align-items-center justify-content-start'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-12'i><'col-sm-12 col-md-12'p>>",
        select: true
    });
};

function GetTimeFromMins(mins) {
    if (mins <= 60) {
        if (mins == 1) {
            return mins + " minuto";
        };

        return mins + " minutos";
    };

    var hours = Math.floor(mins / 60);
    var minutes = mins % 60;

    if (hours == 1) {
        return hours + " hora y " + (minutes == 1 ? minutes + " minuto" : minutes + " minutos");
    };

    return hours + " horas y " + (minutes == 1 ? minutes + " minuto" : minutes + " minutos");
};

function DescargarArchivo(Archivo, Extension, Nombre) {
    var bytes = new Uint8Array(Archivo);
    var blob = new Blob([bytes], { type: Extension });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = Nombre;
    link.click();
};

function ConvertirNumeroMiles(n) {
    if (ko.isObservable(n)) {
        n = n();
    };

    if (n == null) {
        n = '';
    };

    n = ReplaceAll(n.toString(), '.', ',');
    return GetNumberWithSeparator(n, '.');
};

function ReplaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
};

function GetNumberWithSeparator(n, separator) {
    separator = separator || ",";

    n = n.toString()
        .split("").reverse().join("")
        .replace(/(\d{3})/g, "$1" + separator)
        .split("").reverse().join("");

    if (n[0] == '-' && n[1] == separator) {
        return n.replace(separator, "");
    } else {
        return n[0] == separator ? n.substr(1) : n;
    };
};

Number.prototype.parseDecimal = function () {
    var num = this.toString();
    var simbol = GetDecimalSimbol();
    if (simbol == ',') {
        num = num.replaceAll(',', '');
        num = num.replaceAll('.', ',');
    };

    if (simbol == '.') {
        num = num.replaceAll('.', '');
        num = num.replaceAll(',', '.');
    };

    return num;
};

String.prototype.parseDecimal = function () {
    var num = this.toString();
    var simbol = GetDecimalSimbol();
    if (simbol == ',') {
        num = num.replaceAll(',', '');
        num = num.replaceAll('.', ',');
    };

    if (simbol == '.') {
        num = num.replaceAll('.', '');
        num = num.replaceAll(',', '.');
    };
    return num;
};

String.prototype.replaceAll = function (oldChar, newChar) {
    var word = this.toString();

    while (word.indexOf(oldChar) != -1) {
        word = word.replace(oldChar, newChar)
    };

    return word;
};

function GetDecimalSimbol() {
    var n = 2.1;
    n = n.toLocaleString('ES-ES').substring(1, 2);
    return n;
};

function SeleccionarCursor(idCadenaTexto, pos) {
    var tb = document.getElementById(idCadenaTexto);

    if (typeof document.selection != 'undefined' && document.selection) {
        // IE
        var tex = tb.value;
        tb.value = '';
        tb.focus();
        var str = document.selection.createRange();
        tb.value = tex;
        str.move("character", pos);
        str.moveEnd("character", 0);
        str.select();
    } else if (tb != null && typeof tb.selectionStart != 'undefined') {
        // FF CHROME
        tb.setSelectionRange(pos, pos);
        tb.focus();
    };
};


function PosicionCursor(idCadenaTexto) {
    var tb = document.getElementById(idCadenaTexto);
    var cursor = -1;

    if (document.selection && (document.selection != 'undefined')) {
        // IE
        var _range = document.selection.createRange();
        var contador = 0;
        while (_range.move('character', -1)) {
            contador++;
        };
        cursor = contador;
    } else if (tb != null && tb.selectionStart >= 0) {
        // FF CHROME
        cursor = tb.selectionStart;
    };

    return cursor;
};

function ConvertirFecha(fechaString) {
    var fechaSp = fechaString.split("/");
    var anio = new Date().getFullYear();

    if (fechaSp.length == 3) {
        anio = fechaSp[2];
    };

    var mes = fechaSp[1] - 1;
    var dia = fechaSp[0];

    return new Date(anio, mes, dia);
};

function DiasEntreFechas(fechaDesde, fechaHasta) {
    var dia_actual = fechaDesde;
    var fechas = [];
    while (dia_actual.isSameOrBefore(fechaHasta)) {
        fechas.push(dia_actual.format('DD/MM/YY'));
        dia_actual.add(1, 'days');
    };
    return fechas;
};

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
};

function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
    Math.round10 = function (value, exp) {
        return decimalAdjust('round', value, exp);
    };
};

// Grilla tabla linea de tiempo
function CompletarGrillaDeTiempo(listaItems, GridDate) {
    var max = 0;

    $.each(listaItems, function (i, o) {
        if (o.Count > max) { max = o.Count; }
    });

    $.each(listaItems, function (i, o) {
        var opacity = o.Count / max;

        $('table[data-table-type=' + GridDate + '] tr[serielname=' + o.Day + '] td[data-hour=' + o.Hour + ']').css('background-color', 'rgb(100, 114, 195)');
        $('table[data-table-type=' + GridDate + '] tr[serielname=' + o.Day + '] td[data-hour=' + o.Hour + ']').css('opacity', opacity);
        $('table[data-table-type=' + GridDate + '] tr[serielname=' + o.Day + '] td[data-hour=' + o.Hour + ']').attr('data-placement', 'top');
        $('table[data-table-type=' + GridDate + '] tr[serielname=' + o.Day + '] td[data-hour=' + o.Hour + ']').attr('data-original-title', o.CompleteDay + ' ' + o.Hour + 'hs. Cantidad: ' + o.Count);
        $('table[data-table-type=' + GridDate + '] tr[serielname=' + o.Day + '] td[data-hour=' + o.Hour + ']').tooltip();
    });
};

function CrearGrillasDeTiempo(GridDate) {
    var table = $('table[data-table-type=' + GridDate + ']');

    table.html(' <tr serielname="Dom" data-seriel="1">'
        + ' <td>Domingo</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>'
        + '</tr>'
        + '<tr serielname="Lun" data-seriel="2">'
        + ' <td>Lunes</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>'
        + '</tr>'
        + '<tr serielname="Mar" data-seriel="3">'
        + ' <td>Martes</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>'
        + '</tr>                     '
        + '<tr serielname="Mie" data-seriel="4">'
        + ' <td>Miercoles</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>   '
        + '</tr>'
        + '<tr serielname="Jue" data-seriel="5">'
        + ' <td>Jueves</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>   '
        + '</tr>'
        + '<tr serielname="Vie" data-seriel="6">'
        + ' <td>Viernes</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>'
        + '</tr>'
        + '<tr serielname="Sab" data-seriel="7">'
        + ' <td>Sabado</td>'
        + ' <td data-hour="00"></td>'
        + ' <td data-hour="01"></td>'
        + ' <td data-hour="02"></td>'
        + ' <td data-hour="03"></td>'
        + ' <td data-hour="04"></td>'
        + ' <td data-hour="05"></td>'
        + ' <td data-hour="06"></td>'
        + ' <td data-hour="07"></td>'
        + ' <td data-hour="08"></td>'
        + ' <td data-hour="09"></td>'
        + ' <td data-hour="10"></td>'
        + ' <td data-hour="11"></td>'
        + ' <td data-hour="12"></td>'
        + ' <td data-hour="13"></td>'
        + ' <td data-hour="14"></td>'
        + ' <td data-hour="15"></td>'
        + ' <td data-hour="16"></td>'
        + ' <td data-hour="17"></td>'
        + ' <td data-hour="18"></td>'
        + ' <td data-hour="19"></td>'
        + ' <td data-hour="20"></td>'
        + ' <td data-hour="21"></td>'
        + ' <td data-hour="22"></td>'
        + ' <td data-hour="23"></td>'
        + '</tr>'
        + '<tr serielname="Hours">'
        + ' <td></td>'
        + ' <td data-hour="00">00hs.</td>'
        + ' <td data-hour="01">01hs.</td>'
        + ' <td data-hour="02">02hs.</td>'
        + ' <td data-hour="03">03hs.</td>'
        + ' <td data-hour="04">04hs.</td>'
        + ' <td data-hour="05">05hs.</td>'
        + ' <td data-hour="06">06hs.</td>'
        + ' <td data-hour="07">07hs.</td>'
        + ' <td data-hour="08">08hs.</td>'
        + ' <td data-hour="09">09hs.</td>'
        + ' <td data-hour="10">10hs.</td>'
        + ' <td data-hour="11">11hs.</td>'
        + ' <td data-hour="12">12hs.</td>'
        + ' <td data-hour="13">13hs.</td>'
        + ' <td data-hour="14">14hs.</td>'
        + ' <td data-hour="15">15hs.</td>'
        + ' <td data-hour="16">16hs.</td>'
        + ' <td data-hour="17">17hs.</td>'
        + ' <td data-hour="18">18hs.</td>'
        + ' <td data-hour="19">19hs.</td>'
        + ' <td data-hour="20">20hs.</td>'
        + ' <td data-hour="21">21hs.</td>'
        + ' <td data-hour="22">22hs.</td>'
        + ' <td data-hour="23">23hs.</td>'
        + '</tr>');
};
// Fin Grilla tabla linea de tiempo

function ColorPorLetraNombre(letra) {
    switch (letra.toLocaleLowerCase()) {
        case "a":
            return "rgb(122, 117, 116)";
        case "b":
            return "rgb(0, 120, 212)";
        case "c":
            return "rgb(105, 121, 126)";
        case "d":
            return "rgb(164, 38, 44)";
        case "e":
            return "rgb(202, 80, 16)";
        case "f":
            return "rgb(151, 111, 1)";
        case "g":
            return "rgb(0, 91, 112)";
        case "h":
            return "rgb(92, 46, 145)";
        case "i":
            return "rgb(227, 0, 140)";
        case "j":
            return "rgb(142, 86, 46)";
        case "k":
            return "rgb(0, 78, 140)";
        case "l":
            return "rgb(194, 57, 179)";
        case "m":
            return "rgb(209, 52, 56)";
        case "n":
            return "rgb(122, 117, 116)";
        case "ñ":
            return "rgb(0, 120, 212)";
        case "o":
            return "rgb(105, 121, 126)";
        case "p":
            return "rgb(164, 38, 44)";
        case "q":
            return "rgb(202, 80, 16)";
        case "r":
            return "rgb(151, 111, 1)";
        case "s":
            return "rgb(0, 91, 112)";
        case "t":
            return "rgb(92, 46, 145)";
        case "u":
            return "rgb(227, 0, 140)";
        case "v":
            return "rgb(142, 86, 46)";
        case "w":
            return "rgb(0, 78, 140)";
        case "x":
            return "rgb(194, 57, 179)";
        case "y":
            return "rgb(209, 52, 56)";
        case "z":
            return "rgb(122, 117, 116)";
        default:
            return "";
    }
};

function ColorPorNumero(string) {
    switch (string) {
        case "0":
            return "a";
        case "1":
            return "b";
        case "2":
            return "c";
        case "3":
            return "d";
        case "4":
            return "e";
        case "5":
            return "f";
        case "6":
            return "g";
        case "7":
            return "h";
        case "8":
            return "i";
        case "9":
            return "j";
        default:
            return string;
    };
};

function EsEmoji(str) {
    if (str == null) {
        return false;
    };

    var ranges = [
        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
    ];

    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    };
};

/* -------- Google -------- */
function onSignIn(googleUser) {
    if (sessionData.Usuario.UsuariosGoogleStr == "") {
        var usuarioGoogle = GetUsuarioGoogleDto(googleUser);

        facUsuarios.GuardarUsuarioGoogle(usuarioGoogle).done(function () {
            sessionData.Usuario.UsuariosGoogleStr = JSON.stringify(usuarioGoogle);

            masterUsuarioConfiguracionesVM.IniciarSesionGoogleConfig();
        });
    };
};

function onSignOut() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
        facUsuarios.EliminarUsuarioGoogle(JSON.parse(sessionData.Usuario.UsuariosGoogleStr)).done(function () {
            sessionData.Usuario.UsuariosGoogleStr = "";

            masterUsuarioConfiguracionesVM.CerrarSesionGoogleConfig();
        });
    });
};

function GetUsuarioGoogleDto(googleUser) {
    var profile = googleUser.getBasicProfile();

    var usuarioGoogleDto = {
        UsuarioId: sessionData.Usuario.UsuarioId,
        GoogleId: profile.getId(),
        GivenName: profile.getGivenName(),
        FamilyName: profile.getFamilyName(),
        FullName: profile.getName(),
        ImageUrl: profile.getImageUrl(),
        Email: profile.getEmail(),
        TokenId: googleUser.getAuthResponse().id_token,
        FechaAlta: moment().format("DD/MM/YYYY")
    };

    return usuarioGoogleDto;
};
/* -------------- Fin Google --------------------- */





/* -------------- Copiar --------------------- */
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    };

    document.body.removeChild(textArea);
};

function CopiarUrl(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    };

    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
};
/* -------------- Fin Copiar --------------------- */




function GenerarLetra() {
    var letras = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return letras[numero];
};

function ColorHEX() {
    var coolor = "";
    for (var i = 0; i < 6; i++) {
        coolor = coolor + GenerarLetra();
    };
    return "#" + coolor;
};