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

            var path = Archivos.Archivos.SaveFile(i, "", "");
            return path;
        }

    }
}
