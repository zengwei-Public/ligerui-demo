using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Shangpin.Logistic.Util.LogMail;

namespace Shangpin.Logistic.WebUI.Common
{
    public class TMSHandleErrorAttribute : HandleErrorAttribute
    {
        public TMSHandleErrorAttribute()
            : base()
        {
            ExceptionType = typeof(Exception);
            // Error.cshtml is a view in the Shared folder.
            View = "Error";
            Order = 2;
        }

        public override void OnException(ExceptionContext filterContext)
        {
            Exception ex = filterContext.Exception;
            Log.loggeremail.Error(GetErrorMessage(filterContext), ex);
            base.OnException(filterContext);
        }

        private string GetErrorMessage(ExceptionContext filterContext)
        {
            StringBuilder sbMessage = new StringBuilder();
            sbMessage.Append("访问时间：" + DateTime.Now + Environment.NewLine);
            //todo zengwei 增加相关登录者信息
            string user_IP = "";
            if (filterContext.HttpContext != null && filterContext.HttpContext.Request != null)
            {
                if (filterContext.HttpContext.Request.ServerVariables["HTTP_VIA"] != null)
                {
                    user_IP = filterContext.HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : filterContext.HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
                }
                else
                {
                    user_IP = filterContext.HttpContext.Request.ServerVariables["REMOTE_ADDR"] == null ? "" : filterContext.HttpContext.Request.ServerVariables["REMOTE_ADDR"].ToString();
                }
                sbMessage.Append("客户端IP：" + user_IP + Environment.NewLine);
                sbMessage.Append("客户端DNS主机名：" + filterContext.HttpContext.Request.UserHostName + Environment.NewLine);
                sbMessage.Append("客户端使用平台：" + filterContext.HttpContext.Request.Browser.Platform + Environment.NewLine);
                sbMessage.Append("客户端使用浏览器：" + filterContext.HttpContext.Request.Browser.Type + Environment.NewLine);
                sbMessage.Append("客户端浏览器版本号：" + filterContext.HttpContext.Request.Browser.Version + Environment.NewLine);
                sbMessage.Append("客户端请求URL：" + filterContext.HttpContext.Request.Url + Environment.NewLine);
                sbMessage.Append(string.Format("错误页面：{0}{4}Message:{1}{4}Source:{2}{4}Trace:{3}",
                                                        filterContext.HttpContext.Request.Url
                                                        , filterContext.Exception.Message
                                                        , filterContext.Exception.Source
                                                        , filterContext.Exception.StackTrace
                                                        , Environment.NewLine));
            }
            if (filterContext.Exception.InnerException != null)
            {
                sbMessage.Append(string.Format("{3}InnerException：{3}Message:{0}{3}Source:{1}{3}Trace:{2}",
                                                        filterContext.Exception.InnerException.Message
                                                        , filterContext.Exception.InnerException.Source
                                                        , filterContext.Exception.InnerException.StackTrace
                                                        , Environment.NewLine));
            }
            return sbMessage.ToString();
        }

    }
}