using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RealTimeChat.UI.API.Models;
using RealTimeChat.Core.Models;
using RealTimeChat.Core.DbProviders;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;
using System;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace RealTimeChat.UI.API.Controllers
{
    [Route("api/[controller]")]
    public class FilesController : Controller
    {
        private ContactProvider contactProvider;
        private UserProvider userProvider;
        private FileProvider fileProvider;
        private readonly string workingFolder = @"\images\uploads";
        private IHostingEnvironment hostingEnv;

        public FilesController(ContactProvider contactProvider, UserProvider userProvider, FileProvider fileProvider, IHostingEnvironment env)
        {
            this.contactProvider = contactProvider;
            this.userProvider = userProvider;
            this.fileProvider = fileProvider;
            this.hostingEnv = env;
        }

        /// <summary>
        /// Add a file
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost("FileUpload")]
        public async Task<JsonResultModel<object>> FileUpload(IFormFile file)
        {
            string chatUID = Request.Query["chatid"];
            if (String.IsNullOrEmpty(chatUID))
                return new JsonResultModel<object>() { Success = true, Data = null, ErrorMessage="chatid param is Required" };

            if (file == null || file.Length == 0)
                return new JsonResultModel<object>() { Success = false, Data = null, ErrorMessage = "No uploaded file" };

            var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var hashedFileName = Guid.NewGuid();
            var realFileName = hostingEnv.WebRootPath + $@"\images\uploads\{hashedFileName}";
            var user = this.userProvider.FindByName(User.Identity.Name);

            using (FileStream fs = System.IO.File.Create(realFileName))
            {
                file.CopyTo(fs);
                fs.Flush();
            }

            var fileId = this.fileProvider.CreateFile(new FileModel
            {
                Name = originalFileName,
                Url = hashedFileName.ToString(),
                IsImage = file.ContentType.Contains("image"),
                ChatUID = chatUID,
                FilesChatUID = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.Now,
                CreatedBy = user.Id
            });

            return new JsonResultModel<object>() { Success = true, Data = new { fileId = fileId } };
        }

        [HttpGet("GetFile/{id}")]
        public FileStreamResult GetFile(string id)
        {
            //var id = 35;
            var file = this.fileProvider.GetFileById(id);
            return File(new FileStream(hostingEnv.WebRootPath + $@"\images\uploads\{file.Url}", FileMode.Open), file.ContentType, file.Name);
        }

        [Authorize]
        [HttpPost("LoadFiles")]
        public JsonResultModel<List<FileModel>> LoadFiles([FromBody]SearchModel search)
        {
            if (String.IsNullOrEmpty(search.ChatUID))
                return new JsonResultModel<List<FileModel>>() { Success = false, ErrorMessage = "ChatUID cannot be null" };

            var files = this.fileProvider.GetFilesByChatUId(search.ChatUID);
            return new JsonResultModel<List<FileModel>>() { Success = true, Data = files };
        }
    }
}
