function FactoryShared() {
    var self = this;

    //GET
    self.ConseguirUniqueString = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Shared/ConseguirUniqueString'
        });
    };
};



