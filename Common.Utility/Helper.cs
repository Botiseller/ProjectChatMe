using Common.Utility.Extensions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.SessionState;

namespace Common.Utility
{
    public static class Helper
    {

        public static string GetFileNameFromUrl(string url)
        {
            // Usar Uri para parsear la URL
            Uri uri = new Uri(url);

            // Obtener el último segmento de la URL
            return Path.GetFileName(uri.LocalPath);
        }

        public static string GetPlainTextFromHtml(string html)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Select all text nodes and concatenate their InnerText
            return string.Join(" ", doc.DocumentNode.SelectNodes("//text()").Select(node => node.InnerText));
        }

        /// <summary>
        /// convierte un texto a base 64
        /// </summary>
        /// <param name="plainText"></param>
        /// <returns></returns>
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        public static byte[] Base64ToArray(string textBase64)
        {
            return Convert.FromBase64String(textBase64);
        }

        public static byte[] ConseguirArchivoDesdeUrlWeb(string url)
        {

            //var pathActual = System.Reflection.Assembly.GetExecutingAssembly().Location;
            string archivoTemp = Path.GetTempPath();
            string nameFile = archivoTemp + "\\Imagen" + Guid.NewGuid().ToString() + System.IO.Path.GetExtension(url);

            using (WebClient client = new WebClient())
            {
                client.DownloadFile(new Uri(url), nameFile);
            }

            FileStream fs = new FileStream(nameFile, FileMode.OpenOrCreate, FileAccess.Read);
            Byte[] img = new Byte[fs.Length];
            fs.Read(img, 0, Convert.ToInt32(fs.Length));

            return img;
        }

        public static string ConseguirArchivoStringDesdeUrlWeb(string url)
        {
            var audioByte = ConseguirArchivoDesdeUrlWeb(url);
            string base64String = Convert.ToBase64String(audioByte);

            return base64String;
        }

        public static string CalculateMd5Hash(string input)
        {
            byte[] stream;
            StringBuilder sb;
            using (MD5 md5 = MD5CryptoServiceProvider.Create())
            {
                ASCIIEncoding encoding = new ASCIIEncoding();
                sb = new StringBuilder();
                stream = md5.ComputeHash(encoding.GetBytes(input));
            }
            for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:x2}", stream[i]);
            return sb.ToString();
        }

        public static string GetWebSetingValue(string key)
        {
            return WebConfigurationManager.AppSettings[key];

        }

        

        public static byte[] DecodeBase64ToBytes(string base64Url)
        {
            // Reemplazar caracteres base64url por base64 estándar
            string base64 = base64Url.Replace('-', '+').Replace('_', '/');

            // Agregar padding si falta
            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
                case 1: base64 += "==="; break;
            }

            // Convertir a byte[]
            return Convert.FromBase64String(base64);
        }

        public static string convertObjectTo64Base(object obj)
        {
            var dataObject = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
            return Convert.ToBase64String(dataObject);
        }

        /// <summary>
        /// Convierte un mensaje MIME a Base64 URL-safe para Gmail API
        /// </summary>
        /// <param name="mimeMessage">Mensaje MIME completo (headers + cuerpo)</param>
        /// <returns>Base64 URL-safe listo para enviar en Message.Raw</returns>
        public static string MimeToBase64Url(string mimeMessage)
        {
            if (string.IsNullOrEmpty(mimeMessage))
                throw new ArgumentException("El mensaje MIME no puede ser null o vacío.");

            // 1) Convertir a bytes UTF-8
            byte[] bytes = Encoding.UTF8.GetBytes(mimeMessage);

            // 2) Convertir a Base64
            string base64 = Convert.ToBase64String(bytes);

            // 3) Hacer URL-safe: + -> -, / -> _, eliminar =
            string base64Url = base64.Replace("+", "-").Replace("/", "_").Replace("=", "");

            return base64Url;
        }

        public static string DecodeBase64String(string input)
        {
            // 1. Limpia caracteres que no deberían estar
            input = input.Trim().Replace(" ", "").Replace("\r", "").Replace("\n", "");

            // 2. Si es base64-url (usado en JWT y algunas APIs), convertirlo a base64 estándar
            input = input.Replace('-', '+').Replace('_', '/');

            // 3. Asegura padding (debe ser múltiplo de 4)
            switch (input.Length % 4)
            {
                case 2: input += "=="; break;
                case 3: input += "="; break;
                case 1: throw new FormatException("Cadena Base64 inválida. Largo incorrecto."); // ya no puede ser corregido
            }

            byte[] bytes = Convert.FromBase64String(input);
            return Encoding.UTF8.GetString(bytes);
        }


        public static T DecodeBase64ToJson<T>(string base64String)
        {
            // Decodifica Base64 a bytes
            byte[] data = Convert.FromBase64String(base64String);

            // Convierte bytes a string
            string json = Encoding.UTF8.GetString(data);

            // Deserializa usando Newtonsoft.Json
            return JsonConvert.DeserializeObject<T>(json);
        }


        public static string GetTokenBySession()
        {
            string token = string.Empty;
            try
            {
                switch (System.Threading.Thread.CurrentPrincipal.Identity) {
                    case Common.Services.Interceptor.CustomIdentity identity:
                        token = ((Common.Services.Interceptor.CustomIdentity)(System.Threading.Thread.CurrentPrincipal.Identity)).Token;
                        break;
                    case System.Web.Security.FormsIdentity forms:
                        token = ((System.Web.Security.FormsIdentity)System.Threading.Thread.CurrentPrincipal.Identity).Ticket.UserData.Split(':')[4];
                        break;
                }

            }
            catch { }

            return token;
        }

        public static string GetFamilyBySession()
        {
            string Family = string.Empty;
            try
            {
                switch (System.Threading.Thread.CurrentPrincipal.Identity)
                {
                    case Common.Services.Interceptor.CustomIdentity identity:
                        Family = ((Common.Services.Interceptor.CustomIdentity)(System.Threading.Thread.CurrentPrincipal.Identity)).Family;
                        break;
                    case System.Web.Security.FormsIdentity forms:
                        Family = ((System.Web.Security.FormsIdentity)System.Threading.Thread.CurrentPrincipal.Identity).Ticket.UserData.Split(':')[1];
                        break;
                }
            }
            catch { }

            return Family;
        }

        public static Guid GetUserBySession()
        {
            string user = string.Empty;
            try
            {
                switch (System.Threading.Thread.CurrentPrincipal.Identity)
                {
                    case Common.Services.Interceptor.CustomIdentity identity:
                        user = ((Common.Services.Interceptor.CustomIdentity)(System.Threading.Thread.CurrentPrincipal.Identity)).IdUser;
                        break;
                    case System.Web.Security.FormsIdentity forms:
                        user = ((System.Web.Security.FormsIdentity)System.Threading.Thread.CurrentPrincipal.Identity).Ticket.UserData.Split(':')[2];
                        break;

                }
            }
            catch { }

            return new Guid(user);
        }

        public static string  NormalizarCadena(string cadena)
        {
            if (cadena == null)
                return null;

            string cadenaNormalizada = cadena.ToLower()
                                             .Replace("á", "a")
                                             .Replace("é", "e")
                                             .Replace("í", "i")
                                             .Replace("ó", "o")
                                             .Replace("ú", "u")
                                             .Replace(" ", "");

            return cadenaNormalizada;
        }

        public static string ConseguirUniqueString()
        {
            string result = string.Empty;
            string date = DateTime.Now.ToString("ddMMyyyyhhmmss");
            Random rnd = new Random();
            date += rnd.Next(1, 62).ToString("D2");
            date += rnd.Next(1, 62).ToString("D2");
            for (int i = 0; i < date.Length; i += 2)
            {
                var c = date.Substring(i, 2);
                result += Convert.ToInt32(c).convertToString();
            }

            return result;
        }

 

    

        public static string getVersionScript() 
        {
            return GetWebSetingValue("version");
        }

        public static string SerializeObject(object obj) { 
            return JsonConvert.SerializeObject(obj, new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All,
                    NullValueHandling = NullValueHandling.Ignore
                });
        }

        public static string SerializeObjectSimple(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T DeserializeObject<T>(string obj)
        {
            return JsonConvert.DeserializeObject<T>(obj, new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All
                });
        }


        public static string HtmlToPlainText(string html)
        {
            if (string.IsNullOrEmpty(html))
                return string.Empty;

            // Reemplaza saltos de línea de etiquetas <br> y <p>
            html = Regex.Replace(html, @"<(br|BR)\s*/?>", "\n");
            html = Regex.Replace(html, @"<(p|P)[^>]*>", "\n");

            // Elimina todas las demás etiquetas
            html = Regex.Replace(html, @"<[^>]+>", string.Empty);

            // Decodifica entidades HTML (&nbsp;, &amp;, etc.)
            html = System.Net.WebUtility.HtmlDecode(html);

            return html.Trim();
        }

        public static void GuardarImagenEnFtpDirectorio(byte[] imagen, string nombreArchivo, string entidad)
        {


            string[] ftpConnect = GetWebSetingValue("ftpConnectImages").ToString().Split(';');
            string serverFtp = ftpConnect[0];
            string puertoFtp = ftpConnect[1];
            string usuarioFtp = ftpConnect[2];
            string pwdFtp = ftpConnect[3];

            string ftpRutaArchivo = $"ftp://{serverFtp}:{puertoFtp}/{entidad}/{nombreArchivo}";

            // Verificar si el archivo ya existe
            bool archivoExiste = false;
            try
            {
                FtpWebRequest checkRequest = (FtpWebRequest)WebRequest.Create(ftpRutaArchivo);
                checkRequest.Method = WebRequestMethods.Ftp.GetFileSize;
                checkRequest.Credentials = new NetworkCredential(usuarioFtp, pwdFtp);
                using (var checkResponse = (FtpWebResponse)checkRequest.GetResponse())
                {
                    archivoExiste = true; // Si no lanza excepción, el archivo existe
                }
            }
            catch (WebException ex)
            {
                if (((FtpWebResponse)ex.Response).StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                {
                    archivoExiste = false; // El archivo no existe
                }
                else
                {
                    throw; // Otros errores se relanzan
                }
            }

            // Si no existe, lo sube
            if (!archivoExiste)
            {
                FtpWebRequest uploadRequest = (FtpWebRequest)WebRequest.Create(ftpRutaArchivo);
                uploadRequest.Method = WebRequestMethods.Ftp.UploadFile;
                uploadRequest.Credentials = new NetworkCredential(usuarioFtp, pwdFtp);
                uploadRequest.UseBinary = true;
                uploadRequest.ContentLength = imagen.Length;

                using (Stream requestStream = uploadRequest.GetRequestStream())
                {
                    requestStream.Write(imagen, 0, imagen.Length);
                }

            
            }
        
        }



        public static decimal ParseDecimal(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return 0m;
            return decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result)
                ? result
                : 0m;
        }

        public static int ParseInt(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return 0;
            // Por si viene con decimales tipo "123.0"
            return decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result)
                ? (int)result
                : 0;
        }

        public static DateTime ParseFecha(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return default;
            return DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result)
                ? result
                : default;
        }
    }
}