using System;

namespace RealTimeChat.Core.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Mail { get; set; }
        public string ChatUID { get; set; }
        DateTime LastMessageDate { get; set; }
    }
}
