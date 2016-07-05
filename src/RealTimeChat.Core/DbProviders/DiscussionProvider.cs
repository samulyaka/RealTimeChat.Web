using RealTimeChat.Core.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.Core.DbProviders
{
    public class DiscussionProvider : BaseProvider
    {
        public DiscussionProvider(DbWrapper connection) : base(connection)
        {
        }
        public int AddMessage(MessageModel message)
        {
            return Convert.ToInt32(this.Connection.ExecuteScalar(System.Data.CommandType.Text, Queries.InsertMessage,
                new SqlParameter("@p1", message.IdUser),
                new SqlParameter("@p2", message.Message ?? string.Empty),
                new SqlParameter("@p3", DateTime.Now),
                new SqlParameter("@p4", message.PubnubUUID),
                new SqlParameter("@p5", message.IdDocument)));
        }
        class Queries
        {
            public const string InsertMessage = "insert into [DiscussionItems](IdUser,[Message], CreatedDate, PubnubUUID, IdDocument) values(@p1,@p2,@p3,@p4,@p5)";
        }
    }
}
