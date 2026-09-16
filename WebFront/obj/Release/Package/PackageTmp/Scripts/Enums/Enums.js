function Enums() {
    var self = this;

    self.TipoDatoAdicional = {
        entero: 0,
        cadena: 1,
        booleano: 2,
        fecha: 3,
        numericoDecimal: 4,
        lista: 5,
        web: 6,
        telefono: 7,
        mail: 8,
        listaMultipleSelect: 9
    };

    self.TipoCampania = {
        CampaniaWhatsappTemplate: 1,
        CampaniaWhatsappButton: 2,
        CampaniaFormulario: 3,
        CampaniaBanner: 4,
        CampaniaQR: 5,
        CampaniaMail: 6
    };

    self.TipoCampaniasList = [
        { TipoCampaniaId: "CampaniaWhatsappTemplate", Icono:'fab fa-whatsapp green', TipoCampania: self.TipoCampania.CampaniaWhatsappTemplate, Nombre: "Whatsapp message", Validar: false, Orden: 1, MasterTipoCampania: null },
        { TipoCampaniaId: "CampaniaWhatsappButton", Icono: 'fab fa-whatsapp green', TipoCampania: self.TipoCampania.CampaniaWhatsappButton, Nombre: "Whatsapp button", Validar: false, Orden: 2, MasterTipoCampania: null },
        { TipoCampaniaId: "CampaniaFormulario", Icono: 'far fa-money-check blue', TipoCampania: self.TipoCampania.CampaniaFormulario, Nombre: "Formulario", Validar: false, Orden: 3, MasterTipoCampania: null },
        { TipoCampaniaId: "CampaniaBanner", Icono: 'far fa-address-card orange', TipoCampania: self.TipoCampania.CampaniaBanner, Nombre: "Banner", Validar: false, Orden: 4, MasterTipoCampania: null },
        { TipoCampaniaId: "CampaniaQR", Icono: 'far fa-qrcode blue', TipoCampania: self.TipoCampania.CampaniaQR, Nombre: "QR", Validar: false, Orden: 5, MasterTipoCampania: null },
        { TipoCampaniaId: "CampaniaMail", Icono: 'far fa-envelope blue', TipoCampania: self.TipoCampania.CampaniaMail, Nombre: "Mail", Validar: false, Orden: 6, MasterTipoCampania: null }
    ];

    self.TipoDato = {
        String: 1,
        Numero: 2,
        Decimal: 3,
        Date: 4,
        Mail: 5,
        Lista: 6,
        MultipleLista: 7
    };

    self.TipoDatosList = [
        { TipoDatoId: 1, Nombre: "String", Orden: 1 },
        { TipoDatoId: 2, Nombre: "Numero", Orden: 2 },
        { TipoDatoId: 3, Nombre: "Decimal", Orden: 3 },
        { TipoDatoId: 4, Nombre: "Date", Orden: 4 },
        { TipoDatoId: 5, Nombre: "Mail", Orden: 5 },
        { TipoDatoId: 6, Nombre: "Lista", Orden: 6 },
        { TipoDatoId: 7, Nombre: "Multiple selección", Orden: 7 }
    ];

    self.TipoEnviosList = [
        { TipoEnvioId: 1, Nombre: "Diario", Orden: 1 },
        { TipoEnvioId: 2, Nombre: "Semanal", Orden: 2 },
        { TipoEnvioId: 3, Nombre: "Mensual", Orden: 3 },
        { TipoEnvioId: 4, Nombre: "Anual", Orden: 4 },
        { TipoEnvioId: 5, Nombre: "Unica vez", Orden: 5 }
    ];

    self.ParametrosList = [
        { ParametroId: 1, Nombre: "Nombre", Orden: 1 },
        { ParametroId: 2, Nombre: "Apellido", Orden: 2 },
        { ParametroId: 3, Nombre: "Dirección", Orden: 3 },
        { ParametroId: 4, Nombre: "Estado", Orden: 4 },
        { ParametroId: 5, Nombre: "Grupo de afinidad", Orden: 5 },
        { ParametroId: 6, Nombre: "Responsable", Orden: 6 },
        { ParametroId: 7, Nombre: "Mail", Orden: 7 }
    ];

    self.DiasSemanaList = [
        { DiaSemanaId: 0, Nombre: "Domingo",Text:"D",Check:false, Orden: 0 },
        { DiaSemanaId: 1, Nombre: "Lunes", Text: "L", Check: false, Orden: 1 },
        { DiaSemanaId: 2, Nombre: "Martes", Text: "M", Check: false, Orden: 2 },
        { DiaSemanaId: 3, Nombre: "Miércoles", Text: "M", Check: false, Orden: 3 },
        { DiaSemanaId: 4, Nombre: "Jueves", Text: "J", Check: false, Orden: 4 },
        { DiaSemanaId: 5, Nombre: "Viernes", Text: "V", Check: false, Orden: 5 },
        { DiaSemanaId: 6, Nombre: "Sábado", Text: "S", Check: false, Orden: 6 }
    ];

    self.TipoSelling = {
        CrossSelling: 1,
        UpSelling: 2
    };

    self.TipoSellingList = [
        {
            TipoSellingId: "CrossSelling",
            TipoSelling: self.TipoSelling.CrossSelling,
            Nombre: "Cross selling",
            Descripcion: "Ofrece productos relacionados una vez realizada la compra.",
            Icono: "fa fa-check-circle fa-3x",
            Orden: 1,
            Check:true
        },
        {
            TipoSellingId: "UpSelling",
            TipoSelling: self.TipoSelling.UpSelling,
            Nombre: "Up selling",
            Descripcion: "Ofrece mejores productos a los intereses de tus clientes.",
            Icono: "fa fa-star-exclamation fa-3x",
            Orden: 2,
            Check: false
        }
    ];

    self.TipoEtapa = {
        abierto: 0,
        ganado: 1,
        perdido: 2,
        recuperado: 3
    };
};
