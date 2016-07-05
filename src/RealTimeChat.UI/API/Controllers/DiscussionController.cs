using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.Core.Models;
using RealTimeChat.Core.DbProviders;
using RealTimeChat.UI.API.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class DiscussionController : Controller
    {
        private DiscussionProvider discussionProvider;
        private UserProvider userProvider;
        public DiscussionController(DiscussionProvider discussionProvider, UserProvider userProvider)
        {
            this.discussionProvider = discussionProvider;
            this.userProvider = userProvider;
        }
        // GET: api/values
        [HttpPost("SendMessage")]
        public JsonResultModel<int> SendMessage([FromBody]MessageModel model)
        {
            var user = this.userProvider.FindByName(User.Identity.Name);
            model.IdUser = user.Id;
            var id = this.discussionProvider.AddMessage(model);
            return new JsonResultModel<int>() { Success = true, Data = id };
        }
    }
}
