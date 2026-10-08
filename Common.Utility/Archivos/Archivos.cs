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
        //Todo lo de AWS vive aca y no en los Web.config: los usan tres hosts (WebApiMiddelware, WebFront y WebAPI) y
        //mantener los mismos valores repetidos en los tres era mas facil de desincronizar que de sostener.
        //El bucket y la region van en claro: no son secretos y el bucket forma parte de la URL publica de cada archivo.
        private const string Bucket = "chatme-storage-174638372206-us-east-1-an";
        internal const string Region = "us-east-1";

        //Las credenciales van cifradas con CryptoHelper (TripleDES, salida en hex) y se descifran al cargar la clase,
        //que es el unico lugar que las necesita. Para cambiarlas hay que cifrar el valor nuevo con
        //CryptoHelper.EncryptStringToString y pegar el resultado aca.
        private const string AccessKeyEncrypted = "78B192AD4D5AA1436DFAC9F38A014579332D9ED20C515971";
        private const string SecretKeyEncrypted = "9C7FC7115B91ABC1A649483065EE9626A60C0F3FC3CF87AB8B6FBEABBDEC8CC7EDAA468465E25FF45BB5E8AFB0CE9B76";

        //Internas porque Common.Utility.Sms usa el mismo usuario IAM: una sola copia de las credenciales para rotar.
        internal static readonly string AccessKey = CryptoHelper.DecryptStringToString(AccessKeyEncrypted);
        internal static readonly string SecretKey = CryptoHelper.DecryptStringToString(SecretKeyEncrypted);

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
