namespace Business.Dto
{
    //Espejo de transporte de Business.Entities.MensajeEnviadoPor: Business.Dto no referencia Business.Entities, asi
    //que el enum no se puede reusar aca. Los valores tienen que coincidir con los de alla, porque es lo que termina
    //guardado en la columna Mensajes.Origen; el mapeo entre los dos lo hace ChatBusinessService.
    public enum MensajeEnviadoPorDto
    {
        Usuario = 1,
        Negocio = 2
    }
}
