using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        // GET: api/Login
        [HttpGet]
        public IEnumerable<string> Login()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
