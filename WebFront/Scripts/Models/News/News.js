function NewsVM() {
} 
//Funcion que se llama del Sammy, entra primero.
$(document).ready(function () {
    var masterNewsVM = new NewsVM();
    ko.applyBindings(masterNewsVM, document.getElementById('News'));

   
});
