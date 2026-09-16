$(document).ready(function () {
    if (performance.navigation.type == 1) {
        //si reload(Por si falla la consulta de version no quede recargando constantemente)
    } else {
        //no reload()
        var miCookie = readCookie("versionAssembly");

        if (miCookie == null) {
            loadCookie("versionAssembly", $("#versionAssembly").html(), new Date(2068, 1, 02, 11, 20));
        } else if (miCookie != $("#versionAssembly").html()) {
            loadCookie("versionAssembly", $("#versionAssembly").html(), new Date(2068, 1, 02, 11, 20));

            window.location.reload();
        };
    };
});


