using RealTimeChat.Core.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.Core.DbProviders
{
    public class ContactProvider : BaseProvider
    {
        public ContactProvider(DbWrapper connection) : base(connection)
        {
        }
        public List<UserModel> GetContactsByUserId(int id)
        {
            var reader = this.Connection.ExecuteReader(System.Data.CommandType.Text, Queries.GetContactsByUserId,
                new SqlParameter("@p", id));
            return reader.ToListOrEmpty(r => new UserModel()
            {
                Id = r.GetValueOrDefault<int>("Id"),
                UserName = r.GetValueOrDefault<string>("Name"),
                Mail = r.GetValueOrDefault<string>("Email"),
                ChatUID = r.GetValueOrDefault<string>("ChatUID"),
                Info = r.GetValueOrDefault<string>("Info"),
                ImageUrl = r.GetValueOrDefault<string>("Avatar"),
                LastMessageDate = r.GetValueOrDefault<DateTime?>("LastReadAt") ?? DateTime.Now
            });
        }
        class Queries
        {
            public const string GetContactsByUserId = "select us.Id,us.Name,us.Email,c.ChatUID,us.Info,us.Avatar,c.LastReadAt from [User] as us JOIN Contact as c on c.ContactId = us.Id where c.UserId = @p";
        }
    }
}
