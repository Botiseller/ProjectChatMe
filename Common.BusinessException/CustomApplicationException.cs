namespace Common.BusinessException
{
    public class CustomApplicationException
    {
        public string Mensaje { get; set; }
        public string Titulo { get; set; }
        public ExceptionEnum.ExceptionTypes Tipo { get; set; }

    }
}
