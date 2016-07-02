using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.UI.API.Models;
using RealTimeChat.Core.Models;
using Microsoft.AspNetCore.Identity;
using RealTimeChat.Core.DbProviders;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private UserProvider userProvider;
        public UsersController(UserProvider userProvider)
        {
            this.userProvider = userProvider;
        }
        [Authorize]
        [HttpPost("LoadContacts")]
        public JsonResultModel<string[]> LoadContacts()
        {
            return new JsonResultModel<string[]>() { Success = true, Data = new string[] { "asdasdas", "asdasd", "asdasdasd" } };
        }
    }
}
