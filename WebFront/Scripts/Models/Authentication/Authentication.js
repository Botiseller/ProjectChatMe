function LoginVM() {
    var self = this;

    var facAuthentication = new FactoryAuthentication();
    var facShared = new FactoryShared();


    self.LoadData = function () {
        facAuthentication.ConseguirUniqueString().done(function (result) {

            console.log(result);
        });
    };
};

//Funcion que se llama del Sammy, entra primero.
function PanelAuthenticationChatMeSammy() {
    var masterLoginVM = new LoginVM();
    ko.applyBindings(masterLoginVM, document.getElementById('Login'));

    masterLoginVM.LoadData();

   

};
