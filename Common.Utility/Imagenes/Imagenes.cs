using ImageMagick;

namespace Common.Utility.Imagenes
{
    public class Imagenes
    {

        public static string resizeImage(byte[] originalBytes, uint quality = 80, uint width = 512, uint height = 512)
        {
            byte[] i = null;
            using (var image = new MagickImage(originalBytes))
            {
                image.Resize(width, height);
                image.Format = MagickFormat.WebP;
                image.Quality = quality;

                i = image.ToByteArray();
            }

            //SaveFile (FTP) ya no existe, se reemplazo por Archivos.UploadAsync (S3); bloqueante a proposito, este metodo es sincrono.
            var path = Archivos.Archivos.UploadAsync(i, "image.webp", "images").GetAwaiter().GetResult();
            return path;
        }

    }
}
