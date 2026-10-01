using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace Common.Utility.Archivos
{
    public static class Archivos
    {
        //Todo lo de AWS sale de los appSettings del host que la este usando (estan en los tres Web.config:
        //WebApiMiddelware, WebFront y WebAPI). Se leen una sola vez, al cargar la clase.
        //AWS_BucketData viene compuesto: el nombre del bucket y la region pegados con un guion bajo. Se puede partir
        //por el ultimo porque los nombres de bucket de S3 no admiten guion bajo, asi que el unico que aparece es ese.
        private static readonly string BucketData = Helper.GetWebSetingValue("AWS_BucketData") ?? string.Empty;
        private static readonly int RegionSeparator = BucketData.LastIndexOf('_');

        private static readonly string Bucket = RegionSeparator < 0 ? BucketData : BucketData.Substring(0, RegionSeparator);
        private static readonly string Region = RegionSeparator < 0 ? string.Empty : BucketData.Substring(RegionSeparator + 1);

        //Las credenciales estan cifradas en el config (CryptoHelper, TripleDES, salida en hex): se guardan cifradas y
        //se descifran aca, que es el unico lugar que las usa. El bucket no se cifra: no es secreto y ademas forma
        //parte de la URL publica de cada archivo. El nombre de la clave va escrito tal cual esta en los Web.config.
        private static readonly string AccessKey = CryptoHelper.DecryptStringToString(Helper.GetWebSetingValue("AWS_AccessKey"));
        private static readonly string SecretKey = CryptoHelper.DecryptStringToString(Helper.GetWebSetingValue("AWS_SEcretKey"));

        private const string PublicPrefix = "public";


        // AmazonS3Client es thread-safe y costoso de crear: una sola instancia para toda la app.
        private static readonly Lazy<IAmazonS3> _client = new Lazy<IAmazonS3>(() =>
            new AmazonS3Client(
                new BasicAWSCredentials(AccessKey, SecretKey),
                RegionEndpoint.GetBySystemName(Region)));

        /// <summary>
        /// Sube un archivo y devuelve su URL pública.
        /// </summary>
        /// <param name="content">Contenido del archivo.</param>
        /// <param name="fileName">Nombre original; solo se usa su extensión y para inferir el content type.</param>
        /// <param name="folder">Subcarpeta dentro de "public/" (ej. "chat"). Opcional.</param>
        /// <param name="contentType">MIME type. Si es null se infiere de la extensión.</param>
        public static async Task<string> UploadAsync(byte[] content, string fileName, string folder = null, string contentType = null)
        {
            if (content == null || content.Length == 0) throw new ArgumentException("El archivo está vacío.", nameof(content));
            if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("Falta el nombre del archivo.", nameof(fileName));

            var key = BuildKey(fileName, folder);

            using (var stream = new MemoryStream(content, writable: false))
            {
                var request = new PutObjectRequest
                {
                    BucketName = Bucket,
                    Key = key,
                    InputStream = stream,
                    ContentType = contentType ?? MimeMapping.GetMimeMapping(fileName),
                    AutoCloseStream = false
                };

                await _client.Value.PutObjectAsync(request).ConfigureAwait(false);
            }

            return GetPublicUrl(key);
        }

        public static async Task<string> UploadAsync(string URLFile, string fileName, string folder = null, string contentType = null)
        {
            byte[] content = Helper.ConseguirArchivoDesdeUrlWeb(URLFile);
            if (content == null || content.Length == 0) throw new ArgumentException("El archivo está vacío.", nameof(content));
            if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("Falta el nombre del archivo.", nameof(fileName));

            var key = BuildKey(fileName, folder);

            using (var stream = new MemoryStream(content, writable: false))
            {
                var request = new PutObjectRequest
                {
                    BucketName = Bucket,
                    Key = key,
                    InputStream = stream,
                    ContentType = contentType ?? MimeMapping.GetMimeMapping(fileName),
                    AutoCloseStream = false
                };

                await _client.Value.PutObjectAsync(request).ConfigureAwait(false);
            }

            return GetPublicUrl(key);
        }

        /// <summary>Arma la URL pública de una key ya existente en el bucket.</summary>
        public static string GetPublicUrl(string key)
        {
            var encodedKey = string.Join("/", key.Split('/').Select(Uri.EscapeDataString));
            return $"https://{Bucket}.s3.{Region}.amazonaws.com/{encodedKey}";
        }

        // public/{folder}/{yyyy}/{MM}/{guid}{ext}
        // El GUID evita colisiones y caracteres raros del nombre original.
        private static string BuildKey(string fileName, string folder)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            var now = DateTime.UtcNow;

            var parts = new[]
            {
                PublicPrefix,
                NormalizeFolder(folder),
                now.ToString("yyyy"),
                now.ToString("MM"),
                Guid.NewGuid().ToString("N") + extension
            };

            return string.Join("/", parts.Where(p => !string.IsNullOrEmpty(p)));
        }

        // En S3 las keys distinguen mayúsculas: normalizamos a minúsculas
        // para no terminar con "Chat/" y "chat/" como carpetas distintas.
        private static string NormalizeFolder(string folder)
        {
            if (string.IsNullOrWhiteSpace(folder)) return null;
            return folder.Trim().Trim('/').Replace('\\', '/').ToLowerInvariant();
        }


    }
}
