using System.Collections.Generic;

namespace WebApiMessage.Models.Response
{
    public class GenericResponse<T>
    {
        public int Code { get; set; }
        public IList<ErrorMessage> Errors { get; set; }
        public T Result { get; set; }
    }

    public class ErrorMessage
    {
        public string Message { get; set; }
        public int Code { get; set; }
        public string ErrorSource { get; set; }
    }

}