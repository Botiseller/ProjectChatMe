function FactoryCrm() {
    var self = this;

    //GET
    self.ConseguirFullProductosStock = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirFullProductosStock'
        });
    };

    self.ConseguirProductosClasificaciones = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirProductosClasificaciones'
        });
    };

    self.ConseguirUsuariosBotisellerSinc = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirUsuariosBotiseller',
            async: false
        });
    };

    self.ConseguirUsuariosBotiseller = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirUsuariosBotiseller'
        });
    };

    self.ConseguirArchivoPorId = function (_archivoId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirArchivoPorId',
            data: { archivoId: _archivoId }
        });
    };

    self.ConseguirLeadPorId = function (_leadId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirLeadPorId',
            data: { leadId: _leadId }
        });
    };

    self.ConseguirDatosLead = function (_leadId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirDatosLead',
            data: { leadId: _leadId }
        });
    };

    self.ConseguirEmpresa = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirEmpresa'
        });
    };

    self.ConseguirMonedas = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirMonedas'
        });
    };

    self.ConseguirPipelines = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirPipelines'
        });
    };

    self.ConseguirEtapasPorPipelineId = function (_pipelineId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirEtapasPorPipelineId',
            data: { pipelineId: _pipelineId }
        });
    };

    self.ConseguirNegocioPorId = function (_negocioId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirNegocioPorId',
            data: { negocioId: _negocioId }
        });
    };

    self.ConseguirProductos = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirProductos'
        });
    };

    self.ConseguirProductoPorId = function (_productoId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirProductoPorId',
            data: { productoId: _productoId }
        });
    };

    self.ConseguirProductosInteresPorLeadId = function (_leadId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirProductosInteresPorLeadId',
            data: { leadId: _leadId }
        });
    };

    self.ConseguirNegociosGanados = function (_leadId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirNegociosGanados',
            data: { leadId: _leadId }
        });
    };

    self.ConseguirDatosAdicionales = function (_entidad) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirDatosAdicionales',
            data: { entidad: _entidad }
        });
    };

    self.ConseguirMotivosCierreDetallePorPipelineId = function (_pipelineId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirMotivosCierreDetallePorPipelineId',
            data: { pipelineId: _pipelineId }
        });
    };

    self.ConseguirCambiosEtapasPorNegocioId = function (_negocioId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirCambiosEtapasPorNegocioId',
            data: { negocioId: _negocioId }
        });
    };

    self.ConseguirTipoNegocios = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirTipoNegocios'
        });
    };

    self.ConseguirPuntosVenta = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirPuntosVenta'
        });
    };

    self.ConseguirTicketsPorLeadId = function (_leadId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirTicketsPorLeadId',
            data: { leadId: _leadId }
        });
    };

    self.ConseguirTicketPorId = function (_ticketId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirTicketPorId',
            data: { ticketId: _ticketId }
        });
    };

    self.ConseguirEstadosTicket = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirEstadosTicket'
        });
    };

    self.ConseguirTareaPorId = function (_tareaId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirTareaPorId',
            data: { tareaId: _tareaId }
        });
    };

    self.ConseguirLlamadaPorId = function (_llamadaId) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirLlamadaPorId',
            data: { llamadaId: _llamadaId }
        });
    };

    self.ConseguirTiposEvento = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirTiposEvento'
        });
    };

    self.ConseguirCalendarios = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirCalendarios'
        });
    };

    self.ConseguirGruposLead = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirGruposLead'
        });
    };

    self.ConseguirEstadosLead = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirEstadosLead'
        });
    };

    self.ConseguirFullCatalogosStock = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirFullCatalogosStock'
        });
    };

    self.ConseguirPlantillas = function () {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirPlantillas'
        });
    };

    self.ConseguirPlantillasPorEstado = function (_estado) {
        return $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/Crm/ConseguirPlantillasPorEstado',
            data: { estado: _estado }
        });
    };

    self.GuardarPlantilla = function (_plantilla) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarPlantilla',
            data: { plantilla: _plantilla }
        });
    };

    self.EnviarMensajePushPlantilla = function (_mensajeNombre, _telefonoEnvio, _parametros) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EnviarMensajePushPlantilla',
            data: { mensajeNombre: _mensajeNombre, telefonoEnvio: _telefonoEnvio, parametros: _parametros }
        });
    };
    
    //POST
    self.EnvioMailNotificacion = function (_envioMail) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EnvioMailNotificacion',
            data: { envioMail: _envioMail }
        });
    };

    self.GuardarNovedades = function (_novedadesDto) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarNovedades',
            data: { novedadesDto: _novedadesDto }
        });
    };

    self.GuardarNegocio = function (_negocio) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarNegocio',
            data: { negocio: _negocio }
        });
    };

    self.EliminarNegocio = function (_negocio) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EliminarNegocio',
            data: { negocio: _negocio }
        });
    };

    self.GuardarNegocioSeguidos = function (_NegocioSeguido) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarNegocioSeguidos',
            data: { NegocioSeguido: _NegocioSeguido }
        });
    };

    self.EliminarNegocioSeguidos = function (_NegocioSeguido) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EliminarNegocioSeguidos',
            data: { NegocioSeguido: _NegocioSeguido }
        });
    };

    self.GuardarNegocioEtapaComentarios = function (_negocioEtapaComentarios) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarNegocioEtapaComentarios',
            data: { negocioEtapaComentarios: _negocioEtapaComentarios }
        });
    };

    self.ModificarMotivoCierre = function (_ticket) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/ModificarMotivoCierre',
            data: { ticket: _ticket }
        });
    };

    self.GuardarTicket = function (_ticket) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarTicket',
            data: { ticket: _ticket }
        });
    };

    self.EliminarTicket = function (_ticket) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EliminarTicket',
            data: { ticket: _ticket }
        });
    };

    self.GuardarTarea = function (_tarea) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarTarea',
            data: { tarea: _tarea }
        });
    };

    self.EliminarTarea = function (_tarea) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EliminarTarea',
            data: { tarea: _tarea }
        });
    };

    self.GuardarLlamada = function (_llamada) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarLlamada',
            data: { llamada: _llamada }
        });
    };

    self.EliminarLlamada = function (_llamada) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/EliminarLlamada',
            data: { llamada: _llamada }
        });
    };

    self.GuardarEvento = function (_evento) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarEvento',
            data: { evento: _evento }
        });
    };

    self.ModificarFechas = function (_evento) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/ModificarFechas',
            data: { evento: _evento }
        });
    };

    self.GuardarLead = function (_lead) {
        return $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/Crm/GuardarLead',
            data: { lead: _lead }
        });
    };
};