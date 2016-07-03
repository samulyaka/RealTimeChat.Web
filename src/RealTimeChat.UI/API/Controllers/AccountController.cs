using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.UI.API.Models;
using RealTimeChat.Core.Models;
using RealTimeChat.Core.DbProviders;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private UserProvider userProvider;
        public AccountController(UserProvider userProvider)
        {
            this.userProvider = userProvider;
        }
        // GET: api/Users/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<JsonResultModel<LoginnedUser>> Login([FromBody]LoginModel model)
        {
            var user = userProvider.FindUserByNameAndPassword(model.Email, model.Password);
            if (user != null)
            {
                List<Claim> userClaims = new List<Claim>
                {
                    new Claim("userId", Convert.ToString(user.Id)),
                    new Claim(ClaimTypes.Name, user.Name)
                };

                ClaimsPrincipal principal = new ClaimsPrincipal(new ClaimsIdentity(userClaims, "local"));
                await HttpContext.Authentication.SignInAsync("CookieAuth", principal);
            }
            return new JsonResultModel<LoginnedUser>() { Success = user != null, Data = user };
        }
        // GET: api/Users/LogOut
        [HttpPost("LogOut")]
        public async Task<JsonResultModel<object>> LogOut()
        {
            await HttpContext.Authentication.SignOutAsync("CookieAuth");
            return new JsonResultModel<object>() { Success = true, Data = null };
        }
        // GET: api/Users/LogOut
        [HttpPost("LoadUserInfo")]
        public JsonResultModel<LoginnedUser> LoadUserInfo()
        {
            var user = this.userProvider.FindByName(User.Identity.Name);

            return new JsonResultModel<LoginnedUser>() { Success = true, Data = new LoginnedUser() {
                Id = user.Id,
                ImageUrl = user.ImageUrl,
                Info = user.Info,
                Mail = user.Mail,
                Name = user.Name,
                Password = user.Password
            } };
        }
    }
}
