using Common.CallApi.Converters;
using Common.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Common.CallApi
{
    public sealed class HttpClientWrapper : HttpClientWrapperBase
    {
        public  HttpClientWrapper() 
        {
            _urlApi = Helper.GetWebSetingValue("WebApiUrl");
        }

        public HttpClientWrapper(string urlApi)
        {
            _urlApi = urlApi;
        }

     

        public void CreateApiChatMe()
        {
            _urlApi = Helper.GetWebSetingValue("WebApiUrlChatMe");
        }

        


        private  string _urlApi;

        #region Get

        public HttpResponseMessage Call(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            AnonymousSetSessions(parameters.Anonymous, parameters.Params);
            return GetExecute(url, parameters.CacthInternalExaption);
        }

        public T Call<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            AnonymousSetSessions(parameters.Anonymous, parameters.Params);
            return GetExecute<T>(url, parameters.CacthInternalExaption);
        }

        public async Task<T> CallAsync<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            AnonymousSetSessions(parameters.Anonymous, parameters.Params);
            var r = await GetExecuteAsync<T>(url, parameters.CacthInternalExaption).ConfigureAwait(false);
            return r;
        }

        public async Task CallAsync(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            AnonymousSetSessions(parameters.Anonymous, parameters.Params);
            await GetExecuteAsync(url, parameters.CacthInternalExaption).ConfigureAwait(false);
        }


   
        #endregion

        #region Post


        public T CallPost<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            
            T r = default(T);
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    r = PostExecute<T>(url, contentString, parameters.CacthInternalExaption);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    r = PostExecute<T>(url, contentFormEncode, parameters.CacthInternalExaption);
                    break;
            }
            
            return r;
        }

        public async Task<T> CallPostAsync<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            var r = "";
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    r = await PostExecuteAsync(url, contentString, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    r = await PostExecuteAsync(url, contentFormEncode, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
            }
            return JsonConvert.DeserializeObject<T>(r);
        }

        public async Task CallPostAsync(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    await PostExecuteAsync(url, contentString, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    await PostExecuteAsync(url, contentFormEncode, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
            }
        }
        
        
        

        
        #endregion

        #region Put
        public T CallPut<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            T r = default(T);
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    r = PutExecute<T>(url, contentString, parameters.CacthInternalExaption);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    r = PutExecute<T>(url, contentFormEncode, parameters.CacthInternalExaption);
                    break;
            }
            
            return r;
        }

        public async Task<T> CallPutAsync<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            var r = "";
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    r = await PutExecuteAsync(url, contentString, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    r = await PutExecuteAsync(url, contentFormEncode, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
            }
            
            return JsonConvert.DeserializeObject<T>(r);
        }

        public async Task CallPutAsync(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller);
            
            switch (parameters.UseUrlEncode)
            {
                case false:
                    var contentString = GetContentString(parameters.Params);
                    await PutExecuteAsync(url, contentString, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
                case true:
                    var contentFormEncode = GetContentFormEncode(parameters.Params);
                    await PutExecuteAsync(url, contentFormEncode, parameters.CacthInternalExaption).ConfigureAwait(false);
                    break;
            }
        }

        #endregion

        #region Delete

        public T CallDelete<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
     
            return DeleteExecute<T>(url, parameters.CacthInternalExaption);
        }

        public Task<HttpResponseMessage> CallDeleteAsync(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            return DeleteExecuteAsync(url, parameters.CacthInternalExaption);
        }

        #endregion

        #region Private Method
        private string BuildUrl(string action, string controller, object parametersUrl = null)
        {
            var urlApi = string.Format("{0}/{1}/{2}", _urlApi, controller, action);
            if (parametersUrl != null)
            {
                urlApi = urlApi.SetQueryParams(parametersUrl);
            }

            return urlApi;
        }

        private JsonSerializerSettings GetDeserializedSettings()
        {
            var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = "dd/MM/yyyy" };
            var decimalConverter = new DecimalJsonConverter();
            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.Converters.Add(dateTimeConverter);
            settings.Converters.Add(decimalConverter);

            return settings;
        }

        private static StringContent GetContentString(object param)
        {
            var jsonString = JsonConvert.SerializeObject(param);
            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
            return content;
        }

        private static FormUrlEncodedContent GetContentFormEncode(object param)
        {
            var content = new FormUrlEncodedContent(param.ToFormUrlEncodedContent());
            return content;
        }

        private static void AnonymousSetSessions(AnonymousType isAnonymous, object @params)
        {
            switch (isAnonymous)
            {
                case AnonymousType.CatchCredential:
                    var customIdentity = new Common.Services.Interceptor.CustomIdentity
                    {
                        Family = GetPropValue(@params, "Empresa").ToString(),
                        Name = GetPropValue(@params, "Mail").ToString()
                    };
                    GenericPrincipal principal = new GenericPrincipal(customIdentity, null);
                    Thread.CurrentPrincipal = principal;
                    break;
                case AnonymousType.None:
                    break;
                case AnonymousType.WithoutCredential:
                    var ci = new Common.Services.Interceptor.CustomIdentity
                    {
                        Family = "0",
                        Name = GetPropValue(@params, "mail").ToString()
                    };
                    GenericPrincipal main = new GenericPrincipal(ci, null);
                    Thread.CurrentPrincipal = main;
                    break;
                case AnonymousType.WithoutFamily:
                    var ciwf = new Common.Services.Interceptor.CustomIdentity
                    {
                        Family = "0",
                        Name = "",
                        IdUser = ""
                    };
                    GenericPrincipal principalMainwf = new GenericPrincipal(ciwf, null);
                    Thread.CurrentPrincipal = principalMainwf;
                    break;
                case AnonymousType.RenewCredential:
                    var cii = new Services.Interceptor.CustomIdentity
                    {
                        Family = GetPropValue(@params, "empresa").ToString(),
                        IdUser = GetPropValue(@params, "usuarioId").ToString()
                    };
                    GenericPrincipal principalMain = new GenericPrincipal(cii, null);
                    Thread.CurrentPrincipal = principalMain;
                    break;


                default:
                    throw new ArgumentOutOfRangeException(isAnonymous.ToString(), isAnonymous, null);
            }
        }

        private static object GetPropValue(object src, string propName)
        {
            return src.GetType().GetProperty(propName).GetValue(src, null);
        }

        #endregion


        public void EscribirCustomIdentity(string familia,string mail)
        {
            var customIdentity = new Common.Services.Interceptor.CustomIdentity
            {
                Family = familia,
                Name = mail
            };
            GenericPrincipal principal = new GenericPrincipal(customIdentity, null);
            Thread.CurrentPrincipal = principal;
            
        }
    }
}