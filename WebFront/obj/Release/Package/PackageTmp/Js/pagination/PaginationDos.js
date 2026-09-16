function page(_number, _from, _to, _active) {
    var self = this;

    self.number = ko.observable(_number);
    self.from = ko.observable(_from);
    self.to = ko.observable(_to);
    self.active = ko.observable(_active);

    self.getCssActive = ko.computed(function () {
        if (self.active()) {
            return 'active';
        };
        return '';
    }, this);

    self.getCssDisabled = ko.computed(function () {
        if (self.active()) {
            return 'disabled';
        };
        return '';
    }, this);
};

function PaginatorDos() {
    var self = this;

    self.pagina = ko.observable(0);
    self.list = ko.observableArray([]);
    self.pages = ko.observableArray([]);

    self.totalRows = ko.observable(0);
    self.rowTo = ko.observable(1);
    self.rowPage = ko.observable(10);
    self.activePage = ko.observable(null);

    self.changeList = ko.computed(function () {
        if (self.totalRows() > 0) {
            self.LoadRows();
        };
    }, this);

    self.changePage = function (page) {
        self.pagina(page.number() - 1);
        self.rowTo(page.from());
        self.activePage(page);
    };

    self.previusPage = function () {
        var page = Enumerable.From(self.pages()).Where(function (x) { return x.number() == parseInt(self.activePage().number() - 1) }).FirstOrDefault();
        if (page == null) {
            return;
        };

        self.pagina(page.number() - 1);
        self.rowTo(page.from());
        self.activePage(page);
    };

    self.nextPage = function () {
        var page = Enumerable.From(self.pages()).Where(function (x) { return x.number() == parseInt(self.activePage().number() + 1) }).FirstOrDefault();
        if (page == null) {
            return;
        };

        self.pagina(page.number() - 1);
        self.rowTo(page.from());
        self.activePage(page);
    };

    self.firstPage = function () {
        if (self.activePage().number() == 1) {
            return;
        };

        var page = self.pages()[0];
        if (page == null) {
            return;
        };

        self.pagina(page.number() - 1);
        self.rowTo(page.from());
        self.activePage(page);
    };

    self.lastPage = function () {
        if (self.activePage().number() == self.pages().length) {
            return;
        };

        var page = self.pages()[self.pages().length - 1];
        if (page == null) {
            return;
        };

        self.pagina(page.number() - 1);
        self.rowTo(page.from());
        self.activePage(page);
    };

    self.getCssPreviusState = ko.computed(function () {
        if (self.activePage() == null) {
            return '';
        };

        var p = self.activePage();
        if (p.number() == 1) {
            return 'disabled';
        };

        return '';
    }, this);

    self.getCssNextState = ko.computed(function () {
        if (self.activePage() == null) {
            return '';
        };

        var p = self.activePage();
        if (p.number() == self.pages().length) {
            return 'disabled';
        };

        return '';
    }, this);

    //paginar
    self.LoadRows = function () {
        var currentPage = {
            to: self.rowTo() - 1,
            count: self.rowPage()
        };

        self.pages([]);

        //Redondea para arriba la cantidad de pagesize a mostrar
        var toPage = Math.ceil(self.totalRows() / self.rowPage());

        for (var i = 0; i < toPage; i++) {
            var numer = (i + 1);
            var from = (i * self.rowPage()) + 1;
            var to = ((i + 1) * self.rowPage());
            var active = (currentPage.to + 1 == (i * self.rowPage()) + 1);

            self.pages.push(new page(numer, from, to, active));

            if (self.activePage() == null && i == 0) {
                self.activePage(self.pages()[0]);
            };
        };
    };

    self.clearPages = function () {
        self.pagina(0);
        self.totalRows(0);
        self.rowTo(1);
        self.rowPage(10);
        self.activePage(null);

        self.pages([]);
        self.list([]);
    };
};