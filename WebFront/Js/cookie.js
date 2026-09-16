function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        };
    };
    return null;
};

function loadCookie(name, cookievalue, expiresdate) {
    document.cookie = name + "=" + encodeURIComponent(cookievalue) + "; expires=" + expiresdate.toUTCString() + "; path =/";
};

function limpiarCookies(name) {
    var expiresdate = new Date(new Date().setDate((new Date().getDate() - 1)));

    document.cookie = name + "=" + encodeURIComponent(name) + "; expires=" + expiresdate.toUTCString() + "; path =/";
};

function limpiarSessionStorage(pagina) {
    //switch (pagina) {
    //    case "ListaUsuarios":
    //        sessionStorage.setItem('textSearchLocalUsuarios', "");
    //        break;
    //};
};