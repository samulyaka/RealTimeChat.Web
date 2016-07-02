using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.UI.API.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        // GET: api/Users/Login
        [HttpGet("Login")]
        public IEnumerable<string> Login()
        {
            return new string[] { "value1", "value2" };
        }
        [HttpGet("LoadContacts")]
        public IEnumerable<UserModel> LoadContacts()
        {
            return new UserModel[] {
                new UserModel { Id= 1, ChatUID="11", Mail="asd@sada.aa", UserName="test user1" },
                new UserModel { Id= 2, ChatUID="112", Mail="asd@sada.aa", UserName="test user2" },
                new UserModel { Id= 3, ChatUID="1132", Mail="asd@sada.aa", UserName="test user3" },
                new UserModel { Id= 4, ChatUID="1331", Mail="asd@sada.aa", UserName="test user4" },
                new UserModel { Id= 5, ChatUID="1441", Mail="asd@sada.aa", UserName="test user5" }
            };
        }
    }
}
