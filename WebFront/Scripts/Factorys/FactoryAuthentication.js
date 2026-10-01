function FactoryAuthentication() {
    var self = this;

    self.ValidateUser = function (obj) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Authentication/ValidateUser',
            data: obj
        });
    };

};