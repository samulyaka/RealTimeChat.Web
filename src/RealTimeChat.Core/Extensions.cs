﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace RealTimeChat.Core
{
    public static class Extensions
    {
        public static T GetValueOrDefault<T>(this SqlDataReader reader, string fieldName)
        {
            int index = reader.GetOrdinal(fieldName);
            if (reader.IsDBNull(index))
            {
                return default(T);
            }
            return reader.GetFieldValue<T>(index);

        }
        public static T FirstOfDefault<T>(this SqlDataReader reader, Func<SqlDataReader, T> convertor)
        {
            if (reader.HasRows && reader.Read())
            {
                return convertor(reader);
            }
            return default(T);
        }
        public static List<T> ToListOrEmpty<T>(this SqlDataReader reader, Func<SqlDataReader, T> convertor)
        {
            var result = new List<T>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    var item = convertor(reader);
                    result.Add(item);
                }
            }
            return result;
        }
        /// <summary>
        /// Compute hash for string encoded as UTF8
        /// </summary>
        /// <param name="s">String to be hashed</param>
        /// <returns>40-character hex string</returns>
        public static string SHA1Hash(this string s)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(s);

            var sha1 = SHA1.Create();
            byte[] hashBytes = sha1.ComputeHash(bytes);

            return HexStringFromBytes(hashBytes);
        }

        /// <summary>
        /// Convert an array of bytes to a string of hex digits
        /// </summary>
        /// <param name="bytes">array of bytes</param>
        /// <returns>String of hex digits</returns>
        private static string HexStringFromBytes(byte[] bytes)
        {
            var sb = new StringBuilder();
            foreach (byte b in bytes)
            {
                var hex = b.ToString("x2");
                sb.Append(hex);
            }
            return sb.ToString();
        }
    }
}
