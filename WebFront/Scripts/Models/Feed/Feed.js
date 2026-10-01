function FeedVM() {
}
//Funcion que se llama del Sammy, entra primero.
$(document).ready(function () {
    var masterFeedVM = new FeedVM();
    ko.applyBindings(masterFeedVM, document.getElementById('Feed'));


});

