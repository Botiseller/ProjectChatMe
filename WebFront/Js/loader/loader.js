$.ajaxSetup({
    beforeSend: function (jqXHR, textStatus) {
        if (textStatus.type == "POST" || textStatus.loader) {
            $("#divValidarForm").hide();
            $("#divEnProceso").show();
        };
    },
    complete: function (jqXHR, textStatus) {
        $("#divValidarForm").show();
        $("#divEnProceso").hide();
    },
    error: function (jqXHR, textStatus, errorThrow) {
        if (errorThrow == "abort")
            return null;
        try {
            var objectMsj = JSON.parse(jqXHR.responseText);
            var obj = JSON.parse(objectMsj.Message);

            switch (parseInt(obj.Tipo)) {
                case 0:
                    //No tiene
                    Command: toastr["error"](obj.Mensaje, obj.Titulo);
                    break;
                case 1:
                    //Error
                    Command: toastr["error"](obj.Mensaje, obj.Titulo);
                    break;
                case 2:
                    //Info
                    Command: toastr["info"](obj.Mensaje, obj.Titulo);
                    break;
                case 3:
                    //Avertencia
                    Command: toastr["warning"](obj.Mensaje, obj.Titulo);
                    break;
                default:
                    break;
            };
        } catch (e) {
            if (objectMsj == undefined) {
                Command: toastr["error"]("Internal Server Error", "Error");
            } else {
                Command: toastr["error"](objectMsj.Message, "Error");
            };
        };
    }
});