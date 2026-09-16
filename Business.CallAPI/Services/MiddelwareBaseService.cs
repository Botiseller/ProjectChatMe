using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Business.CallAPI.Services
{
    public class MiddelwareBaseService
    {
        



       


        public static GenericRs CalltoApiPost<GenericRs>(string url, string jsonRequest, Dictionary<string, string> headerParams)
        {
            return CalltoApiPost<GenericRs>(url, null, null, jsonRequest, headerParams);
        }

        public static GenericRs CalltoApiPost<GenericRs>(string url, Dictionary<string, string> parameters, string jsonRequest, Dictionary<string, string> headerParams)
        {
            return CalltoApiPost<GenericRs>(url, parameters, null, jsonRequest, headerParams);
        }

        public static GenericRs CalltoApiPost<GenericRs>(string url, Dictionary<string, string> parameters, Dictionary<string, string> formDataParams, string jsonRequest, Dictionary<string, string> headerParams)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;


            if (parameters != null && parameters.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.UserAgent = "Botiseller";
            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }


            httpWebRequest.Method = "POST";


            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                //uso de form-data
                if (formDataParams != null && formDataParams.Count > 0)
                {
                    httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                    string postData = "";

                    foreach (var paramKey in formDataParams.Keys)
                    {
                        postData += paramKey + "=" + formDataParams[paramKey] + "&";
                    }
                    postData = postData.Substring(0, postData.Length - 1);



                    streamWriter.Write(postData);

                }

                if (!string.IsNullOrEmpty(jsonRequest))
                    streamWriter.Write(jsonRequest);

                streamWriter.Flush();
                streamWriter.Close();
            }


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = httpWebRequest.GetRequestStream();

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    content = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();

                }
            }

            content = normalizeResponse(url, content, headerParams,parameters);

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }

        public static async Task<GenericRs> CalltoApiPostAsync<GenericRs>(string url, Dictionary<string, string> parameters, Dictionary<string, string> formDataParams, string jsonRequest, Dictionary<string, string> headerParams)
        {
            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            if (parameters != null && parameters.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.UserAgent = "Botiseller";

            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }

            httpWebRequest.Method = "POST";

            // GetRequestStreamAsync en lugar de GetRequestStream
            using (StreamWriter streamWriter = new StreamWriter(await httpWebRequest.GetRequestStreamAsync().ConfigureAwait(false)))
            {
                if (formDataParams != null && formDataParams.Count > 0)
                {
                    httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                    string postData = "";

                    foreach (var paramKey in formDataParams.Keys)
                    {
                        postData += paramKey + "=" + formDataParams[paramKey] + "&";
                    }
                    postData = postData.Substring(0, postData.Length - 1);

                    await streamWriter.WriteAsync(postData).ConfigureAwait(false);
                }

                if (!string.IsNullOrEmpty(jsonRequest))
                    await streamWriter.WriteAsync(jsonRequest).ConfigureAwait(false);

                await streamWriter.FlushAsync().ConfigureAwait(false);
            }

            try
            {
                // GetResponseAsync en lugar de GetResponse (y una sola vez)
                using (HttpWebResponse response = (HttpWebResponse)await httpWebRequest.GetResponseAsync().ConfigureAwait(false))
                {
                    string description = response.StatusDescription;

                    if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                    {
                        using (Stream dataStream = response.GetResponseStream())
                        using (StreamReader reader = new StreamReader(dataStream))
                        {
                            content = await reader.ReadToEndAsync().ConfigureAwait(false);
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    using (var errorReader = new StreamReader(ex.Response.GetResponseStream()))
                    {
                        content = await errorReader.ReadToEndAsync().ConfigureAwait(false);
                    }
                }
            }

            content = normalizeResponse(url, content, headerParams, parameters);

            return JsonConvert.DeserializeObject<GenericRs>(content);
        }

        public static GenericRs CalltoApiPut<GenericRs>(string url, string jsonRequest, Dictionary<string, string> headerParams)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.UserAgent = "Botiseller";
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";

            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }


            httpWebRequest.Method = "PUT";


            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(jsonRequest);
                streamWriter.Flush();
                streamWriter.Close();
            }


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = httpWebRequest.GetRequestStream();

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {

                    string response = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();


                }
            }

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }

        public static GenericRs CalltoApiPut<GenericRs>(string url, string jsonRequest, Dictionary<string, string> headerParams, AuthenticationMode authentication)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.UserAgent = "Botiseller";
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.Method = "PUT";

            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }

            switch (authentication.AuthenticationType)
            {
                case AuthenticationTypeEnum.Basic:
                    //string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authentication.User}:{authentication.Password}"));
                    //httpWebRequest.Headers[HttpRequestHeader.Authorization] = $"Basic {credentials}";

                    string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authentication.User}:{authentication.Password}"));
                    httpWebRequest.Headers.Add("Authorization", $"Basic {credentials}");

                    break;
            }


            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(jsonRequest);
                streamWriter.Flush();
                streamWriter.Close();
            }


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = httpWebRequest.GetRequestStream();

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {

                    string response = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();


                }
            }

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }

        public static void CalltoApiDelete(string url, string jsonRequest, Dictionary<string, string> headerParams)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";

            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }


            httpWebRequest.Method = "DELETE";


            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(jsonRequest);
                streamWriter.Flush();
                streamWriter.Close();
            }


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = httpWebRequest.GetRequestStream();

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {

                    string response = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();


                }
            }


        }

        public static GenericRs CalltoApi<GenericRs>(string url, Dictionary<string, string> parameters, Dictionary<string, string> headerParams)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string content = string.Empty;

            if (parameters != null && parameters.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.UserAgent = "Botiseller";
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.Method = "GET";
            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }



            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream dataStream = null;


            // Display the status
            string description = response.StatusDescription;


            if (description.Equals("OK"))
            {
                // Get the stream containing content returned by the server.
                dataStream = response.GetResponseStream();
                //Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd().Trim();
                //Display the content.
                content = responseFromServer;
                reader.Close();
                dataStream.Close();
                response.Close();
            }

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }

        public static GenericRs CalltoApi<GenericRs>(string url, Dictionary<string, string> parameters, Dictionary<string, string> headerParams, AuthenticationMode authentication)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string content = string.Empty;

            if (parameters != null && parameters.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.UserAgent = "Botiseller";
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.Method = "GET";
            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }


            switch (authentication.AuthenticationType) {
                case AuthenticationTypeEnum.Basic:
                    //string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authentication.User}:{authentication.Password}"));
                    //httpWebRequest.Headers[HttpRequestHeader.Authorization] = $"Basic {credentials}";

                    string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authentication.User}:{authentication.Password}"));
                    httpWebRequest.Headers.Add("Authorization", $"Basic {credentials}");

                    break;
            }


            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = null;

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    content = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();

                }
            }

            content = normalizeResponse(url, content, headerParams, parameters);

            return JsonConvert.DeserializeObject<GenericRs>(content);







        }

        public static GenericRs CalltoApiPost<GenericRs>(string url, Dictionary<string, string> parameters, Dictionary<string, string> formDataParams, string jsonRequest, Dictionary<string, string> headerParams, AuthenticationMode authentication)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;


            if (parameters != null && parameters.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.UserAgent = "Botiseller";
            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }

            switch (authentication.AuthenticationType)
            {
                case AuthenticationTypeEnum.Basic:
                    string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authentication.User}:{authentication.Password}"));
                    httpWebRequest.Headers[HttpRequestHeader.Authorization] = $"Basic {credentials}";
                    break;
            }

            httpWebRequest.Method = "POST";


            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                //uso de form-data
                if (formDataParams != null && formDataParams.Count > 0)
                {
                    httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                    string postData = "";

                    foreach (var paramKey in formDataParams.Keys)
                    {
                        postData += paramKey + "=" + formDataParams[paramKey] + "&";
                    }
                    postData = postData.Substring(0, postData.Length - 1);



                    streamWriter.Write(postData);

                }

                if (!string.IsNullOrEmpty(jsonRequest))
                    streamWriter.Write(jsonRequest);

                streamWriter.Flush();
                streamWriter.Close();
            }


            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream dataStream = httpWebRequest.GetRequestStream();

                //Get the response.
                WebResponse response2 = httpWebRequest.GetResponse();
                // Display the status
                string description = ((HttpWebResponse)response2).StatusDescription;


                if (description.Equals("OK") || description.Equals("Accepted") || description.Equals("Created"))
                {
                    // Get the stream containing content returned by the server.
                    dataStream = response.GetResponseStream();
                    //Open the stream using a StreamReader for easy access.
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.
                    string responseFromServer = reader.ReadToEnd();
                    //Display the content.
                    content = responseFromServer;
                    reader.Close();
                    dataStream.Close();
                    response.Close();
                }

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    content = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();

                }
            }

            content = normalizeResponse(url, content, headerParams, parameters);

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }

        public static string CalltoApiGetImage(string url, Dictionary<string, string> parameters, Dictionary<string, string> headerParams)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string content = string.Empty;

            if (parameters?.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }


            string base64 = string.Empty;
            using (var httpClient = new HttpClient())
            {
                var response = httpClient.GetAsync(url).Result;
                if (headerParams?.Count() > 0)
                {
                    foreach (var keyHeader in headerParams.Keys)
                    {
                        httpClient.DefaultRequestHeaders.Add(keyHeader, headerParams[keyHeader]);
                    }
                }
                httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Botiseller");

                if (response.IsSuccessStatusCode)
                {
                    var byteArray = response.Content.ReadAsByteArrayAsync().Result;
                    base64 = Convert.ToBase64String(byteArray);
                }

            }

            return base64;

        }

        public static byte[] CalltoApiGetImageArray(string url, Dictionary<string, string> parameters, Dictionary<string, string> headerParams)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string content = string.Empty;

            if (parameters?.Count() > 0)
            {
                var parameterString = "?";
                foreach (var keyParameter in parameters.Keys)
                {
                    parameterString += keyParameter + "=" + parameters[keyParameter] + "&";
                }
                url += parameterString.Substring(0, parameterString.Length - 1);
            }


            byte[] byteArray = null;
            using (var httpClient = new HttpClient())
            {
                if (headerParams?.Count() > 0) {
                    foreach (var keyHeader in headerParams.Keys)
                    {
                        httpClient.DefaultRequestHeaders.Add(keyHeader, headerParams[keyHeader]);
                    }
                }
                httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Botiseller");
                var response = httpClient.GetAsync(url).Result;

                if (response.IsSuccessStatusCode)
                {
                    byteArray = response.Content.ReadAsByteArrayAsync().Result;
                }

            }

            return byteArray;

        }

        public static GenericRs CallToApiPostFile<GenericRs>(string url, byte[] fileBytes, Dictionary<string, string> headerParams)
        {

            string content = string.Empty;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/octet-stream";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.UserAgent = "Botiseller";

            //recorremos los headers y se los agregamos al contenido
            if (headerParams != null && headerParams.Count() > 0)
            {
                foreach (var keyHeader in headerParams.Keys)
                {
                    httpWebRequest.Headers.Add(keyHeader, headerParams[keyHeader]);
                }
            }

            httpWebRequest.Method = "POST";

            using (Stream requestStream = httpWebRequest.GetRequestStream())
            {

                //mandamos el archivo binario como body
                requestStream.Write(fileBytes, 0, fileBytes.Length);

                requestStream.Flush();
                requestStream.Close();

            }

            try
            {

                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();

                Stream dataStream = response.GetResponseStream();

                StreamReader reader = new StreamReader(dataStream);

                string responseFromServer = reader.ReadToEnd();

                content = responseFromServer;

                reader.Close();
                dataStream.Close();
                response.Close();

            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    content = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                }
            }

            return JsonConvert.DeserializeObject<GenericRs>(content);

        }


        private static string normalizeResponse(string url, string content, Dictionary<string, string> headerParams, Dictionary<string, string> parameters) {
            //se puede ir armando la normalizaciòn dependiendo los datos con los que se llamo a la URL
            if (url.Contains("gemini") && content.Contains("\"functionCall\"") && content.Contains("\"args\"") && content.Contains("gemini")) {
                content = normalizeResponse_Gemini(content);
            }
            return content;
        }

        private static string normalizeResponse_Gemini(string content){
            var jObj = Newtonsoft.Json.Linq.JObject.Parse(content);
            var functionCalls = jObj.SelectTokens("$..functionCall").ToList();
            foreach (var fCall in functionCalls)
            {
                var argsToken = fCall["args"];
                if (argsToken != null && argsToken.Type == JTokenType.Object)
                {
                    // serializa el objeto args a string
                    //fCall["arguments"] = JsonConvert.SerializeObject(argsToken);
                    // elimina el original
                    fCall["args"] = JsonConvert.SerializeObject(argsToken); ;
                }
            }

            // sobrescribimos el contenido con el JSON modificado
            content = jObj.ToString(Formatting.None);
            return content;

        }

        public enum AuthenticationTypeEnum
        {
            Basic = 1
        }

        public class AuthenticationMode {
            public AuthenticationTypeEnum AuthenticationType { get; set; }
            public string User { get; set; }
            public string Password { get; set; }

        }



    }
}
