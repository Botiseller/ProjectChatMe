using System;
using System.Configuration;
using System.IO;
using System.Net;

namespace Common.Utility.Archivos
{
    public static class Archivos
    {
        public static void GuardarImagenEnFtpDirectorio(byte[] imagen, string nombreArchivo, string entidad)
        {
            string[] ftpConnect = ConfigurationManager.AppSettings["ftpConnectImages"].ToString().Split(';');
            string serverFtp = ftpConnect[0];
            string puertoFtp = ftpConnect[1];
            string usuarioFtp = ftpConnect[2];
            string pwdFtp = ftpConnect[3];

            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://" + serverFtp + ":" + puertoFtp + @"/" + entidad + @"/" + nombreArchivo);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential(usuarioFtp, pwdFtp);

            request.UseBinary = true;
            request.ContentLength = imagen.Length;

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(imagen, 0, imagen.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse)request.GetResponse();

            response.Close();
        }

        public static void GuardarImagenEnFtpDirectorio(string base64, string nombreArchivo, string entidad)
        {
            string[] ftpConnect = ConfigurationManager.AppSettings["ftpConnectImages"].ToString().Split(';');
            string serverFtp = ftpConnect[0];
            string puertoFtp = ftpConnect[1];
            string usuarioFtp = ftpConnect[2];
            string pwdFtp = ftpConnect[3];

            var imagen = Convert.FromBase64String(base64);

            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://" + serverFtp + ":" + puertoFtp + @"/" + entidad + @"/" + nombreArchivo);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential(usuarioFtp, pwdFtp);

            request.UseBinary = true;
            request.ContentLength = imagen.Length;

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(imagen, 0, imagen.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse)request.GetResponse();

            response.Close();
        }




        public static string SaveFile(byte[] file, string name, string folder)
        {
            string completeName = $"{Helper.ConseguirUniqueString()}_{Helper.GetFamilyBySession()}_{Helper.GetUserBySession()}_{name.Replace(" ", "")}";

            GuardarImagenEnFtpDirectorio(file, completeName, folder);
            return $"{ConseguirUrlImages()}/{folder}/{completeName}";

        }

        public static string ConseguirUrlImages()
        {

            string url = ConfigurationManager.AppSettings["UrlImages"].ToString();

            return url;
        }


        public static string getFileName(string url) {
            
            if (string.IsNullOrWhiteSpace(url))
                return string.Empty;

            try
            {
                // Obtiene la URI
                Uri uri = new Uri(url);

                // Extrae el nombre del archivo desde la URL
                string fileName = System.IO.Path.GetFileName(uri.LocalPath);

                return fileName;
            }
            catch
            {
                return string.Empty;
            }
        }

    }
}
