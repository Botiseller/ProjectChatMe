using Newtonsoft.Json.Linq;
using System;
using System.Net;

namespace Common.BusinessException
{
    [Serializable]
    public sealed class APIException : Exception
    {
        public APIException(HttpStatusCode statusCode, string jsonData)
        {
            StatusCode = statusCode;
            JsonData = jsonData;
        }

        public HttpStatusCode StatusCode { get; private set; }
        public string JsonData { get; private set; }


        public string getErrorMessage() {

            var message = "An unexpected internal error occurred during execution.";
            dynamic json = JsonData;

            if (!string.IsNullOrEmpty(json))
            {
                var obj = JObject.Parse(json);
                message = obj["Message"]?.ToString();
            }
            return message;
        }

        public void throwError() {
            throw new Exception(getErrorMessage());
        }

    }
}
