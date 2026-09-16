using Newtonsoft.Json;
using System;


namespace Common.BusinessException
{
    [Serializable]
    public class ExceptionResult
    {
        public ExceptionResult(ExceptionEnum.ExceptionTypes _type, string _title,string _message )
        {
            ExceptionType = _type;
            Title = _title;
            Message = _message;
        }

        public ExceptionEnum.ExceptionTypes ExceptionType { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }

        public string SerializeMe
        {
            get
            {               
                return JsonConvert.SerializeObject(new { Mensaje = Message, Titulo = Title, Tipo = ExceptionType } );
            }
        }
    }


}
