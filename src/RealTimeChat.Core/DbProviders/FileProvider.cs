﻿using Microsoft.AspNetCore.Identity;
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
                    new SqlParameter("@p4", file.ChatUID),
                    new SqlParameter("@p5", file.FilesChatUID),
                    new SqlParameter("@p6", DateTime.Now),
                    new SqlParameter("@p7", file.CreatedBy)));
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
                ChatUID = r.GetValueOrDefault<string>("ChatPubnubUUID"),
                FilesChatUID = r.GetValueOrDefault<string>("PubnubUUID"),
                IsImage = r.GetValueOrDefault<bool>("IsImage"),
                CreatedAt = r.GetValueOrDefault<DateTime>("CreatedDate"),
                CreatedBy = r.GetValueOrDefault<int>("IdUser"),
                CreatedByName = r.GetValueOrDefault<string>("CreatedByName"),
            });
        }
        public FileModel GetFileById(string id)
        {
            var reader = this.Connection.ExecuteReader(System.Data.CommandType.Text, Queries.GetFileById,
                new SqlParameter("@p", id));
            return reader.FirstOfDefault(r => new FileModel()
            {
                Id = r.GetValueOrDefault<int>("Id"),
                Name = r.GetValueOrDefault<string>("Name"),
                Url = r.GetValueOrDefault<string>("Url"),
                ChatUID = r.GetValueOrDefault<string>("ChatPubnubUUID"),
                FilesChatUID = r.GetValueOrDefault<string>("PubnubUUID"),
                IsImage = r.GetValueOrDefault<bool>("IsImage"),
                CreatedAt = r.GetValueOrDefault<DateTime>("CreatedDate"),
                CreatedBy = r.GetValueOrDefault<int>("IdUser"),
                CreatedByName = r.GetValueOrDefault<string>("CreatedByName"),
            });
        }
        class Queries
        {
            public const string GetFilesByChatUId = "select f.Id,f.Name,f.Url,f.ChatPubnubUUID,f.PubnubUUID,f.IsImage,f.CreatedDate,f.IdUser,u.Name CreatedByName from [Documents] f inner join [User] u on (f.IdUser = u.Id) where ChatPubnubUUID = @p";
            public const string GetFileById = "select f.Id,f.Name,f.Url,f.ChatPubnubUUID,f.PubnubUUID,f.IsImage,f.CreatedDate,f.IdUser,u.Name CreatedByName from [Documents] f inner join [User] u on (f.IdUser = u.Id) where f.Id = @p";
            public const string InsertFile = "insert into [Documents](Name,Url,IsImage,ChatPubnubUUID,PubnubUUID,CreatedDate,IdUser) values (@p1,@p2,@p3,@p4,@p5,@p6,@p7); SELECT SCOPE_IDENTITY();";
        }
    }
}
