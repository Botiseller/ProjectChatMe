namespace Framework.Core.Header
{
    public interface IInternalHeader
    {
        string RequestId { get; set; }

        string AuthenticationToken { get; set; }
        string SessionId { get; set; }
        string CallerId { get; set; }

        string ClientCode { get; set; }
        string SourceSystem { get; set; }

    }
}
