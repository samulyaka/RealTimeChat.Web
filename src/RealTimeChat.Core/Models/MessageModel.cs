using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.Core.Models
{
    public class MessageModel
    {
        public int Id { get; set; }
        public string PubnubUUID { get; set; }
        public string Message { get; set; }
        public int IdUser { get; set; }
        public int IdDocument { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
