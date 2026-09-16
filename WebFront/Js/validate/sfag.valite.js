Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});

function validate() {
    var c = $('[required]');
    var r = true;
    $.each(c, function (i, control) {
        if ($(control).val() == null || $(control).val() == '') {
            $(control).attr('data-toggle', 'tooltip')
            $(control).attr('data-placement', 'top')
            $(control).attr('title', 'Debe completar el dato para cotinuar')
            if (r) { $(control).tooltip('show') };
            r = false
        }
    })

    //$('[data-toggle="tooltip"]').tooltip()
    return r;
}

(function ($) {
    String.prototype.replaceAll = function (oldChar, newChar) {
        var word = this.toString();
        while (word.indexOf(oldChar) != -1) {
            word = word.replace(oldChar, newChar)
        }
        return word;
    }

    function getDecimalSimbol() {
        var n = 2.1;
        n = n.toLocaleString().substring(1, 2);
        return n;
    }

    function getSeparetorGroupingSimbol() {
        var n = 2.1;
        n = n.toLocaleString().substring(1, 2);
        var dig = '';
        if (n == '.') { dig = ',' }
        if (n == ',') { dig = '.' }
        return dig;
    }

    Number.prototype.parseDecimal = function () {
        var num = this.toString();
        var simbol = getDecimalSimbol();
        if (simbol == ',') {
            num = num.replaceAll(',', '');
            num = num.replaceAll('.', ',');
        }

        if (simbol == '.') {
            num = num.replaceAll('.', '');
            num = num.replaceAll(',', '.');
        }
        return num;
    }

    String.prototype.parseDecimal = function () {
        var num = this.toString();
        var simbol = getDecimalSimbol();
        if (simbol == ',') {
            num = num.replaceAll(',', '');
            num = num.replaceAll('.', ',');
        }

        if (simbol == '.') {
            num = num.replaceAll('.', '');
            num = num.replaceAll(',', '.');
        }
        return num;
    }

    $.fn.QstomValidate = function (pObj) {
        var iObj = {
            title: 'Debe completar el dato para cotinuar',
            placement: 'top',
            autoShow: false,
            eventName: ''
        }

        $.extend(iObj, pObj);
        var self = $(this);

        if (this.tagName == 'SELECT') {
            self = element.parent().find('div.chosen-container')
        }

        self.attr('required', 'required');
        if (iObj.eventName != '') {
            self.attr(iObj.eventName, iObj.eventName);
        }
        else {
            self.attr('GlobalValidate', 'GlobalValidate');
        }
        self.attr('data-placement', iObj.placement);
        self.attr('title', iObj.title);
    }

    $.validateqs = function () {
        var Count = 0;
        var resultValidate = {
            valid: false,
            arrayDomHasError: []
        }
        $('[GlobalValidate]').each(function () {
            var result = $(this).triggerHandler('Qstom.validate');
            if (result.hasError) { Count++; resultValidate.arrayDomHasError.push(result.idDom); }
        });
        resultValidate.arrayDomHasError = resultValidate.arrayDomHasError.unique();
        resultValidate.valid = (Count == 0);
        return resultValidate;
    }

    $.preValidateqs = function (eventName) {
        var Count = 0;
        var resultValidate = {
            valid: false,
            arrayDomHasError: []
        }
        $('[' + eventName + ']').each(function () {
            var result = $(this).triggerHandler('Qstom.' + eventName);
            if (result.hasError) { Count++; resultValidate.arrayDomHasError.push(result.idDom); }
        });
        resultValidate.arrayDomHasError = resultValidate.arrayDomHasError.unique();
        resultValidate.valid = (Count == 0);
        return resultValidate;
    }

    $.validateCuit = function (cuit) {
        cuit = cuit.toString().replaceAll('-', '')
        if (cuit.length != 11) { return false }
        var mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

        var total = 0;
        for (var i = 0; i < mult.length; i++) {
            total += parseInt(cuit[i].toString()) * mult[i];
        }
        var resto = total % 11;
        //resto == 0 ? resto = 0 : resto == 1 ? resto = 9 : resto = 11 - resto;
        if (resto == 0)
            resto = 11;
        return (11 - resto) == cuit[10];
    }
})(jQuery);

function QstomValidateCombo(valueCombo, texto) {
    if (valueCombo == null) {
        $('#showWarningMessage').showNotify({ MessageText: '<em class="fa fa-info" style="margin-right:20px"></em>' + "Completar " + texto });
        return false;
    } else {
        return true;
    }
}

function QstomValidateFecha(valueFecha, texto) {
    if (valueFecha == null || valueFecha == "") {
        $('#showWarningMessage').showNotify({ MessageText: '<em class="fa fa-info" style="margin-right:20px"></em>' + "Completar " + texto });
        return false;
    } else {
        return true;
    }
}

ko.bindingHandlers.QstomValidate = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor.get('ValidateOptions');

        var dOptions = {
            title: 'Debe completar el dato para cotinuar',
            placement: 'top',
            autoShow: false,
            requerido: false,
            idDom: 0,
            requeridoVariable: function () { return true; },
            validateCuit: false,
            AllowZero: false
        };
        $.extend(dOptions, options);
        var value = valueAccessor;
        //if (dOptions.requerido) {
        $(element).QstomValidate(options);

        ko.utils.registerEventHandler(element, "Qstom.validate", function (event) {
            if (!ko.isObservable(value())) {
                value = ko.observable(value);
            }

            if (ko.isObservable(value())) {
                value = value();
                var result = {
                    hasError: true,
                    idDom: dOptions.idDom
                }
                if (((value() == null) || value() == '') && (dOptions.requeridoVariable()) && $(element).attr('disabled') == undefined && dOptions.requerido && !dOptions.AllowZero) {
                    if (element.tagName == 'SELECT') {
                        var child = $(element).parent().find('div.chosen-container');
                        if (child == null || child == undefined) {
                            $(element).tooltip('show');
                        }
                        else {
                            $(child).tooltip('show');
                        }
                    } else {
                        $(element).tooltip('show');
                    }
                    $('#incompletePage').showNotify()
                    return result;
                }
                else {
                    var v = false;
                    if ((value() != null) && (value() != undefined) && (value() != '')) {
                        if (dOptions.validateCuit) {
                            v = !$.validateCuit(value())
                            if (v) { $(element).tooltip('show'); }
                        }
                    }

                    if (v) { $('#incompletePage').showNotify() }
                    result.hasError = v;
                    return result;
                }
            }
        });
    }
}

ko.bindingHandlers.QstomPreValidate = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor.get('ValidateOptions');

        var dOptions = {
            title: 'Debe completar el dato para cotinuar',
            placement: 'top',
            autoShow: false,
            requerido: false,
            idDom: 0,
            eventName: ''
        };

        $.extend(dOptions, options);
        if (dOptions.key == '') { Conosle.log('El desarrollador olvido el eventName en la pre validacion del siguiente elemento'); console.log(element); }

        if (dOptions.requerido) {
            $(element).QstomValidate(options);

            ko.utils.registerEventHandler(element, ('Qstom.' + dOptions.eventName), function (event) {
                var value = valueAccessor();

                if (!ko.isObservable(value())) {
                    value = ko.observable(value);
                }

                if (ko.isObservable(value())) {
                    value = value();
                    var result = {
                        hasError: true,
                        idDom: dOptions.idDom
                    }
                    if ((value() == null) || value() == '') {
                        if (element.tagName == 'SELECT') {
                            var child = $(element).parent().find('div.chosen-container');
                            if (child == null || child == undefined) {
                                $(element).tooltip('show');
                            }
                            else {
                                $(child).tooltip('show');
                            }
                        } else {
                            $(element).tooltip('show');
                        }

                        $(element).tooltip('show');
                        $('#incompletePage').showNotify()
                        return result;
                    }
                    else {
                        result.hasError = false;
                        return result;
                    }
                }
            });
        } else {
            var v = false;
            if (dOptions.validateCuit) {
                v = !$.validateCuit(value())
                if (v) { $(element).tooltip('show'); }
            }

            result.hasError = v;
            return result;
        }
    }
}