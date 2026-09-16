function CampaniaBannerVM() {
    var self = this;

    self.visibleTipoCampania = ko.observable(false);

    self.campaniaPublicidad = ko.observable(null);
    self.tipoCampania = ko.observable();

    self.visibleAgregar = ko.observable(false);

    self.imagen = ko.observable(new modelFile());

    self.url = ko.observable();

    self.botonAgregar = function (campaniaPublicidad) {
        self.tipoCampania().Validar(true);

        if (self.campaniaPublicidad() != null) {
            self.url(self.campaniaPublicidad().Url);
            $("#eg-dark-theme-banner")[0]['data-froala.editor'].html.set(self.campaniaPublicidad().BannerCode);
        } else {
            self.url(sessionData.WebUrlCampaignPublic + "/Campanias/Banner/" + sessionData.TokenId + "#code/" + masterCrearCampaniasVM.codigoCampania());
            $("#eg-dark-theme-banner")[0]['data-froala.editor'].html.set("");
        };

        self.visibleAgregar(true);
    };

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesBanner();
    };

    function GetCampaniasPublicidadesBanner() {
        var campaniaPublicidadBanner = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaBanner,
            BannerCode: encodeURIComponent($("#eg-dark-theme-banner")[0]['data-froala.editor'].html.get()),
            Url: self.url()
        };

        return campaniaPublicidadBanner;
    };
};


$(document).ready(function () {
    ko.bindingHandlers.froala = {
        init: function (element, valueAccessor) {
            var editor = new FroalaEditor(element, {
                //toolbarButtons: ['insertFiles', 'bold' ]
                theme: 'dark',
                height: 200,
                placeholderText: 'Cuerpo',
                charCounterMax: 8000,
                imageUploadMethod: 'POST',
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                fontSize: ['8', '9', '10', '11', '12', '13', '14', '16', '18', '20', '22', '24', '30', '34', '38', '42', '50', '56', '62', '68', '74', '82'],
                events: {
                    'image.beforeUpload': function (images) {
                        var reader = new FileReader();
                        var addFileControl = images[0];

                        reader.onload = function () {
                            var array = masterCampaniaBannerVM.imagen().arrayBufferToBase64(this.result);

                            if (array != false) {
                                var guid = Guid.NewGuid();

                                masterCampaniaBannerVM.imagen().addFile(addFileControl.name, this.result, addFileControl.type, array, null, guid);
                            };
                        };
                        reader.readAsArrayBuffer(images[0]);
                    },
                    'image.inserted': function ($img) {
                        //facWebs.GuardarImagen(GetArchivos()).done(function (urlImage) {
                        //    $img[0].src = urlImage;
                        //});
                    },
                    'image.replaced': function ($img) {
                        //facWebs.GuardarImagen(GetArchivos()).done(function (urlImage) {
                        //    $img[0].src = urlImage;
                        //});
                    },
                    'image.removed': function ($img) {
                        //facWebs.EliminarImagen({ ArchivoPath: $img[0].src }).done(function () {
                        //});
                    },
                },
                //imageMaxSize: 5 * 1024 * 1024
            });
        }
    };

    masterCampaniaBannerVM = new CampaniaBannerVM();
    ko.applyBindings(masterCampaniaBannerVM, document.getElementById('CampaniaBanner'));   
});


