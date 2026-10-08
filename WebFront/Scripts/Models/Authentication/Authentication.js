function LoginVM() {
    var self = this;

    var facAuthentication = new FactoryAuthentication();

    //Cuanto hay que esperar para pedir otro SMS. Cada uno cuesta plata y el anterior puede estar por llegar.
    var segundosReenvio = 45;

    //Paso visible: phone -> code -> profile. El tercero solo aparece si el telefono no tenia usuario con datos.
    self.step = ko.observable('phone');

    self.countries = [
        { label: 'Argentina (+54)', code: '54' },
        { label: 'Uruguay (+598)', code: '598' },
        { label: 'Chile (+56)', code: '56' },
        { label: 'Paraguay (+595)', code: '595' },
        { label: 'Bolivia (+591)', code: '591' },
        { label: 'Brasil (+55)', code: '55' },
        { label: 'Perú (+51)', code: '51' },
        { label: 'Colombia (+57)', code: '57' },
        { label: 'México (+52)', code: '52' },
        { label: 'España (+34)', code: '34' },
        { label: 'Estados Unidos (+1)', code: '1' }
    ];

    self.country = ko.observable(self.countries[0]);
    self.phone = ko.observable('');
    self.code = ko.observable('');
    self.name = ko.observable('');
    self.mail = ko.observable('');

    self.sending = ko.observable(false);
    self.error = ko.observable('');
    self.resendIn = ko.observable(0);

    //Lo que se le muestra al usuario y lo que se manda al servidor es lo mismo: pais + numero, solo digitos.
    //El servidor normaliza igual, pero verlo escrito evita que mande el 0 o el 15 de mas sin darse cuenta.
    self.phonePreview = ko.pureComputed(function () {
        return '+' + self.country().code + ' ' + self.phone().replace(/\D/g, '');
    });

    self.canRequest = ko.pureComputed(function () {
        return !self.sending() && self.phone().replace(/\D/g, '').length >= 6;
    });

    self.canVerify = ko.pureComputed(function () {
        return !self.sending() && self.code().replace(/\D/g, '').length === 6;
    });

    self.canResend = ko.pureComputed(function () {
        return !self.sending() && self.resendIn() === 0;
    });

    self.canComplete = ko.pureComputed(function () {
        return !self.sending() && self.name().trim().length > 0 && self.mail().trim().length > 0;
    });

    //Datos del telefono, que van en los tres pasos. name viaja siempre aunque este vacio porque
    //HttpClientWrapper.AnonymousSetSessions lo lee por reflexion del lado del servidor y explota si no esta.
    function datos() {
        return {
            countryCode: self.country().code,
            phone: self.phone().replace(/\D/g, ''),
            name: self.name()
        };
    }

    //Un reloj que corre solo hasta cero y habilita de nuevo el "mandámelo otra vez".
    function esperarReenvio() {
        self.resendIn(segundosReenvio);

        var reloj = setInterval(function () {
            self.resendIn(self.resendIn() - 1);
            if (self.resendIn() <= 0) clearInterval(reloj);
        }, 1000);
    }

    self.RequestCode = function () {
        if (!self.canRequest()) return;

        self.error('');
        self.sending(true);

        facAuthentication.RequestCode(datos()).done(function (result) {
            if (!result.ok) {
                self.error(result.error);
                return;
            }

            self.code('');
            self.step('code');
            esperarReenvio();
        }).fail(function () {
            self.error('No pudimos enviarte el código. Probá de nuevo.');
        }).always(function () {
            self.sending(false);
        });
    };

    self.VerifyCode = function () {
        if (!self.canVerify()) return;

        self.error('');
        self.sending(true);

        var request = datos();
        request.code = self.code().replace(/\D/g, '');

        facAuthentication.VerifyCode(request).done(function (result) {
            if (!result.ok) {
                self.error(result.error);
                return;
            }

            if (!result.needsProfile) {
                location.href = '/chats';
                return;
            }

            //El usuario puede existir a medias (entro alguna vez por el chatbot y quedo sin mail): lo que ya
            //tenga cargado se muestra, para que no lo escriba de nuevo.
            self.name(result.name || '');
            self.mail(result.mail || '');
            self.step('profile');
        }).fail(function () {
            self.error('No pudimos validar el código. Probá de nuevo.');
        }).always(function () {
            self.sending(false);
        });
    };

    self.CompleteProfile = function () {
        if (!self.canComplete()) return;

        self.error('');
        self.sending(true);

        var request = datos();
        request.code = self.code().replace(/\D/g, '');
        request.mail = self.mail().trim();

        facAuthentication.CompleteProfile(request).done(function (result) {
            if (!result.ok) {
                self.error(result.error);
                return;
            }

            location.href = '/chats';
        }).fail(function () {
            self.error('No pudimos guardar tus datos. Probá de nuevo.');
        }).always(function () {
            self.sending(false);
        });
    };

    self.BackToPhone = function () {
        self.error('');
        self.code('');
        self.step('phone');
    };

};

$(document).ready(function () {
    var login = document.getElementById('Login');
    if (!login) return;

    ko.applyBindings(new LoginVM(), login);
});
