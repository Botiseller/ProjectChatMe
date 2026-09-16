namespace Framework.FrontApplication.Result
{
    public class JsonBadRequest
    {
        public string Message { get; set; }
        public string ExceptionMessage { get; set; }
        public string ExceptionType { get; set; }
        public string StackTrace { get; set; }
        public JsonBadRequest InnerException { get; set; }
    }
}