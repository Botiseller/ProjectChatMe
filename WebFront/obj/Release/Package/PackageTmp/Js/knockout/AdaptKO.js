var windowURL = window.URL || window.webkitURL;

//************************************ DATEPIKER ************************************//
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor.get('datepickerOptions') || {
            locale: 'es',
            useCurrent: false,
            format: 'DD/MM/YYYY',
            viewMode: 'days',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        };
        $(element).datepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            //alert(valueAccessor());
            if (ko.isObservable(value) && event.date) {
                value(event.date.format('DD/MM/YYYY'));
            }
            else if (ko.isObservable(value) && !event.date) {
                value(null)
            }
        });
    },
    update: function (element, valueAccessor) {
        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            widget.setValue();
        }
    }
};
//************************************ DATEPIKER ************************************//

//************************************ DATETIMEPIKER ************************************//
ko.bindingHandlers.datetimepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor.get('datepickerOptions') || {
            locale: 'es',
            useCurrent: false,
            format: 'DD/MM/YYYY H:mm',
            viewMode: 'days',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        };
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            //alert(valueAccessor());
            if (ko.isObservable(value) && event.date) {
                value(event.date.format('DD/MM/YYYY H:mm'));
            }
            else if (ko.isObservable(value) && !event.date) {
                value(null)
            }
        });
    },
    update: function (element, valueAccessor) {
        var widget = $(element).data("datetimepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            widget.setValue();
        }
    }
};
//************************************ DATETIMEPIKER ************************************//

//************************************ ARCHIVOS ************************************//
ko.bindingHandlers.file = {
    init: function (element, valueAccessor) {
        $(element).change(function () {
            var file = this.files[0];
            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();

        if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
            var oldUrl = bindings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            bindings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
            if (!file) {
                bindings.fileBinaryData(null);
            } else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    bindings.fileBinaryData(e.target.result);
                };
                reader.readAsArrayBuffer(file);
            }
        }
    }
};

var imageListModel = function () {
    var self = {};

    var slotModel = function () {
        var that = {};

        that.imageFile = ko.observable();
        that.imageObjectURL = ko.observable();
        that.imageBinary = ko.observable();

        that.fileSize = ko.computed(function () {
            var file = this.imageFile();
            return file ? file.size : 0;
        }, that);

        that.firstBytes = ko.computed(function () {
            if (that.imageBinary()) {
                var buf = new Uint8Array(that.imageBinary());
                var bytes = [];
                for (var i = 0; i < Math.min(10, buf.length) ; ++i) {
                    bytes.push(buf[i]);
                }
                return '[' + bytes.join(', ') + ']';
            } else {
                return '';
            }
        }, that);

        return that;
    };

    self.beforeRemoveSlot = function (element, index, data) {
        if (data.imageObjectURL()) {
            windowURL.revokeObjectURL(data.imageObjectURL());
        }
        $(element).remove();
    };

    self.images = ko.observableArray([slotModel()]);

    self.addSlot = function () {
        self.images.push(slotModel());
    };

    self.removeSlot = function (data) {
        self.images.remove(data);
    };

    return self;
}();

//************************************ ARCHIVOS ************************************//

/**************************MASK*************************************************************/

var formatNumber = function (element, valueAccessor, allBindingsAccessor, format) {
    // Provide a custom text value
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var numeralFormat = allBindingsAccessor.numeralFormat || format;
    var strNumber = ko.utils.unwrapObservable(value);
    if (strNumber) {
        return numeral(strNumber.replace(',', '.')).format(numeralFormat);
    }
    return numeral('0.00').format(numeralFormat);
}

ko.bindingHandlers.Mask = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0[.]00)"));

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).val());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0[.]00)"));
    }
};

ko.bindingHandlers.formatDecimalText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (valueAccessor() != undefined) {
            var valor = parseFloat(valueAccessor());
            if (!isNaN(valor))
                $(element).text(ConvertNumberWithSeparator(valor));
            else
                $(element).text(valueAccessor());
        }

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).html());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if (valueAccessor() != undefined) {
            var valor = parseFloat(valueAccessor());
            if (!isNaN(valor))
                $(element).text(ConvertNumberWithSeparator(parseFloat(valueAccessor())));
            else
                $(element).text(valueAccessor());
        }
    }
};

//Funcion Enter
ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};