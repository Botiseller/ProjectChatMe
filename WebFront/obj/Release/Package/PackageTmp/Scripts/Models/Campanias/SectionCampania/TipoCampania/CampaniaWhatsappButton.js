function CampaniaWhatsappButtonVM() {
    var self = this;

    self.visibleTipoCampania = ko.observable(false);
    self.tipoCampania = ko.observable();
    self.campaniaPublicidad = ko.observable(null);

    self.visibleAgregar = ko.observable(false);

    self.mensaje = ko.observable();

    self.numeroDestino = ko.observable();
    self.codigosPaisesLista = ko.observableArray([]);
    self.codPais = ko.observable();
    self.codCiudad = ko.observable();
    self.telefono = ko.observable();

    self.textoMensajeFijo = ko.observable();
    self.textoMensaje = ko.observable();

    self.botonAgregar = function () {
        self.tipoCampania().Validar(true);

        self.textoMensajeFijo("https://api.whatsapp.com/send?phone=${Telefono}&text=${Mensaje}@C" + masterCrearCampaniasVM.codigoCampania());

        self.mensaje("");

        if (self.codigosPaisesLista().length == 0) {
            self.codigosPaisesLista.removeAll();

            self.CargarCodigosPaises();
        };
       
        /*self.codPais(sessionData.Empresa.CodPais);*/
        $('#select-CodPaises').trigger("change");

        //self.codCiudad(sessionData.Empresa.CodCiudad);
        //self.telefono(sessionData.Empresa.Telefono);


        if (self.campaniaPublicidad() != null) {
            self.codPais(self.campaniaPublicidad().Pais);
            $('#select-CodPaises').trigger("change");

            self.codCiudad(self.campaniaPublicidad().CodigoArea);
            self.telefono(self.campaniaPublicidad().Telefono);
            self.mensaje(self.campaniaPublicidad().Mensajes);
        };

        self.cambiarTelefono();

        self.visibleAgregar(true);
    };

    self.snippetHtml = ko.computed(function () {
        return `
    <!-- START Botón WhatsApp -->
    <div style="position:relative;">

        <a href="${self.textoMensaje()}"
           target="_blank"
           title="WhatsApp"
           style="
               position:absolute;
               bottom:16px;
               right:16px;
               display:inline-flex;
               align-items:center;
               justify-content:center;
               width:56px;
               height:56px;
               background-color:#25D366;
               border-radius:50%;
               text-decoration:none;
               box-shadow:0 4px 10px rgba(0,0,0,0.25);
               cursor:pointer;
               z-index:10;
           ">

            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 32 32"
                 width="34"
                 height="34"
                 fill="#ffffff">
                <path d="M19.11 17.24c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.33-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.72 4.18.66.29 1.17.46 1.57.59.66.21 1.26.18 1.74.11.53-.08 1.61-.66 1.84-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32z"/>
                <path d="M16 2.93c-7.18 0-13 5.82-13 13 0 2.29.6 4.53 1.74 6.51L3 29l6.75-1.77A12.95 12.95 0 0016 28.93c7.18 0 13-5.82 13-13s-5.82-13-13-13zm0 23.7c-2.01 0-3.98-.54-5.7-1.56l-.41-.24-4.01 1.05 1.07-3.9-.27-.4a10.68 10.68 0 01-1.7-5.8c0-5.88 4.79-10.67 10.67-10.67s10.67 4.79 10.67 10.67-4.79 10.67-10.67 10.67z"/>
            </svg>

        </a>

    </div>
    <!-- END Botón WhatsApp -->
    `.trim();
    });

    self.botonCancelar = function () {
        self.tipoCampania().Validar(false);
        self.visibleAgregar(false);
    };

    self.cambiarTelefono = function () {
        var codPais = self.codPais() == undefined ? "" : self.codPais();
        self.numeroDestino(codPais + $("#txtCodCiudad").val() + $("#txtTelefono").val());

        self.cambiarTextoMensaje();
    };

    self.cambiarTextoMensaje = function () {
        self.textoMensaje(self.textoMensajeFijo());

        self.textoMensaje(self.textoMensaje().replace("${Telefono}", self.numeroDestino()).replace("${Mensaje}", $("#txtMensajeButton").val()));
    };

    self.CargarCodigosPaises = function () {
        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Anguilla');
        codPais.Pais('Anguilla');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Antigua Barbuda');
        codPais.Pais('Antigua Barbuda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+54');
        codPais.Descripcion('(+54) Argentina');
        codPais.Pais('Argentina');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+374');
        codPais.Descripcion('(+374) Armenia');
        codPais.Pais('Armenia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+297');
        codPais.Descripcion('(+297) Aruba');
        codPais.Pais('Aruba');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+247');
        codPais.Descripcion('(+247) Islandia');
        codPais.Pais('Islandia');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+61');
        codPais.Descripcion('(+61) Australia');
        codPais.Pais('Australia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+43');
        codPais.Descripcion('(+43) Austria');
        codPais.Pais('Austria');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+994');
        codPais.Descripcion('(+994) Azerbaiyán');
        codPais.Pais('Azerbaiyán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Bahamas');
        codPais.Pais('Bahamas');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+973');
        codPais.Descripcion('Baréin');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+880');
        codPais.Descripcion('(+880) Bangladés');
        codPais.Pais('Bangladés');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Barbados');
        codPais.Pais('Barbados');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+375');
        codPais.Descripcion('(+375) Bielorrusia');
        codPais.Pais('Bielorrusia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+32');
        codPais.Descripcion('(+32) Bélgica');
        codPais.Pais('Bélgica');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+501');
        codPais.Descripcion('(+501)Belice');
        codPais.Pais('Belice');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+229');
        codPais.Descripcion('(+229) Benín');
        codPais.Pais('Benín');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Bermuda');
        codPais.Pais('Bermuda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+975');
        codPais.Descripcion('(+975) Bután');
        codPais.Pais('Bután');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+591');
        codPais.Descripcion('(+591) Bolivia');
        codPais.Pais('Bolivia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+387');
        codPais.Descripcion('(+387) Bosnia y Herzegovina');
        codPais.Pais('Bosnia y Herzegovina');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+267');
        codPais.Descripcion('(+267) Botsuana');
        codPais.Pais('Botsuana');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+55');
        codPais.Descripcion('(+55) Brasil');
        codPais.Pais('Brasil');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+246');
        codPais.Descripcion('(+246) Territorio Británico del Océano Índico');
        codPais.Pais('Territorio Británico del Océano Índico');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Islas Vírgenes Británicas');
        codPais.Pais('Islas Vírgenes Británicas');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+673');
        codPais.Descripcion('(+673) Brunéi');
        codPais.Pais('Brunéi');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+359');
        codPais.Descripcion('(+359) Bulgaria');
        codPais.Pais('Bulgaria');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+226');
        codPais.Descripcion('(+226) Burkina Faso');
        codPais.Pais('Burkina Faso');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+257');
        codPais.Descripcion('(+257) Burundi');
        codPais.Pais('Burundi');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+855');
        codPais.Descripcion('(+855) Camboya');
        codPais.Pais('Camboya');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+237');
        codPais.Descripcion('(+237) Camerún');
        codPais.Pais('Camerún');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Canadá');
        codPais.Pais('Canadá');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+238');
        codPais.Descripcion('(+238) Cabo Verde');
        codPais.Pais('Cabo Verde');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+599');
        codPais.Descripcion('(+599) Caribe Neerlandés');
        codPais.Pais('Caribe Neerlandés');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Islas Caimán');
        codPais.Pais('Islas Caimán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+236');
        codPais.Descripcion('(+236) República Centroafricana');
        codPais.Pais('República Centroafricana');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+235');
        codPais.Descripcion('(+235) Chad');
        codPais.Pais('Chad');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+5');
        codPais.Descripcion('(+5) Chile');
        codPais.Pais('Chile');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+86');
        codPais.Descripcion('(+86) China');
        codPais.Pais('China');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+57');
        codPais.Descripcion('(+57) Colombia');
        codPais.Pais('Colombia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+269');
        codPais.Descripcion('(+269) Comoras');
        codPais.Pais('Comoras');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+242');
        codPais.Descripcion('(+242) Congo - Brazzaville');
        codPais.Pais('Congo - Brazzaville');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+243');
        codPais.Descripcion('(+243) Congo - Kinshasa');
        codPais.Pais('Congo - Kinshasa');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+682');
        codPais.Descripcion('(+682) Islas Cook');
        codPais.Pais('Islas Cook');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+506');
        codPais.Descripcion('(+506) Costa Rica');
        codPais.Pais('Costa Rica');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+225');
        codPais.Descripcion('(+225) Costa de Marfil');
        codPais.Pais('Costa de Marfil');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+385');
        codPais.Descripcion('(+385) Croacia');
        codPais.Pais('Croacia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+53');
        codPais.Descripcion('(+53) Cuba');
        codPais.Pais('Cuba');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+599');
        codPais.Descripcion('(+599) Curaçao');
        codPais.Pais('Curaçao');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+357');
        codPais.Descripcion('(+357) Chipre');
        codPais.Pais('Chipre');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+420');
        codPais.Descripcion('(+420) Chequia');
        codPais.Pais('Chequia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+45');
        codPais.Descripcion('(+45) Dinamarca');
        codPais.Pais('Dinamarca');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+253');
        codPais.Descripcion('(+253) Yibuti');
        codPais.Pais('Yibuti');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) República Dominicana');
        codPais.Pais('República Dominicana');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+593');
        codPais.Descripcion('(+593) Ecuador');
        codPais.Pais('Ecuador');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+20');
        codPais.Descripcion('(+20) Egipto');
        codPais.Pais('Egipto');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+503');
        codPais.Descripcion('(+503) El salvador');
        codPais.Pais('El salvador');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+240');
        codPais.Descripcion('(+240) Guinea');
        codPais.Pais('Guinea');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+291');
        codPais.Descripcion('(+291) Eritrea');
        codPais.Pais('Eritrea');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+372');
        codPais.Descripcion('(+372) Estonia');
        codPais.Pais('Estonia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+268');
        codPais.Descripcion('(+268) Esuatini');
        codPais.Pais('Esuatini');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+251');
        codPais.Descripcion('(+251) Etiopía');
        codPais.Pais('Etiopía');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+500');
        codPais.Descripcion('(+500) Islas Malvinas');
        codPais.Pais('Islas Malvinas');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+298');
        codPais.Descripcion('(+298) Islas Feroe');
        codPais.Pais('Islas Feroe');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+679');
        codPais.Descripcion('(+679) Fiji');
        codPais.Pais('Fiji');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+358');
        codPais.Descripcion('(+358) Finlandia');
        codPais.Pais('Finlandia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+33');
        codPais.Descripcion('(+33) Francia');
        codPais.Pais('Francia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+298');
        codPais.Descripcion('(+298) Islas Feroe');
        codPais.Pais('Islas Feroe');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+679');
        codPais.Descripcion('(+679) Fiji');
        codPais.Pais('Fiji');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+358');
        codPais.Descripcion('(+358) Finlandia');
        codPais.Pais('Finlandia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+33');
        codPais.Descripcion('(+33) Francia');
        codPais.Pais('Francia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+594');
        codPais.Descripcion('(+594) Guyana Francesa');
        codPais.Pais('Guyana Francesa');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+689');
        codPais.Descripcion('(+689) Polinesia Francesa');
        codPais.Pais('Polinesia Francesa');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+241');
        codPais.Descripcion('(+241) Gabón');
        codPais.Pais('Gabón');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+220');
        codPais.Descripcion('(+220) Gambia');
        codPais.Pais('Gambia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+995');
        codPais.Descripcion('(+995) Georgia');
        codPais.Pais('Georgia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+49');
        codPais.Descripcion('(+49) Alemania');
        codPais.Pais('Alemania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+233');
        codPais.Descripcion('(+233) Ghana');
        codPais.Pais('Ghana');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+350');
        codPais.Descripcion('(+350) Gibraltar');
        codPais.Pais('Gibraltar');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+30');
        codPais.Descripcion('(+30) Grecia');
        codPais.Pais('Grecia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+299');
        codPais.Descripcion('(+299) Groenlandia');
        codPais.Pais('Groenlandia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Granada');
        codPais.Pais('Granada');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+590');
        codPais.Descripcion('(+590) Guadalupe');
        codPais.Pais('Guadalupe');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Guam');
        codPais.Pais('Guam');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+502');
        codPais.Descripcion('(+502) Guatemala');
        codPais.Pais('Guatemala');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+224');
        codPais.Descripcion('(+224) Guinea');
        codPais.Pais('Guinea');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+245');
        codPais.Descripcion('(+245) Guinea - Bisáu');
        codPais.Pais('Guinea - Bisáu');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+592');
        codPais.Descripcion('(+592) Guyana');
        codPais.Pais('Guyana');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+509');
        codPais.Descripcion('(+509) Haití');
        codPais.Pais('Haití');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+504');
        codPais.Descripcion('(+504) Honduras');
        codPais.Pais('Honduras');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+852');
        codPais.Descripcion('(+852) Hong Kong');
        codPais.Pais('Hong Kong');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+36');
        codPais.Descripcion('(+36) Hungaria');
        codPais.Pais('Hungaria');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+354');
        codPais.Descripcion('(+354) Islandia');
        codPais.Pais('Islandia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+91');
        codPais.Descripcion('(+91) India');
        codPais.Pais('India');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+62');
        codPais.Descripcion('(+62) Indonesia');
        codPais.Pais('Indonesia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+98');
        codPais.Descripcion('(+98) Iran');
        codPais.Pais('Iran');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+964');
        codPais.Descripcion('(+964) Iraq');
        codPais.Pais('Iraq');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+353');
        codPais.Descripcion('(+353) Irlanda');
        codPais.Pais('Irlanda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+972');
        codPais.Descripcion('(+972) Israel');
        codPais.Pais('Israel');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+39');
        codPais.Descripcion('(+39) Italia');
        codPais.Pais('Italia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Jamaica');
        codPais.Pais('Jamaica');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+81');
        codPais.Descripcion('(+81) Japón');
        codPais.Pais('Japón');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+962');
        codPais.Descripcion('(+962) Jordania');
        codPais.Pais('Jordania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+7');
        codPais.Descripcion('(+7) Kazajistán');
        codPais.Pais('Kazajistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+254');
        codPais.Descripcion('(+254) Kenya');
        codPais.Pais('Kenya');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+686');
        codPais.Descripcion('(+686) Kiribati');
        codPais.Pais('Kiribati');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+383');
        codPais.Descripcion('(+383) Kosovo');
        codPais.Pais('Kosovo');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+965');
        codPais.Descripcion('(+965) Kuwait');
        codPais.Pais('Kuwait');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+996');
        codPais.Descripcion('(+996) Kirguistán');
        codPais.Pais('Kirguistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+856');
        codPais.Descripcion('(+856) Laos');
        codPais.Pais('Laos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+371');
        codPais.Descripcion('(+371) Letonia');
        codPais.Pais('Letonia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+961');
        codPais.Descripcion('(+961) Libano');
        codPais.Pais('Libano');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+266');
        codPais.Descripcion('(+266) Lesoto');
        codPais.Pais('Lesoto');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+231');
        codPais.Descripcion('(+231) Liberia');
        codPais.Pais('Liberia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+218');
        codPais.Descripcion('(+218) Libia');
        codPais.Pais('Libia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+423');
        codPais.Descripcion('(+423) Liechtenstein');
        codPais.Pais('Liechtenstein');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+370');
        codPais.Descripcion('(+370) Lituania');
        codPais.Pais('Lituania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+352');
        codPais.Descripcion('(+352) Luxembourgo');
        codPais.Pais('Luxembourgo');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+853');
        codPais.Descripcion('(+853) Macao');
        codPais.Pais('Macao');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+261');
        codPais.Descripcion('(+261) Madagascar');
        codPais.Pais('Madagascar');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+265');
        codPais.Descripcion('(+265) Malaui');
        codPais.Pais('Malaui');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+60');
        codPais.Descripcion('(+60) Malasia');
        codPais.Pais('Malasia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+960');
        codPais.Descripcion('(+960) Maldivas');
        codPais.Pais('Maldivas');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+223');
        codPais.Descripcion('(+223) Mali');
        codPais.Pais('Mali');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+356');
        codPais.Descripcion('(+356) Malta');
        codPais.Pais('Malta');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+692');
        codPais.Descripcion('(+692) Islas Marshall');
        codPais.Pais('Islas Marshall');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+596');
        codPais.Descripcion('(+596) Martinica');
        codPais.Pais('Martinica');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+222');
        codPais.Descripcion('(+222) Mauritania');
        codPais.Pais('Mauritania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+230');
        codPais.Descripcion('(+230) Mauricio');
        codPais.Pais('Mauricio');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+52');
        codPais.Descripcion('(+52) México');
        codPais.Pais('México');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+691');
        codPais.Descripcion('(+691) Micronesia');
        codPais.Pais('Micronesia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+373');
        codPais.Descripcion('(+373) Moldavia');
        codPais.Pais('Moldavia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+377');
        codPais.Descripcion('(+377) Monaco');
        codPais.Pais('Monaco');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+976');
        codPais.Descripcion('(+976) Mongolia');
        codPais.Pais('Mongolia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+382');
        codPais.Descripcion('(+382) Montenegro');
        codPais.Pais('Montenegro');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Montserrat');
        codPais.Pais('Montserrat');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+212');
        codPais.Descripcion('(+212) Marruecos');
        codPais.Pais('Marruecos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+258');
        codPais.Descripcion('(+258) Mozambique');
        codPais.Pais('Mozambique');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+95');
        codPais.Descripcion('(+95) Birmania');
        codPais.Pais('Birmania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+264');
        codPais.Descripcion('(+264) Namibia');
        codPais.Pais('Namibia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+674');
        codPais.Descripcion('(+674) Nauru');
        codPais.Pais('Nauru');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+977');
        codPais.Descripcion('(+977) Nepal');
        codPais.Pais('Nepal');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+31');
        codPais.Descripcion('(+31) Holanda');
        codPais.Pais('Holanda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+687');
        codPais.Descripcion('(+687) Nueva Caledonia');
        codPais.Pais('Nueva Caledonia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+64');
        codPais.Descripcion('(+64) Nueva Zelanda');
        codPais.Pais('Nueva Zelanda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+505');
        codPais.Descripcion('(+505) Nicaragua');
        codPais.Pais('Nicaragua');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+234');
        codPais.Descripcion('(+234) Nigeria');
        codPais.Pais('Nigeria');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+683');
        codPais.Descripcion('(+683) Niue');
        codPais.Pais('Niue');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+672');
        codPais.Descripcion('(+672) Isla Norfolk');
        codPais.Pais('Isla Norfolk');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+850');
        codPais.Descripcion('(+850) Corea del Norte');
        codPais.Pais('Corea del Norte');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+389');
        codPais.Descripcion('Macedonia del Norte');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Islas Marianas del Norte');
        codPais.Pais('Islas Marianas del Norte');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+47');
        codPais.Descripcion('(+47) Noruega');
        codPais.Pais('Noruega');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+968');
        codPais.Descripcion('(+968) Oman');
        codPais.Pais('Oman');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+92');
        codPais.Descripcion('(+92) Pakistán');
        codPais.Pais('Pakistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+680');
        codPais.Descripcion('(+680) Palaos');
        codPais.Pais('Palaos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+970');
        codPais.Descripcion('(+970) Palestina');
        codPais.Pais('Palestina');
        self.codigosPaisesLista.push(codPais);


        var codPais = new CodigoPaisClass();
        codPais.Id('+507');
        codPais.Descripcion('(+507) Panamá');
        codPais.Pais('Panamá');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+675');
        codPais.Descripcion('(+675) Papúa Nueva Guinea');
        codPais.Pais('Papúa Nueva Guinea');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+595');
        codPais.Descripcion('(+595) Paraguay');
        codPais.Pais('Paraguay');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+51');
        codPais.Descripcion('(+51) Perú');
        codPais.Pais('Perú');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+63');
        codPais.Descripcion('(+63) Filipinas');
        codPais.Pais('Filipinas');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+48');
        codPais.Descripcion('(+48) Polonia');
        codPais.Pais('Polonia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+351');
        codPais.Descripcion('(+351) Portugal');
        codPais.Pais('Portugal');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Puerto Rico');
        codPais.Pais('Puerto Rico');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+974');
        codPais.Descripcion('(+974) Qatar');
        codPais.Pais('Qatar');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+262');
        codPais.Descripcion('(+262) Réunion');
        codPais.Pais('Réunion');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+40');
        codPais.Descripcion('(+40) Rumania');
        codPais.Pais('Rumania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+7');
        codPais.Descripcion('(+7) Rusia');
        codPais.Pais('Rusia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+250');
        codPais.Descripcion('(+250) Ruanda');
        codPais.Pais('Ruanda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+685');
        codPais.Descripcion('(+685) Samoa');
        codPais.Pais('Samoa');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+378');
        codPais.Descripcion('(+378) San Marino');
        codPais.Pais('San Marino');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+239');
        codPais.Descripcion('(+239) Santo Tomé y Príncipe');
        codPais.Pais | ('Santo Tomé y Príncipe');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+966');
        codPais.Descripcion('(+966) Arabia Saudita');
        codPais.Pais('Arabia Saudita');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+221');
        codPais.Descripcion('(+221) Senegal');
        codPais.Pais('Senegal');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+381');
        codPais.Descripcion('(+381) Serbia');
        codPais.Pais('Serbia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+248');
        codPais.Descripcion('(+248) Seychelles');
        codPais.Pais('Seychelles');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+232');
        codPais.Descripcion('(+232) Sierra Leona');
        codPais.Pais('Sierra Leona');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+65');
        codPais.Descripcion('(+65) Singapure');
        codPais.Pais('Singapure');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Sint Maarten');
        codPais.Pais('Sint Maarten');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+421');
        codPais.Descripcion('(+421) Eslovaquia');
        codPais.Pais('Eslovaquia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+386');
        codPais.Descripcion('(+386) Eslovenia');
        codPais.Pais('Eslovenia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+677');
        codPais.Descripcion('(+677) Islas Salomón');
        codPais.Pais('Islas Salomón');

        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+252');
        codPais.Descripcion('(+252) Somalia');
        codPais.Pais('Somalia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+27');
        codPais.Descripcion('(+27) Sudáfrica');
        codPais.Pais('Sudáfrica');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+82');
        codPais.Descripcion('(+82) Corea del Sur');
        codPais.Pais('Corea del Sur');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+211');
        codPais.Descripcion('(+211) Sudán del Sur');
        codPais.Pais('Sudán del Sur');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+34');
        codPais.Descripcion('(+34) España');
        codPais.Pais('España');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+94');
        codPais.Descripcion('(+94) Sri Lanka');
        codPais.Pais('Sri Lanka');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+590');
        codPais.Descripcion('(+590) San Bartolomé');
        codPais.Pais('San Bartolomé');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+290');
        codPais.Descripcion('(+290) Santa Elena');
        codPais.Pais('Santa Elena');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) San Cristóbal y Nieves');
        codPais.Pais('San Cristóbal y Nieves');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Santa Lucia');
        codPais.Pais('Santa Lucia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+590');
        codPais.Descripcion('(+590) Isla de San Martín');
        codPais.Pais('Isla de San Martín');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+508');
        codPais.Descripcion('(+508) San Pedro y Miquelón');
        codPais.Pais('San Pedro y Miquelón');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) San Vicente y las Granadinas');
        codPais.Pais('San Vicente y las Granadinas');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+249');
        codPais.Descripcion('(+249) Sudán');
        codPais.Pais('Sudán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+597');
        codPais.Descripcion('(+597) Surinam');
        codPais.Pais('Surinam');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+46');
        codPais.Descripcion('(+46) Suecia');
        codPais.Pais('Suecia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+41');
        codPais.Descripcion('(+41) Suiza');
        codPais.Pais('Suiza');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+963');
        codPais.Descripcion('(+963) Siria');
        codPais.Pais('Siria');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+886');
        codPais.Descripcion('(+886) Taiwán');
        codPais.Pais('Taiwán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+992');
        codPais.Descripcion('(+992) Tajikistán');
        codPais.Pais('Tajikistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+255');
        codPais.Descripcion('(+255) Tanzania');
        codPais.Pais('Tanzania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+66');
        codPais.Descripcion('(+66) Tailandia');
        codPais.Pais('Tailandia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+670');
        codPais.Descripcion('(+670) Timor Oriental');
        codPais.Pais('Timor Oriental');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+228');
        codPais.Descripcion('(+228) Togo');
        codPais.Pais('Togo');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+690');
        codPais.Descripcion('(+690) Tokelau');
        codPais.Pais('Tokelau');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+676');
        codPais.Descripcion('(+676) Tonga');
        codPais.Pais('Tonga');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Trinidad y Tobago');
        codPais.Pais('Trinidad y Tobago');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+216');
        codPais.Descripcion('(+216) Túnez');
        codPais.Pais('Túnez');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+90');
        codPais.Descripcion('(+90) Turquía');
        codPais.Pais('Turquía');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+993');
        codPais.Descripcion('(+993) Turkmenistán');
        codPais.Pais('Turkmenistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Islas Turcas y Caicos');
        codPais.Pais('Islas Turcas y Caicos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+688');
        codPais.Descripcion('(+688) Tuvalu');
        codPais.Pais('Tuvalu');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Islas Vírgenes de U.S');
        codPais.Pais('Islas Vírgenes de U.S');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+256');
        codPais.Descripcion('(+256) Uganda');
        codPais.Pais('Uganda');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+380');
        codPais.Descripcion('(+380) Ucrania');
        codPais.Pais('Ucrania');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+971');
        codPais.Descripcion('(+971) Emiratos Árabes Unidos');
        codPais.Pais('Emiratos Árabes Unidos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+44');
        codPais.Descripcion('(+44) Reino Unido');
        codPais.Pais('Reino Unido');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+1');
        codPais.Descripcion('(+1) Estados Unidos');
        codPais.Pais('Estados Unidos');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+598');
        codPais.Descripcion('(+598) Uruguay');
        codPais.Pais('Uruguay');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+998');
        codPais.Descripcion('(+998) Uzbekistán');
        codPais.Pais('Uzbekistán');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+678');
        codPais.Descripcion('(+678) Vanuatu');
        codPais.Pais('Vanuatu');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+39');
        codPais.Descripcion('(+39) Ciudad del Vaticano');
        codPais.Pais('Ciudad del Vaticano');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+58');
        codPais.Descripcion('(+58) Venezuela');
        codPais.Pais('Venezuela');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+84');
        codPais.Descripcion('(+84) Vietnam');
        codPais.Pais('Vietnam');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+681');
        codPais.Descripcion('(+681) Wallis y Futuna');
        codPais.Pais('Wallis y Futuna');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+967');
        codPais.Descripcion('(+967) Yemen');
        codPais.Pais('Yemen');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+260');
        codPais.Descripcion('(+260) Zambia');
        codPais.Pais('Zambia');
        self.codigosPaisesLista.push(codPais);

        var codPais = new CodigoPaisClass();
        codPais.Id('+263');
        codPais.Descripcion('(+263) Zimbabue');
        codPais.Pais('Zimbabue');
        self.codigosPaisesLista.push(codPais);

        self.codigosPaisesLista(Enumerable.From(self.codigosPaisesLista()).OrderBy(function (x) { return x.Pais(); }).ToArray());
    };

    function CodigoPaisClass() {
        var me = this;

        me.Id = ko.observable();
        me.Pais = ko.observable();
        me.Descripcion = ko.observable();
    };

    self.GetObjeto = function () {
        return GetCampaniasPublicidadesWhatsappButton();
    };

    function GetCampaniasPublicidadesWhatsappButton() {
        var campaniaPublicidadWhatsappButton = {
            CampaniaPublicidadId: Guid.NewGuid(),
            FechaAlta: moment(),
            TipoCampania: new Enums().TipoCampania.CampaniaWhatsappButton,
            Pais: self.codPais(),
            CodigoArea: self.codCiudad(),
            Telefono: self.telefono(),
            Mensajes: self.mensaje()
        };

        return campaniaPublicidadWhatsappButton;
    };
};


$(document).ready(function () {
    masterCampaniaWhatsappButtonVM = new CampaniaWhatsappButtonVM();
    ko.applyBindings(masterCampaniaWhatsappButtonVM, document.getElementById('CampaniaWhatsappButton'));
});