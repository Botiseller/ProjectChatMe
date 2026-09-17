using System;
using System.ComponentModel;
using System.Data.Entity.Core.EntityClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Framework.Core.Connection
{
    public class ConnectionStringManager
    {
        public static string BuildConnectionStringChatbotDesarrollo(string dataSource)
        {
            // Build the connection string from the provided datasource and database
            var connString = dataSource + ";App=EntityFramework;";

            var ecsb = new EntityConnectionStringBuilder
            {
                Metadata = "res://*/ModelChatbotDesarrollo.csdl|res://*/ModelChatbotDesarrollo.ssdl|res://*/ModelChatbotDesarrollo.msl",
                Provider = "System.Data.SqlClient",
                ProviderConnectionString = connString
            };

            return ecsb.ToString();
        }

        //public static string DecryptStringToString(string InputString, string SecretKey)
        //{
        //    CipherMode CyphMode = CipherMode.ECB;

        //    try
        //    {
        //        if (InputString == string.Empty)
        //        {
        //            return string.Empty;
        //        }
        //        TripleDESCryptoServiceProvider Des = new TripleDESCryptoServiceProvider();
        //        //Put the string into a byte array
        //        byte[] InputbyteArray = new byte[Convert.ToInt32(InputString.Length / 2 - 1) + 1];
        //        //= Encoding.UTF8.GetBytes(InputString)
        //        //Create the crypto objects, with the key, as passed in
        //        MD5CryptoServiceProvider hashMD5 = new MD5CryptoServiceProvider();

        //        Des.Key = hashMD5.ComputeHash(Encoding.Default.GetBytes(SecretKey));
        //        Des.Mode = CyphMode;
        //        //Put the input string into the byte array

        //        int X = 0;

        //        for (X = 0; X <= InputbyteArray.Length - 1; X++)
        //        {
        //            Int32 IJ = (Convert.ToInt32(InputString.Substring(X * 2, 2), 16));
        //            ByteConverter BT = new ByteConverter();
        //            InputbyteArray[X] = new byte();
        //            InputbyteArray[X] = Convert.ToByte(BT.ConvertTo(IJ, typeof(byte)));
        //        }

        //        MemoryStream ms = new MemoryStream();
        //        CryptoStream cs = new CryptoStream(ms, Des.CreateDecryptor(), CryptoStreamMode.Write);

        //        //Flush the data through the crypto stream into the memory stream
        //        cs.Write(InputbyteArray, 0, InputbyteArray.Length);
        //        cs.FlushFinalBlock();

        //        ////Get the decrypted data back from the memory stream
        //        StringBuilder ret = new StringBuilder();
        //        byte[] B = ms.ToArray();
        //        ms.Close();

        //        for (var i = 0; i <= B.Length - 1; i++)
        //        {
        //            ret.Append(Convert.ToChar(B[i]));
        //        }
        //        string result = ret.ToString();
        //        return result;
        //    }
        //    catch (CryptographicException ex)
        //    {
        //        throw new Exception(ex.ToString(), ex);
        //    }
        //}
    }
}

