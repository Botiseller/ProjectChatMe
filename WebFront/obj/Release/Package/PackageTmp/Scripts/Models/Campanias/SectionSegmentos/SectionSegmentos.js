function SectionSegmentosVM() {
    var self = this;

    self.segmentosList = ko.observableArray([]);
    self.campaniaSegmentoId = ko.observable();

    self.columnasImportacionList = ko.observableArray([]);
    self.datosImportacionList = ko.observableArray([]);
    self.nombreArchivo = ko.observable("Importar");
    self.archivoImportar = ko.observable(null);
    self.showImportacion = ko.observable(false);
    self.ValidFileSegment = ko.observable(true);

    document.querySelector('#fileImportarDatos').addEventListener('change', function () {
        var archivoEvento = document.querySelector('#fileImportarDatos').files[0];

        var reader = new FileReader();

        reader.onload = function () {
            self.nombreArchivo(archivoEvento.name);
            self.archivoImportar(archivoEvento);

            self.ProcesarExcel();
        };

        if (archivoEvento != undefined) {
            reader.readAsArrayBuffer(archivoEvento);
        };
    }, false);

    self.buttonEliminarArchivo = function () {
        self.nombreArchivo("Importar");

        self.datosImportacionList.removeAll();

        self.archivoImportar(null);
        $("#fileImportarDatos").val('');
    };

    self.buttonAgregarSegmento = function () {
        $("#divAgregarSegmento").show();
    };

    self.showImportacionList = function () {
        self.showImportacion(true);
    }

    self.CargarColumnasImportacion = function (variablesList) {
        self.columnasImportacionList.removeAll();

        var columnaNombre = new ColumnaClass();

        columnaNombre.Id("col-Nombre");
        columnaNombre.Columna("Nombre");

        self.columnasImportacionList.push(columnaNombre);

        var tipoCampaniaMail = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) { return x.TipoCampania() == new Enums().TipoCampania.CampaniaMail }).FirstOrDefault();

        if (tipoCampaniaMail.Validar()) {
            var columnaMail = new ColumnaClass();

            columnaMail.Id("col-Mail");
            columnaMail.Columna("Mail");

            self.columnasImportacionList.push(columnaMail);
        };

        var tipoCampaniaTemplate = Enumerable.From(masterSectionCampaniaVM.tipoCampaniasList()).Where(function (x) { return x.TipoCampania() == new Enums().TipoCampania.CampaniaWhatsappTemplate }).FirstOrDefault();

        if (tipoCampaniaTemplate.Validar()) {
            var columnaTelefono = new ColumnaClass();

            columnaTelefono.Id("col-Telefono");
            columnaTelefono.Columna("Telefono");

            self.columnasImportacionList.push(columnaTelefono);

            $.each(variablesList, function (index, variable) {
                var colClass = new ColumnaClass();

                colClass.Id("col-" + variable.Nombre());
                colClass.Columna(variable.Nombre());

                self.columnasImportacionList.push(colClass);
            })
        };

        if (self.archivoImportar() != null) {
            self.ProcesarExcel();
        };
    };
    
    self.ProcesarExcel = function () {
        self.ValidFileSegment(true);
        self.datosImportacionList.removeAll();

        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;

            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            //Fetch the name of First Sheet.
            var firstSheet = workbook.SheetNames[0];

            //Read all rows from First Sheet into an JSON array.
            var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

            if (excelRows.length > 0) {
                var columns = Object.keys(XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet])[0]);



                if (!(self.columnasImportacionList().map(function (x) { return x.Columna().trim().toLowerCase(); }).sort().join('|') === columns.map(function (x) { return x.trim().toLowerCase(); }).sort().join('|'))) {
                    self.ValidFileSegment(false); 
                    self.showImportacion(false);
                    return false;
                }


                //filas del excel
                for (var f = 0; f < excelRows.length; f++) {
                    var parametrosList = ko.observableArray([]);

                    //recorremos las columnas
                    for (var c = 0; c < columns.length; c++) {
                        var columnaNombre = columns[c];

                        var parametro = new ParametrosClass();

                        parametro.ParametroIndex(c);
                        parametro.Parametro(columnaNombre);
                        parametro.Valor((excelRows[f])[columnaNombre]);

                        parametrosList.push(parametro);
                    };

                    self.datosImportacionList.push(parametrosList());
                };

                if (self.datosImportacionList().length > 0) {
                    if (self.datosImportacionList()[0].length != self.columnasImportacionList().length) {
                        self.buttonEliminarArchivo();
                        toastr["error"]("Cantidad de parámetros erróneos a importar", "Importación de datos");
                    };
                };
            };
        };

        reader.readAsBinaryString(self.archivoImportar());
    };

    self.LoadVM = function (campania) {
        /*self.columnasImportacionList.removeAll();*/
        self.datosImportacionList.removeAll();
        self.nombreArchivo("Importar");
        self.archivoImportar(null);
        self.showImportacion(false);
        CrearSegmentosCampaña(Guid.Empty);

        facSegmentos.ConseguirSegmentos().done(function (segmentosList) {
            self.segmentosList.removeAll();
            
            $.each(segmentosList, function (i, campaniaSegmento) {
                
                var segmentoClass = new SegmentosClass();

                segmentoClass.CampaniaSegmentoId(campaniaSegmento.CampaniaSegmentoId);
                segmentoClass.Nombre(campaniaSegmento.Nombre);
                segmentoClass.CampaniasActivas(campaniaSegmento.CampaniasActivas);

                segmentoClass.Descripcion(campaniaSegmento.Descripcion);
                segmentoClass.IncluyeContacto(campaniaSegmento.IncluyeContacto);
                segmentoClass.IncluyeLead(campaniaSegmento.IncluyeLead);
                
                if (isNaN(campaniaSegmento.SegmentoFiltro)) {
                    var segmentoFiltroDto = JSON.parse(jQuery.base64.decode(campaniaSegmento.SegmentoFiltro));
                };

                self.segmentosList.push(segmentoClass);
            });

            if (campania != undefined) {
                self.campaniaSegmentoId(campania.CampaniaSegmentoId);
                $('#select-segmento').trigger("change");
            };
        });
    };

    self.EditVM = function (campania) {
        self.LoadVM(campania);

        $.each(campania.CampaniasSegmentosImportados, function (i, campaniaSegmentoImportado) {
            var variablesDto = JSON.parse(jQuery.base64.decode(campaniaSegmentoImportado.Variables));

            $.each(variablesDto.VariablesList, function (iVariable, variable) {
                var colClass = new ColumnaClass();

                colClass.Id("col-" + variable.Parametro);
                colClass.Columna(variable.Parametro);

                self.columnasImportacionList.push(colClass);
            });

            var parametrosList = ko.observableArray([]);

            $.each(variablesDto.VariablesList, function (iVariable, variable) {
                var parametro = new ParametrosClass();

                parametro.ParametroIndex(iVariable);
                parametro.Parametro(variable.Parametro);
                parametro.Valor(variable.Valor);

                parametrosList.push(parametro);
            });

            self.datosImportacionList.push(parametrosList());
        });
    };

    function SegmentosClass() {
        var me = this;

        me.CampaniaSegmentoId = ko.observable();
        me.Nombre = ko.observable();
        me.CampaniasActivas = ko.observable();
        me.Descripcion = ko.observable();
        me.IncluyeContacto = ko.observable();
        me.IncluyeLead = ko.observable();

       
    };

    function ColumnaClass() {
        var me = this;

        me.Id = ko.observable();
        me.Columna = ko.observable('');
    };

    function ParametrosClass() {
        var me = this;

        me.ParametroIndex = ko.observable();
        me.Parametro = ko.observable('');
        me.Valor = ko.observable('');
    };
};


$(document).ready(function () {
    masterSectionSegmentosVM = new SectionSegmentosVM();
    ko.applyBindings(masterSectionSegmentosVM, document.getElementById('SectionSegmentos'));
});