namespace Framework.Core.Header.Models
{
    public class InternalHeader : IInternalHeader
    {
        public string RequestId { get; set; }
        public string ClientCode { get; set; }
        public string SourceSystem { get; set; }
        public string SessionId { get; set; }
        public string AuthenticationToken { get; set; }
        public string CallerId { get; set; }

    }
}
