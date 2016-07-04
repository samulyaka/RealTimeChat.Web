using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using RealTimeChat.UI.API.Models;

namespace RealTimeChat.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly PubNubSettingsModel PubNubSettings;

        public HomeController(IOptions<PubNubSettingsModel> pubNubSettings)
        {
            PubNubSettings = pubNubSettings.Value;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            MainModel model = new MainModel()
            {
                PubNubSettings = PubNubSettings
            };
            return View(model);
        }
    }
}
