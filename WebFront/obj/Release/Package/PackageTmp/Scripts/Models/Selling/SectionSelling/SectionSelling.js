function SectionSellingVM() {
    var self = this;

    self.tipoSellingList = ko.observableArray([]);
    
    self.avisosList = ko.observableArray([]);
    self.actionList = ko.observableArray([]);

    self.intentsList = ko.observableArray([]);

    self.variablesConsts = ko.observableArray([]);
    self.mensaje = ko.observable();
    self.IntentContinuar = ko.observable();

    self.buttonAgregarAvisos = function () {
        if (self.avisosList().length < 5) {
            var avisoClass = new AvisosClass();

            avisoClass.AvisoId(Guid.NewGuid());
            avisoClass.Orden(self.avisosList().length + 1);

            self.avisosList.push(avisoClass);
        };
    };

    self.buttonAgregarAction = function () {
        if (self.actionList().length < 5) {
            var actionClass = new ActionClass();

            actionClass.ActionId(Guid.NewGuid());
            actionClass.Orden(self.actionList().length + 1);

            self.actionList.push(actionClass);

            $("#" + actionClass.ActionId()).select2();
        };
    };

    self.LoadVM = function () {
        self.LoadTipoKnowledge();

        self.buttonAgregarAvisos();

        InitEmoji();
        InitVarConsts(self.variablesConsts);

        $(".inputmaskInteger").inputmask({
            alias: 'integer',
            allowMinus: false,
            min: 1
        });

        return $.when(self.LoadIntents());
    };

    self.EditVM = function (selling) {
        self.tipoSellingList().find(function (tipoSelling) {
            return tipoSelling.TipoSelling() == selling.TipoSelling;
        }).BotonSeleccionar();

        self.mensaje(DecodeMessageEmoji(selling.SellingSelling.Mensaje));
        self.IntentContinuar(selling.SellingSelling.IntentContinuar)
        self.avisosList.removeAll();

        $.each(selling.SellingSelling.Avisos, function (i, avisoItem) {
            var avisoClass = new AvisosClass();

            avisoClass.AvisoId(avisoItem.AvisoId);
            avisoClass.Hora(avisoItem.Hora);
            avisoClass.Orden(avisoItem.Orden);

            self.avisosList.push(avisoClass);
        });

        $.each(selling.SellingSelling.Actions, function (i, actionItem) {
            var actionClass = new ActionClass();

            actionClass.ActionId(actionItem.ActionId);
            actionClass.Nombre(actionItem.Nombre);
            actionClass.IntentId(actionItem.IntentId);
            actionClass.Orden(actionItem.Orden);

            self.actionList.push(actionClass);

            $("#" + actionClass.ActionId()).select2();
        });
    };

    self.LoadTipoKnowledge = function () {
        self.tipoSellingList.removeAll();

        $.each(new Enums().TipoSellingList, function (i, tipoSelling) {
            var tipoSellingClass = new TipoSellingClass();

            tipoSellingClass.TipoSellingId(tipoSelling.TipoSellingId);
            tipoSellingClass.TipoSelling(tipoSelling.TipoSelling);
            tipoSellingClass.Nombre(tipoSelling.Nombre);
            tipoSellingClass.Icono(tipoSelling.Icono);
            tipoSellingClass.Descripcion(tipoSelling.Descripcion);
            tipoSellingClass.Orden(tipoSelling.Orden);
            tipoSellingClass.Check(tipoSelling.Check);

            self.tipoSellingList.push(tipoSellingClass);
        });
    };

    self.LoadIntents = function () {
        self.intentsList.removeAll();

        return facIA.ConseguirIntentsShort().done(function (intentsList) {
            $.each(intentsList, function (i, intent) {
                var itemClass = new ItemClass();

                itemClass.Id(intent.IntentId);
                itemClass.Nombre(intent.Nombre);

                self.intentsList.push(itemClass);
            });
        });
    };

    function TipoSellingClass() {
        var me = this;

        me.TipoSellingId = ko.observable();
        me.TipoSelling = ko.observable();
        me.Nombre = ko.observable();
        me.Icono = ko.observable();
        me.Descripcion = ko.observable();
        me.Orden = ko.observable();
        me.Check = ko.observable(false);

        me.BotonSeleccionar = function () {
            self.tipoSellingList().forEach(function (x) {
                x.Check(false);
            });

            me.Check(true);
        };
    };

    function AvisosClass() {
        var me = this;

        me.AvisoId = ko.observable();
        me.Hora = ko.observable();
        me.Orden = ko.observable();

        me.ButtonEliminar = function () {
            self.avisosList.remove(me);
        };
    };

    function ActionClass() {
        var me = this;

        me.ActionId = ko.observable();
        me.IntentId = ko.observable();
        me.Nombre = ko.observable();
        me.Orden = ko.observable();

        me.ButtonEliminar = function () {
            self.actionList.remove(me);
        };
    };

    function ItemClass() {
        var me = this;

        me.Id = ko.observable();
        me.Nombre = ko.observable();
    };

    self.GetSelling = function () {
        return GetSelling();
    };

    function GetSelling() {
        var selling = {
            Avisos: [],
            Actions: [],
            IntentContinuar: self.IntentContinuar(),
            Mensaje: EncodeMessageEmoji(self.mensaje().replace(/\s+/gi, ' ').trim())
        };

        $.each(self.avisosList(), function (i, avisoItem) {
            var aviso = {
                AvisoId: avisoItem.AvisoId(),
                Hora: avisoItem.Hora(),
                Orden: avisoItem.Orden()
            };

            selling.Avisos.push(aviso);
        });

        $.each(self.actionList(), function (i, actionItem) {
            var action = {
                ActionId: actionItem.ActionId(),
                Nombre: actionItem.Nombre(),
                IntentId: actionItem.IntentId(),
                Orden: actionItem.Orden()
            };

            selling.Actions.push(action);
        });

        return selling;
    };
};

$(document).ready(function () {
    masterSectionSellingVM = new SectionSellingVM();
    ko.applyBindings(masterSectionSellingVM, document.getElementById('SectionSelling'));
});
