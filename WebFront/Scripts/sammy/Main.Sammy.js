
var sammy = $.sammy(function () {
    var self = this;

    self._checkFormSubmission = function (form) {
        return true;
    };


    self.get('#Home', function (context) {
    });

    self.get('#authentication', function (context) {
   
        PanelAuthenticationChatMeSammy();
    });
    
});

$(function () {
    sammy.run('#Home');
});