//using PdfSharp.Pdf;
using DocumentFormat.OpenXml.Packaging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using UglyToad.PdfPig;

namespace Common.Utility.Extensions
{
    public static class StringExtensions
    {

        public static string GetVariableName(this string input)
        {
            input = input.Trim().Replace("{", "").Replace("}", "").Replace("$", "");
            return input;
        }

        public static string LastCharacters(this string input, int count)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            if (input.Length <= count)
                return input;

            return input.Substring(input.Length - count, count);
        }

        public static bool IsJson(this string input)
        {
            input = input.Trim();
            return input.StartsWith("{") && input.EndsWith("}")
                   || input.StartsWith("[") && input.EndsWith("]");
        }

        public static int WordCount(this String str)
        {
            return str.Split(new char[] { ' ', '.', '?' },
                             StringSplitOptions.RemoveEmptyEntries).Length;
        }

        public static string Cut(this string s, int length)
        {
            return s.Length <= length ? s : s.Substring(0, length);
        }

        public static string RemoveAccent(this string s)
        {
            return s.Replace('á', 'a').Replace('é', 'e').Replace('í', 'i').Replace('ó', 'o').Replace('ú', 'u');
        }

        public static string RemoveSpace(this string s)
        {
            return s.Replace(" ", "");
        }

        public static string RemovePreposition(this string s)
        {
            var words = s.Split(' ').ToList();
            var t = string.Empty;

            string[] prepositions = { "a", "ante", "bajo", "cabe", "con", "contra", "de", "desde", "en", "entre", "hacia", "hasta", "para", "por", "según", "sin", "so", "sobre", "tras", "y", "o" };
            string[] palabrasSinPreposiciones = words.Where(palabra => !prepositions.Contains(palabra.ToLower())).ToArray();
            t = string.Join(" ", palabrasSinPreposiciones);

            return t;
        }

        

        public static string PascalCase(this string texto)
        {
            return char.ToUpper(texto[0]) + texto.ToLower().Substring(1);
        }

        public static string RemoveLetters(this string s)
        {
            var n = string.Empty;
            foreach (var c in s.ToCharArray())
            {
                if (char.IsNumber(c))
                    n += c.ToString();
            }
            return n;
        }

        public static int CountWords(this string text)
        {
            // Contar palabras en el texto dado
            if (string.IsNullOrWhiteSpace(text))
            {
                return 0;
            }

            string[] words = text.Split(new[] { ' ', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            return words.Length;
        }

        public static int convertGoogleTag(this string Tag)
        {
            int value = 0;
            switch (Tag)
            {
                case "UNKNOWN": //desconocido
                    value = 0;
                    break;
                case "ADJ": //adjetivo
                    value = 1;
                    break;
                case "ADP": //preposicion
                    value = 2;
                    break;
                case "ADV": //advervio
                    value = 3;
                    break;
                case "CONJ": //conjuciones(or, else, and)
                    value = 4;
                    break;
                case "DET": //determinantes
                    value = 5;
                    break;
                case "NOUN": //sustantivo
                    value = 6;
                    break;
                case "NUM": //numero
                    value = 7;
                    break;
                case "PRON": //pronombre
                    value = 8;
                    break;
                case "PRT": //preposicion
                    value = 2;
                    break;
                case "PUNCT": //puntuaciòn
                    value = 9;
                    break;
                case "VERB": //verbo
                    value = 10;
                    break;
                case "X": //varios
                    value = 11;
                    break;
                case "AFFIX": //
                    value = 12;
                    break;

            }
            return value;
        }


        /// <summary>
        /// /Validate text if is a email address
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static bool ismail(this string text) {
            try
            {
                MailAddress m = new MailAddress(text);
                return true;
            }
            catch
            {
                return false;
            }
        }


        /// <summary>
        /// /Validate text if is a Guid address
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static bool isGuid(this string text)
        {
            try
            {
                var g = new Guid(text);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool isInt(this string text)
        {
            try
            {
                Convert.ToInt32(text);
                return true;
            }
            catch
            {
                return false;
            }
        }


        public static decimal parseToDecimal(this string text)
        {
            decimal valor = 0;
            try
            {
                if (text.Contains("."))
                {
                    int indexOfDecimalPoint = text.IndexOf(".");
                    int length = text.Length;

                    // Si hay más de dos decimales, truncalos

                    if (length - indexOfDecimalPoint > 3)
                    {
                        text = text.Substring(0, indexOfDecimalPoint + 3);
                    }
                }
                NumberFormatInfo formatInfo = CultureInfo.CurrentCulture.NumberFormat;
                // Reemplaza el separador de miles si es diferente
                text = text.Replace(",", "");
                text = text.Replace(".", formatInfo.CurrencyDecimalSeparator);

                valor = Convert.ToDecimal(text);
            }
            catch
            {
            }

            return valor;
        }

    }

    public static class AnotherExtensions{

        public static string DownloadData(this Uri url)
        {
            var urlData = string.Empty;
            using (WebClient client = new WebClient())
            {
                try
                {
                    urlData = client.DownloadString(url.AbsoluteUri);
                }
                catch (WebException)
                {
                }
            }
            return urlData;
        }

        

        public static bool IsPdf(this string url)
        {
            using (HttpClient client = new HttpClient())
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var response = client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead).Result;
                
                if (response != null && response.IsSuccessStatusCode)
                {
                    var contentType = response.Content.Headers.ContentType.MediaType;
                    return contentType == "application/pdf";
                }
            }
            return false;
        }


        

        static string DownloadAndExtractPdf(this Uri url)
        {
            var urlPath = url.AbsoluteUri;
            string pdfPath = "document.pdf";
            var text = string.Empty;
            using (HttpClient client = new HttpClient())
            {
                var response = client.GetAsync(urlPath).Result;
                response.EnsureSuccessStatusCode();
                var content = response.Content.ReadAsByteArrayAsync().Result;
                File.WriteAllBytes(pdfPath, content);
            }

            using (UglyToad.PdfPig.PdfDocument document = PdfDocument.Open(pdfPath))
            {
                foreach (var page in document.GetPages())
                {
                    text += page.Text;

                }
            }

            return text.Replace(". ", ". \r\n\r\n");
        }

        public static string ExtractTextFromPdfUrl(this string pdfPath)
        {
            var t = string.Empty;

            var a = pdfPath.getArrayByte();
            a = File.ReadAllBytes(pdfPath);
            t = a.ExtractTextFromPdfBytes();

            return t;
        }

        private static byte[] getArrayByte(this string url)
        {
            using (HttpClient client = new HttpClient())
            {
                var response = client.GetAsync(url).Result;
                response.EnsureSuccessStatusCode();
                return response.Content.ReadAsByteArrayAsync().Result;
            }
        }


    }

    public static class IntExtensions
    {
        public static string convertToString(this Int32 number)
        {
            string[] ca = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
            return ca[number].ToString();
        }

        public static string FormatDuracionShort(this int? segundos)
        {
            if (!segundos.HasValue)
                return "o sg.";


            var l = (long)segundos.Value;
            return l.FormatDuracionShort();
        }

        public static string FormatDuracionShort(this int segundos)
        {
            var l = (long)segundos;
            return l.FormatDuracionShort();
        }

        public static string FormatDuracionShort(this long segundos)
        {
            TimeSpan duracion = TimeSpan.FromSeconds(segundos);
            return duracion.DuracionShort();
        }

        public static string FormatDuracionShort(this long? segundos)
        {
            if (!segundos.HasValue)
                return "o sg.";


            TimeSpan duracion = TimeSpan.FromSeconds(segundos.Value);
            return duracion.DuracionShort();
        }

    }

    public static class DateExtensions {

        public static DateTime? AddHours(this DateTime? dateTime, int add) {
            DateTime? t = null;
            if (dateTime.HasValue)
                t = dateTime.Value.AddHours(add);

            return t;
        }

        public static string DuracionShort(this TimeSpan duracion)
        {
            if (duracion.Days > 0)
            {
                return $"{duracion.Days}día(s) {duracion.Hours}hs. {duracion.Minutes}ms. {duracion.Seconds}sg.";
            }
            else if (duracion.Hours > 0)
            {
                return $"{duracion.Hours}hs. {duracion.Minutes}ms. {duracion.Seconds}sg.";
            }
            else if (duracion.Minutes > 0)
            {
                return $"{duracion.Minutes}ms. {duracion.Seconds}sg.";
            }
            else
            {
                return $"{duracion.Seconds}sg.";
            }
        }

        public static string Duracion(this TimeSpan duracion)
        {
            if (duracion.Days > 0)
            {
                return $"{duracion.Days}día(s) {duracion.Hours}hora(s) {duracion.Minutes}minuto(s) {duracion.Seconds}segundo(s)";
            }
            else if (duracion.Hours > 0)
            {
                return $"{duracion.Hours}hora(s) {duracion.Minutes}minuto(s) {duracion.Seconds}segundo(s)";
            }
            else if (duracion.Minutes > 0)
            {
                return $"{duracion.Minutes}minuto(s) {duracion.Seconds}segundo(s)";
            }
            else
            {
                return $"{duracion.Seconds}segundo(s)";
            }
        }

       
    }

    public static class DirectoryExtensions
    {
        public static void createDirectory(this string path)
        { 
            if(!Directory.Exists(path)){
                Directory.CreateDirectory(path);
            }
           
        }

    }

    public static class ArrayExtensions {

        public static string ExtractTextFromPdfBytes(this byte[] pdfBytes) {
            var text = string.Empty;
            using (var pdfStream = new MemoryStream(pdfBytes))
            {
                using (PdfDocument document = PdfDocument.Open(pdfStream))
                {
                    StringBuilder allText = new StringBuilder();

                    foreach (var page in document.GetPages())
                    {
                        allText.Append(page.Text);
                    }

                    text += allText.ToString();
                    //string[] paragraphs = fullText.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

                    //foreach (string paragraph in paragraphs)
                    //{
                    //    if (!string.IsNullOrWhiteSpace(paragraph))
                    //    {
                    //        Console.WriteLine(paragraph);
                    //        Console.WriteLine();
                    //    }
                    //}

                }
            }
            return text.Replace(". ", ". \r\n\r\n");


        }

        public static string GetString(this byte[] input, string extension)
        {
            var informacion = string.Empty;
            switch (extension.ToUpper())
            {
                case "PDF":

                    var streamPDF = new MemoryStream(input);
                    var document = PdfDocument.Open(streamPDF);
                    var texto = new StringBuilder();

                    foreach (var page in document.GetPages())
                    {
                        texto.AppendLine(page.Text);
                    }

                    informacion = texto.ToString();
                    break;
                case "DOC":
                    var streamDoc = new MemoryStream(input);
                    var wordDoc = WordprocessingDocument.Open(streamDoc, false);
                    var body = wordDoc.MainDocumentPart.Document.Body;
                    informacion = body.InnerText;
                    break;
                case "TXT":
                    informacion = System.Text.Encoding.UTF8.GetString(input);
                    break;
                default:
                    informacion = Encoding.UTF8.GetString(input);
                    break;
            }
            return informacion;
        }

    }

    public static class IListExtensions
    {
        public static void AddRange<T>(this IList<T> list, IEnumerable<T> items)
        {
            if (items == null)
                return;

            foreach (var item in items)
                list.Add(item);
        }
    }

    public static class ObjectExtensions
    {
        public static string compressToBase64(this object o)
        {
            var conversacionesJSON = JsonConvert.SerializeObject(o);

            //comprimimos el json para poder enviarlo
            byte[] compressedBytes;
            using (var ms = new MemoryStream())
            {
                using (var gzip = new GZipStream(ms, CompressionMode.Compress))
                {
                    var jsonBytes = Encoding.UTF8.GetBytes(conversacionesJSON);
                    gzip.Write(jsonBytes, 0, jsonBytes.Length);
                }
                compressedBytes = ms.ToArray();
            }

            return Convert.ToBase64String(compressedBytes);
        }


        


    }

}
