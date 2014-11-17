using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace Shangpin.Logistic.Util.Security
{
    public class Decryption
    {
        private static readonly Encoding Encode = Encoding.UTF8;
        private const string DesKey = "FDSFIojslsk;fjlk;)*(+nmjdsf$#@dsf54641#&*(()";
        public static string GetConnectionString(string connectionString)
        {
            if (IsPlainText(connectionString))
                return connectionString;
            return Decrypt(connectionString);
        }

        private static bool IsPlainText(string text)
        {
            if (string.IsNullOrEmpty(text))
                return true;

            return text.Contains(';');
        }

        public static string Decrypt(string str)
        {
            using (var DES = new TripleDESCryptoServiceProvider())
            {
                using (var hashMD5 = new MD5CryptoServiceProvider())
                {
                    DES.Key = hashMD5.ComputeHash(Encode.GetBytes(DesKey));
                    DES.Mode = CipherMode.ECB;

                    using (ICryptoTransform DESDecrypt = DES.CreateDecryptor())
                    {
                        var buffer = Convert.FromBase64String(str);
                        return Encoding.UTF8.GetString(DESDecrypt.TransformFinalBlock(buffer, 0, buffer.Length));
                    }
                }
            }
        }

        /// <summary>   
        /// DES加密字符串
        /// </summary>
        /// <param name="encriptString">待加密的字符串</param>   
        /// <returns>加密成功返回加密后的字符串，失败返回源串</returns>   
        public static string Encrypt(string encriptString)
        {
            try
            {
                using (var DES = new TripleDESCryptoServiceProvider())
                {
                    using (var hashMD5 = new MD5CryptoServiceProvider())
                    {
                        DES.Key = hashMD5.ComputeHash(Encode.GetBytes(DesKey));
                        DES.Mode = CipherMode.ECB;
                        using (ICryptoTransform desEncrypt = DES.CreateEncryptor())
                        {
                            var buffer = Convert.FromBase64String(encriptString);
                            return Encode.GetString(desEncrypt.TransformFinalBlock(buffer, 0, buffer.Length));
                        }
                    }
                }
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
