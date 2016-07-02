using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.UI.API.Models
{
    public class PubNubSettingsModel
    {
        public string PublishKey { get; set; }
        public string SubscribeKey { get; set; }
    }
}
