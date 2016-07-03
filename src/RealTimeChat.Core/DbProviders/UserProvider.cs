using Microsoft.AspNetCore.Identity;
using RealTimeChat.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System.Data.SqlClient;

namespace RealTimeChat.Core.DbProviders
{
    public class UserProvider : BaseProvider
    {
        public UserProvider(DbWrapper connection) : base(connection)
        {
        }

        public Task<IdentityResult> CreateAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<IdentityResult>.Factory.StartNew(() => {

                this.Connection.ExecuteNonQuery(Queries.InsertUser,
                    new SqlParameter("@p1", user.Name),
                    new SqlParameter("@p2", user.Mail),
                    new SqlParameter("@p3", user.Password.SHA1Hash()),
                    new SqlParameter("@p4", user.Info ?? string.Empty),
                    new SqlParameter("@p5", user.ImageUrl ?? string.Empty),
                    new SqlParameter("@p6", DateTime.Now),
                    new SqlParameter("@p7", DateTime.Now));
                return IdentityResult.Success;
            }, cancellationToken);
        }

        public Task<IdentityResult> DeleteAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<IdentityResult>.Factory.StartNew(() => {

                this.Connection.ExecuteNonQuery(Queries.DeleteUser,
                    new SqlParameter("@p", user.Id));
                return IdentityResult.Success;
            }, cancellationToken);
        }

        public void Dispose()
        {
        }

        public Task<LoginnedUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return Task<LoginnedUser>.Factory.StartNew(() => {

                var reader = this.Connection.ExecuteReader( System.Data.CommandType.Text,Queries.GetUser,
                    new SqlParameter("@p", userId));
                return reader.FirstOfDefault(r=> new LoginnedUser()
                {
                    Id = r.GetValueOrDefault<int>("Id"),
                    Name = r.GetValueOrDefault<string>("Name"),
                    Mail = r.GetValueOrDefault<string>("Email"),
                    Password = r.GetValueOrDefault<string>("Password"),
                    Info = r.GetValueOrDefault<string>("Info"),
                    ImageUrl = r.GetValueOrDefault<string>("Avatar")
                });
            }, cancellationToken);
        }

        public LoginnedUser FindByName(string normalizedUserName)
        {
                var reader = this.Connection.ExecuteReader(System.Data.CommandType.Text, Queries.GetUserByName,
                    new SqlParameter("@p", normalizedUserName));
                return reader.FirstOfDefault(r => new LoginnedUser()
                {
                    Id = r.GetValueOrDefault<int>("Id"),
                    Name = r.GetValueOrDefault<string>("Name"),
                    Mail = r.GetValueOrDefault<string>("Email"),
                    Password = r.GetValueOrDefault<string>("Password"),
                    Info = r.GetValueOrDefault<string>("Info"),
                    ImageUrl = r.GetValueOrDefault<string>("Avatar")
                });
        }

        public LoginnedUser FindUserByNameAndPassword(string name, string password)
        {
            //return new LoginnedUser()
            //{
            //    Password = "dfsdf",
            //    Name = "dfsdf",
            //    ImageUrl = "fdasd",
            //    Id = 4,
            //    Info = "sdasd",
            //    Mail = "sadas@asd.as"
            //};
            var reader = this.Connection.ExecuteReader(System.Data.CommandType.Text, Queries.GetUserByNameAndPassword,
                    new SqlParameter("@p1", name),
                    new SqlParameter("@p2", password.SHA1Hash()));
            if (reader.HasRows && reader.Read())
            {
                return new LoginnedUser()
                {
                    Id = reader.GetValueOrDefault<int>("Id"),
                    Name = reader.GetValueOrDefault<string>("Name"),
                    Mail = reader.GetValueOrDefault<string>("Email"),
                    Info = reader.GetValueOrDefault<string>("Info"),
                    ImageUrl = reader.GetValueOrDefault<string>("Avatar")
                };
            }
            return null;
        }

        public Task<string> GetNormalizedRoleNameAsync(LoginnedUser role, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetNormalizedUserNameAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<string>.Factory.StartNew(() => {
                return user.Name;
            }, cancellationToken);
        }

        public Task<string> GetUserIdAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<string>.Factory.StartNew(() => {
                return user.Id.ToString();
            }, cancellationToken);
        }

        public Task<string> GetUserNameAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<string>.Factory.StartNew(() => {
                return user.Name;
            }, cancellationToken);
        }

        public Task SetNormalizedUserNameAsync(LoginnedUser user, string normalizedName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => {
                user.Name = normalizedName;
            }, cancellationToken);
        }
        
        public Task SetUserNameAsync(LoginnedUser user, string userName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => {
                user.Name = userName;
            }, cancellationToken);
        }

        public Task<IdentityResult> UpdateAsync(LoginnedUser user, CancellationToken cancellationToken)
        {
            return Task<IdentityResult>.Factory.StartNew(() => {

                this.Connection.ExecuteNonQuery(Queries.UpdateUser,
                    new SqlParameter("@p1", user.Name),
                    new SqlParameter("@p2", user.Mail),
                    new SqlParameter("@p3", user.Password),
                    new SqlParameter("@p4", user.Info),
                    new SqlParameter("@p5", user.ImageUrl),
                    new SqlParameter("@p6", DateTime.Now),
                    new SqlParameter("@p7", user.Id));
                return IdentityResult.Success;
            }, cancellationToken);
        }
        class Queries
        {
            public const string InsertUser = "insert into [User](Name,Email,Password,Info,Avatar,CreatedAt,UpdatedAt) values(@p1,@p2,@p3,@p4,@p5,@p6,@p7)";
            public const string UpdateUser = "update [User] set Name = @p1,Email = @p2,Password = @p3,Info = @p4,Avatar = @p5,UpdatedAt = @p6) where id = @p7";
            public const string DeleteUser = "delete from [User] where id = @p";
            public const string GetUser = "select Id,Name,Email,Password,Info,Avatar,CreatedAt,UpdatedAt from [User] where id = @p";
            public const string GetUserByName = "select Id,Name,Email,Password,Info,Avatar,CreatedAt,UpdatedAt from [User] where Name = @p";
            public const string GetUserByNameAndPassword = "select Id,Name,Email,Password,Info,Avatar,CreatedAt,UpdatedAt from [User] where Email = @p1 and Password = @p2";
        }
    }
}
