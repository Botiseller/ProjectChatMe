using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Common.BusinessException;

namespace Common.CallApi
{
    public abstract class HttpClientWrapperBase : IDisposable
    {
        private AsyncLazy<HttpClient> _lazyClient;

        public WebApiResult ResultState { get; set; }

        protected HttpClientWrapperBase()
        {
            ServicePointManager.Expect100Continue = false;
            ServicePointManager.CheckCertificateRevocationList = false;
            HttpClient client = HttpClientFactory.Create(new HttpClientMessageHandnler());
            _lazyClient = new AsyncLazy<HttpClient>(valueFactory: () => client);
        }

        protected HttpClient Client()
        {
            if (_lazyClient == null)
            {
                throw new ObjectDisposedException("WebClient has been disposed");
            }

            return _lazyClient.GetAwaiter().GetResult();
        }

        #region Get
        protected HttpResponseMessage GetExecute(string url, bool cacthInternalExaption)
        {
            var result = Client().GetAsync(url).Result;
            return result;            
        }

        protected T GetExecute<T>(string url, bool cacthInternalExaption)
        {
            var result = Client().GetAsync(url).Result;
            string json = result.Content.ReadAsStringAsync().Result;
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(json) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, json);
        }

        protected async Task<T> GetExecuteAsync<T>(string url, bool cacthInternalExaption)
        {
            var result = await Client().GetAsync(url).ConfigureAwait(false);
            string json = await result.Content.ReadAsStringAsync().ConfigureAwait(false);
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(json) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, json);
        }

        protected async Task<string> GetExecuteAsync(string url, bool cacthInternalExaption)
        {
            var result = await Client().GetAsync(url).ConfigureAwait(false);
            if (result.IsSuccessStatusCode)
            {
                return null;
            }
            var message = await result.Content.ReadAsStringAsync().ConfigureAwait(false);
            SetBussisnesException(result.StatusCode, cacthInternalExaption, message);
            return null;
        }

        #endregion
        #region Post
        protected T PostExecute<T>(string url, StringContent content, bool cacthInternalExaption)
        {
            var result = Client().PostAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;

            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(resultContent) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, resultContent);
        }

        protected Task<string> PostExecuteAsync(string url, StringContent content, bool cacthInternalExaption)
        {

            var result = Client().PostAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync();
            if (!result.IsSuccessStatusCode)
            {
                SetBussisnesException(result.StatusCode, cacthInternalExaption, resultContent.Result);
            }

            return resultContent;
        }

        protected T PostExecute<T>(string url, FormUrlEncodedContent content, bool cacthInternalExaption)
        {
            var result = Client().PostAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(resultContent) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, resultContent);
        }

        protected Task<string> PostExecuteAsync(string url, FormUrlEncodedContent content, bool cacthInternalExaption)
        {
            var result = Client().PostAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync();
            if (!result.IsSuccessStatusCode)
                SetBussisnesException(result.StatusCode, cacthInternalExaption, resultContent.Result);

            return resultContent;
        }

        #endregion

        #region Put
        protected T PutExecute<T>(string url, StringContent content, bool cacthInternalExaption)
        {
            var result = Client().PutAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(resultContent) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, resultContent);
        }

        protected Task<string> PutExecuteAsync(string url, StringContent content, bool cacthInternalExaption)
        {
            var result = Client().PutAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync();
            if (!result.IsSuccessStatusCode)
                SetBussisnesException(result.StatusCode, cacthInternalExaption, resultContent.Result);

            return resultContent;
        }

        protected T PutExecute<T>(string url, FormUrlEncodedContent content, bool cacthInternalExaption)
        {
            var result = Client().PutAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(resultContent) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, resultContent);
        }

        protected Task<string> PutExecuteAsync(string url, FormUrlEncodedContent content, bool cacthInternalExaption)
        {
            var result = Client().PutAsync(url, content).Result;
            var resultContent = result.Content.ReadAsStringAsync();
            if (!result.IsSuccessStatusCode)
                SetBussisnesException(result.StatusCode, cacthInternalExaption, resultContent.Result);

            return resultContent;
        }
        #endregion

        #region Delete

        protected T DeleteExecute<T>(string url, bool cacthInternalExaption)
        {
        
            var result = Client().DeleteAsync(url).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            return result.IsSuccessStatusCode ? JsonConvert.DeserializeObject<T>(resultContent) : SetBussisnesException<T>(result.StatusCode, cacthInternalExaption, resultContent);
        }

        protected Task<HttpResponseMessage> DeleteExecuteAsync(string url, bool cacthInternalExaption)
        {
            var r = new TaskFactory().StartNew(() =>
            {
                var result = Client().DeleteAsync(url).Result;
                var resultContent = result.Content.ReadAsStringAsync().Result;
                if (!result.IsSuccessStatusCode)
                    SetBussisnesException(result.StatusCode, cacthInternalExaption, resultContent);

                return result;
            });

            return r;
        }

        #endregion

        private void SetBussisnesException(HttpStatusCode statusCode, bool cacthInternalExaption, string message)
        {
            switch (cacthInternalExaption)
            {
                case true:
                    ResultState = new WebApiResult
                    {
                        Message = message,
                        HttoStatusCode = statusCode
                    };
                    break;
                default:
                    throw new APIException(statusCode, message);
            }
        }

        private T SetBussisnesException<T>(HttpStatusCode statusCode, bool cacthInternalExaption, string jsonData)
        {
            switch (cacthInternalExaption)
            {
                case true:
                    ResultState = JsonConvert.DeserializeObject<WebApiResult>(jsonData);
                    ResultState.HttoStatusCode = statusCode;
                    return JsonConvert.DeserializeObject<T>(jsonData);
                default:
                    throw new APIException(statusCode, jsonData);
            }
        }

        ~HttpClientWrapperBase()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(false);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_lazyClient == null) return;
            if (!disposing) return;
            if (!_lazyClient.IsValueCreated) return;
            _lazyClient.Value.Dispose();
            _lazyClient = null;

            // There are no unmanaged resources to release, but
            // if we add them, they need to be released here.
        }
    }
}