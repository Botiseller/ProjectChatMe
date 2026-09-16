function page(_number, _from, _to, _active) {
    var self = this;
    self.number = ko.observable(_number);
    self.from = ko.observable(_from);
    self.to = ko.observable(_to);
    self.active = ko.observable(_active);

    self.getcss = ko.computed(function () {
        if (self.active()) {
            return 'active';
        };
        return '';
    }, this);
};

function Paginator() {
    var self = this;

    self.list = ko.observableArray([]);
    self.showList = ko.observableArray([]);
    self.pages = ko.observableArray([]);

    self.totalRows = ko.observable(0);
    self.rowTo = ko.observable(1);
    self.rowPage = ko.observable(10);
    self.activePage = ko.observable(null);

    self.changeList = ko.computed(function () {
        //paginar
        if (self.list().length > 0) {
            self.LoadRows();
        };
    }, this);

    self.changePage = function (page) {
        self.rowTo(page.from());
        self.activePage(page);
        self.LoadRows();
    };

    self.previusPage = function () {
        var page = Enumerable.From(self.pages()).Where(function (x) { return x.number() == parseInt(self.activePage().number() - 1) }).FirstOrDefault();
        if (page == null) { return };
        self.rowTo(page.from());
        self.activePage(page);
        self.LoadRows();
    };

    self.nextPage = function () {
        var page = Enumerable.From(self.pages()).Where(function (x) { return x.number() == parseInt(self.activePage().number() + 1) }).FirstOrDefault();
        if (page == null) { return };
        self.rowTo(page.from());
        self.activePage(page);
        self.LoadRows();
    };

    self.firstPage = function () {
        if (self.activePage().number() == 1) { return };
        var page = self.pages()[0];
        if (page == null) { return };
        self.rowTo(page.from());
        self.activePage(page);
        self.LoadRows();
    };

    self.lastPage = function () {
        if (self.activePage().number() == self.pages().length) { return };
        var page = self.pages()[self.pages().length - 1];
        if (page == null) { return };
        self.rowTo(page.from());
        self.activePage(page);
        self.LoadRows();
    };

    self.previusState = ko.computed(function () {
        if (self.activePage() == null) { return '' };
        var p = self.activePage();
        if (p.number() == 1) {
            return 'disabled';
        };
        return '';
    }, this);

    self.nextState = ko.computed(function () {
        if (self.activePage() == null) { return '' };
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

        self.showList([]);

        $.each(self.list(), function (index, obj) {
            if (index >= (self.rowTo() - 1) && index < parseInt((self.rowTo() - 1) + self.rowPage())) {
                self.showList.push(obj);
            };
        });

        self.totalRows(self.list().length);

        self.pages([]);

        //Redondea para arriba la cantidad de pagesize a mostrar
        var toPage = Math.ceil(self.list().length / self.rowPage());

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
        self.totalRows(0);
        self.rowTo(1);
        self.rowPage(10);
        self.activePage(null);
        self.pages([]);

        self.showList([]);
        self.pages([]);
    };

    self.ascending = ko.observable("Asc");

    // Generic sort method for numbers and strings
    self.stringSort = function (column) { // Pass in the column object
        self.list(self.list().sort(function (a, b) {
            // Set strings to lowercase to sort in a predictive way
            var datoA = a[column.toElement.id]() == null ? "" : a[column.toElement.id]().toLowerCase();
            var datoB = b[column.toElement.id]() == null ? "" : b[column.toElement.id]().toLowerCase();

            if (self.ascending() == "Asc") {
                return datoA == datoB ? 0 : (datoA < datoB ? -1 : 1);
            }
            else {
                return datoA == datoB ? 0 : (datoA < datoB ? 1 : -1);
            };
        }));

        if (self.ascending() == "Asc") {
            self.ascending("Desc");
        }
        else {
            self.ascending("Asc");
        };
    };

    // Sort numbers
    self.numberSort = function (column) {
        self.list(self.list().sort(function (a, b) {
            var datoA = a[column.toElement.id]() == null ? 0 : a[column.toElement.id]();
            var datoB = b[column.toElement.id]() == null ? 0 : b[column.toElement.id]();

            if (self.ascending() == "Asc") {
                return datoA - datoB;
            }
            else {
                return datoB - datoA;
            };
        }));

        if (self.ascending() == "Asc") {
            self.ascending("Desc");
        }
        else {
            self.ascending("Asc");
        };
    };

    // Sort by date
    self.dateSort = function (column) {
        self.list(self.list().sort(function (a, b) {
            var datoA = a[column.toElement.id]() == null ? new Date('01-01-1900') : a[column.toElement.id]();
            var datoB = b[column.toElement.id]() == null ? new Date('01-01-1900') : b[column.toElement.id]();

            if (self.ascending() == "Asc") {
                return new Date(moment(datoA).format('MM-DD-YYYY')) - new Date(moment(datoB).format('MM-DD-YYYY'));
            }
            else {
                return new Date(moment(datoB).format('MM-DD-YYYY')) - new Date(moment(datoA).format('MM-DD-YYYY'));
            };
        }));

        if (self.ascending() == "Asc") {
            self.ascending("Desc");
        }
        else {
            self.ascending("Asc");
        };
    };

    // Using a deep get method to find nested object properties
    self.objectSort = function (column) {
        self.list(self.list().sort(function (a, b) {
            var datoA = self.deepGet(a, column.toElement.id),
            datoB = self.deepGet(b, column.toElement.id);

            if (self.ascending() == "Asc") {
                return datoA == datoB ? 0 : (datoA < datoB ? -1 : 1);
            }
            else {
                return datoA == datoB ? 0 : (datoA < datoB ? 1 : -1);
            };
        }));

        if (self.ascending() == "Asc") {
            self.ascending("Desc");
        }
        else {
            self.ascending("Asc");
        };
    };
};