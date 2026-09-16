using System;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Business.Contracts.Helpers
{
    public static class CryptoHelper
    {
        private const string _secretKey = "J3ajh3a7";

        public static string EncryptStringToString(string inputString, string secretKey)
        {
            if (string.IsNullOrWhiteSpace(inputString))
            {
                return string.Empty;
            }

            var cryptoServiceProvider = new TripleDESCryptoServiceProvider
            {
                Key = new MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes(secretKey)),
                Mode = CipherMode.ECB
            };

            //Put the string into a byte array
            var inputByteArray = Encoding.Default.GetBytes(inputString);

            //Create the crypto objects, with the key, as passed in
            var memoryStream = new MemoryStream();
            var cryptoStream = new CryptoStream(memoryStream, cryptoServiceProvider.CreateEncryptor(), CryptoStreamMode.Write);

            //Write the byte array into the crypto stream
            //(It will end up in the memory stream)
            cryptoStream.Write(inputByteArray, 0, inputByteArray.Length);
            cryptoStream.FlushFinalBlock();

            //Get the data back from the memory stream, and into a string
            var result = new StringBuilder();
            var arrayMemoryStream = memoryStream.ToArray();

            memoryStream.Close();

            for (var i = 0; i <= arrayMemoryStream.Count(); i++)
            {
                //Format as hex
                result.AppendFormat("{0:X2}", arrayMemoryStream[i]);
            }

            return result.ToString().ToUpper();
        }

        public static string DecryptStringToString(string inputString, string secretKey)
        {
            if (string.IsNullOrWhiteSpace(inputString))
            {
                return string.Empty;
            }

            var hashMD5 = new MD5CryptoServiceProvider();
            var cryptoServiceProvider = new TripleDESCryptoServiceProvider()
            {
                Key = hashMD5.ComputeHash(Encoding.Default.GetBytes(secretKey)),
                Mode = CipherMode.ECB,
            };

            //Put the string into a byte array
            var inputByteArray = new byte[Convert.ToInt32(inputString.Length / 2 - 1) + 1];

            for (var i = 0; i <= inputByteArray.Length - 1; i++)
            {
                var IJ = (Convert.ToInt32(inputString.Substring(i * 2, 2), 16));
                var byteConverter = new ByteConverter();
                
                inputByteArray[i] = Convert.ToByte(byteConverter.ConvertTo(IJ, typeof(byte)));
            }

            var memoryStream = new MemoryStream();
            var cryptoStream = new CryptoStream(memoryStream, cryptoServiceProvider.CreateDecryptor(), CryptoStreamMode.Write);

            //Flush the data through the crypto stream into the memory stream
            cryptoStream.Write(inputByteArray, 0, inputByteArray.Length);
            cryptoStream.FlushFinalBlock();

            ////Get the decrypted data back from the memory stream
            var result = new StringBuilder();
            var arrayMemoryStream = memoryStream.ToArray();

            memoryStream.Close();

            for (var i = 0; i <= arrayMemoryStream.Length - 1; i++)
            {
                result.Append(Convert.ToChar(arrayMemoryStream[i]));
            }

            return result.ToString();
        }
    }
}