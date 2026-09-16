using Common.Utility;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Common.CallApi
{
    public sealed class HttpClientNoUserWrapper : HttpClientWrapperNoUserBase
    {

        public HttpClientNoUserWrapper() {
            _urlApiNoUser = Helper.GetWebSetingValue("WebApiNoUserUrl");
        }

        public HttpClientNoUserWrapper(string urlApi)
        {
            _urlApiNoUser = urlApi;
        }

        private readonly string _urlApiNoUser;

        #region Get

        public HttpResponseMessage Call(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            
            return GetExecute(url, parameters.CacthInternalExaption);
        }

        public T Call<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
           
            return GetExecute<T>(url, parameters.CacthInternalExaption);
        }

        public async Task<T> CallAsync<T>(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            
            var r = await GetExecuteAsync<T>(url, parameters.CacthInternalExaption).ConfigureAwait(false);
            return r;
        }

        public async Task CallAsync(Func<MethodParameters> param)
        {
            var parameters = param.Invoke();
            var url = BuildUrl(parameters.Action, parameters.Controller, parameters.Params);
            
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

   


        #region Private Method
        private string BuildUrl(string action, string controller, object parametersUrl = null)
        {
            var urlApi = string.Format("{0}/{1}/{2}", _urlApiNoUser, controller, action);
            if (parametersUrl != null)
            {
                urlApi = urlApi.SetQueryParams(parametersUrl);
            }

            return urlApi;
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

       

      

        #endregion


      


    }
}