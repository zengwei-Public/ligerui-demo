using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;

namespace Shangpin.Logistic.WebUI.Common
{
    public class AjaxExceptionAttribute : ActionFilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            if (!filterContext.HttpContext.Request.IsAjaxRequest()) return;
            filterContext.Result = this.AjaxError(filterContext.Exception.Message, filterContext);
            filterContext.ExceptionHandled = true;
        }

        protected EmptyResult AjaxError(string message, ExceptionContext filterContext)
        {
            if (String.IsNullOrEmpty(message)) message = "异步调用出错！";
            filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            //Needed for IIS7.0
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
            filterContext.HttpContext.Response.Write(message);
            return new EmptyResult();
        }
    }
}