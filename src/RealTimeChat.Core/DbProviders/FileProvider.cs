using Microsoft.AspNetCore.Identity;
using RealTimeChat.Core.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RealTimeChat.Core.DbProviders
{
    public class FileProvider : BaseProvider
    {
        public FileProvider(DbWrapper connection) : base(connection)
        {
        }
        public int CreateFile(FileModel file)
        {
            return Convert.ToInt32(this.Connection.ExecuteScalar(System.Data.CommandType.Text, Queries.InsertFile,
                    new SqlParameter("@p1", file.Name),
                    new SqlParameter("@p2", file.Url),
                    new SqlParameter("@p3", file.IsImage),
                    new SqlParameter("@p4", file.ContentType),
                    new SqlParameter("@p5", file.ChatUID),
                    new SqlParameter("@p6", file.FilesChatUID),
                    new SqlParameter("@p7", file.CreatedAt),
                    new SqlParameter("@p8", file.CreatedBy)));
        }
        public List<FileModel> GetFilesByChatUId(string ChatUID)
        {
            var reader = this.Connection.ExecuteReader(System.Data.CommandType.Text, Queries.GetFilesByChatUId,
                new SqlParameter("@p", ChatUID));
            return reader.ToListOrEmpty(r => new FileModel()
            {
                Id = r.GetValueOrDefault<int>("Id"),
                Name = r.GetValueOrDefault<string>("Name"),
                Url = r.GetValueOrDefault<string>("Url"),
                ChatUID = r.GetValueOrDefault<string>("ChatUID"),
                FilesChatUID = r.GetValueOrDefault<string>("FilesChatUID"),
                IsImage = r.GetValueOrDefault<bool>("IsImage"),
                ContentType = r.GetValueOrDefault<string>("ContentType"),
                CreatedAt = r.GetValueOrDefault<DateTime>("CreatedAt"),
                CreatedBy = r.GetValueOrDefault<int>("CreatedBy"),
                CreatedByName = r.GetValueOrDefault<string>("CreatedByName"),
            });
        }
        class Queries
        {
            public const string GetFilesByChatUId = "select f.Id,f.Name,f.Url,f.ChatUID,f.FilesChatUID,f.IsImage,f.ContentType,f.CreatedAt,f.CreatedBy,u.Name CreatedByName from [File] f inner join [User] u on (f.CreatedBy = u.Id) where ChatUID = @p";
            public const string InsertFile = "insert into [File](Name,Url,IsImage,ContentType,ChatUID,FilesChatUID,CreatedAt,CreatedBy) values (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8); SELECT SCOPE_IDENTITY();";
        }
    }
}
