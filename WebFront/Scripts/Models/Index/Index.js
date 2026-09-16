function IndexVM() {
    var self = this;

    var facShared = new FactoryShared();

    self.LoadData = function () {
        facShared.ConseguirUniqueString().done(function (result) {
            
            console.log(result);
        });
    };
};

//Funcion que se llama del Sammy, entra primero.
$(document).ready(function () {
    var masterSharedVM = new IndexVM();
    ko.applyBindings(masterSharedVM, document.getElementById('Index'));

    masterSharedVM.LoadData();

   
});
