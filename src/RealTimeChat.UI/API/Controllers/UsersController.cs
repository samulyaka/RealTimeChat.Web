using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.UI.API.Models;
using RealTimeChat.Core.Models;
using RealTimeChat.Core.DbProviders;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private ContactProvider contactProvider;
        private UserProvider userProvider;
        public UsersController(ContactProvider contactProvider, UserProvider userProvider)
        {
            this.contactProvider = contactProvider;
            this.userProvider = userProvider;
        }
        [Authorize]
        [HttpPost("LoadContacts")]
        public JsonResultModel<List<UserModel>> LoadContacts()
        {
            var user = this.userProvider.FindByName(User.Identity.Name);
            var data = this.contactProvider.GetContactsByUserId(user.Id);
            return new JsonResultModel<List<UserModel>>() { Success = true, Data = data };
        }
    }
}
