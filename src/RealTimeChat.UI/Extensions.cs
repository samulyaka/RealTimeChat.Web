using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.UI
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
        public static bool IsAjaxRequest(this HttpRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            return ((request.Headers != null) && (request.Headers["X-Requested-With"] == "XMLHttpRequest"));
        }
    }
}
