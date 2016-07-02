using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using RealTimeChat.UI.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeChat.UI.API
{
    public class ErrorHandlerProvider : ActionFilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {

            if (context.HttpContext.Request.IsAjaxRequest())
            {
                context.ExceptionHandled = true;
                context.Result = new JsonResult(new JsonResultModel<object>() { Data = null, Success = false, ErrorMessage = context.Exception.Message });
            }
        }
    }
}
