using System;

namespace RealTimeChat.Core.Models
{
    public class FileModel
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsImage { get; set; }
        public string Name { get; set; }
        public string ChatUID { get; set; }
        public string FilesChatUID { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; }
    }
}
