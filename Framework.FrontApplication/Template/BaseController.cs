using Business.CallAPI.Services;
using Framework.FrontApplication.Result;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Framework.FrontApplication.Template
{
    public abstract class BaseController : Controller, IDisposable
    {
        public MiddlewareChatMeService middlewareChatMeService = null;

        public BaseController()
        {
            middlewareChatMeService = new MiddlewareChatMeService();
        }

        protected static JsonResult JsonNet(object data)
        {
            return JsonNet(data, null, null, JsonRequestBehavior.AllowGet);
        }

        protected static JsonResult JsonNet(object data, string contentType)
        {
            return JsonNet(data, contentType, null, JsonRequestBehavior.DenyGet);
        }

        protected static JsonResult JsonNet(object data, string contentType, Encoding contentEncoding)
        {
            return new JsonNetResult
            {
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                Data = data
            };
        }

        private static JsonResult JsonNet(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult
            {
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                Data = data,
                JsonRequestBehavior = behavior
            };
        }

        public static T ParseHttpGetJson<T>(string query) where T : new()
        {
            if (!string.IsNullOrEmpty(query))
            {
                try
                {
                    var json = query.Substring(7, query.Length - 7);
                    json = HttpUtility.UrlDecode(json);
                    dynamic queryJson = JsonConvert.DeserializeObject<T>(json);

                    return queryJson;
                }
                catch (Exception e)
                {
                    throw new ApplicationException("can't deserialize object as wrong string content！", e);
                }
            }
            return new T();
        }

        internal protected new JsonResult Json(object data, JsonRequestBehavior behavior)
        {
            var j = Json(data);
            j.JsonRequestBehavior = behavior;
            j.MaxJsonLength = int.MaxValue;
            return j;
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

        public new void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}
