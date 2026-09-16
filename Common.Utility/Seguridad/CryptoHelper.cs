using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Security;
using System;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Common.Utility
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

            foreach (var ms in arrayMemoryStream)
            {
                result.AppendFormat("{0:X2}", ms);
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
                //inputByteArray[X] = new byte();
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

        public static string GetSha256Hash(string input)
        {
            // Limpiar el input (sacar espacios, +, paréntesis, etc.)
            var cleanInput = new string(input.Where(char.IsDigit).ToArray());

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(cleanInput));

                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2")); // Hexadecimal en minúscula
                }
                return builder.ToString();
            }
        }

        public static string CreateJWT_RS256(string secretKey, string header_s, string iss, string scope, string aud, int expireMinutes)
        {
            string JWT = string.Empty;

            secretKey = secretKey.Replace("\\n", "\n").Trim();

            // 2️⃣ Header
            string headerJson = $"{{\"alg\":\"RS256\",\"typ\":\"JWT\",\"s\":\"{header_s}\"}}";
            string header = Base64UrlEncode(Encoding.UTF8.GetBytes(headerJson));

            // 3️⃣ Payload
            long iat = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            long exp = DateTimeOffset.UtcNow.AddMinutes(expireMinutes).ToUnixTimeSeconds();

            string payloadJson =
                $"{{\"iss\":\"{iss}\",\"scope\":\"{scope}\",\"aud\":\"{aud}\",\"iat\":{iat},\"exp\":{exp}}}";
            string payload = Base64UrlEncode(Encoding.UTF8.GetBytes(payloadJson));

            // 4️⃣ Concatenar header.payload
            string dataToSign = $"{header}.{payload}";

            // 5️⃣ Firmar con RS256 (SHA256 + RSA)
            byte[] signature = SignData(dataToSign, secretKey);
            string signatureEncoded = Base64UrlEncode(signature);

            // 6️⃣ Token final
            JWT = $"{header}.{payload}.{signatureEncoded}";


            return JWT;

        }

        private static byte[] SignData(string data, string privateKeyPem)
        {
            byte[] dataBytes = Encoding.UTF8.GetBytes(data);

            using (var reader = new StringReader(privateKeyPem))
            {
                object pemObject = new PemReader(reader).ReadObject();
                RsaPrivateCrtKeyParameters privateKey;

                if (pemObject is AsymmetricCipherKeyPair keyPair)
                    privateKey = (RsaPrivateCrtKeyParameters)keyPair.Private;
                else
                    privateKey = (RsaPrivateCrtKeyParameters)pemObject;

                ISigner signer = SignerUtilities.GetSigner("SHA256withRSA");
                signer.Init(true, privateKey);
                signer.BlockUpdate(dataBytes, 0, dataBytes.Length);
                return signer.GenerateSignature();
            }
        }

        private static string Base64UrlEncode(byte[] input)
        {
            return Convert.ToBase64String(input)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }
















    }
}