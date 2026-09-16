using System;
using System.Net;

namespace Common.CallApi
{
    [Serializable]
    public class WebApiResult
    {
        public string Message { get; set; }

        public HttpStatusCode HttoStatusCode { get; set; }
    }
}