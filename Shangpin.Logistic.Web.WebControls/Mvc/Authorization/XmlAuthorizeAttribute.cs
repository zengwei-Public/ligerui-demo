using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web;
using System.Web.Security;

namespace Shangpin.Logistic.Web.WebControls.Mvc.Authorization
{
    public class XmlAuthorizeAttribute : AuthorizeAttribute
    {

        #region IAuthorizationFilter 成员
        bool isPass = false;

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var arrts = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AllowAnoumousAttribute), false);
            //允许匿名访问
            if (arrts.Length > 0)
            {
                return;
            }
            string verb = filterContext.HttpContext.Request.HttpMethod;
            string areaName = (string)filterContext.RouteData.DataTokens["area"] ?? "";
            string controllerName = (string)filterContext.RouteData.Values["controller"];
            string actionName = (string)filterContext.RouteData.Values["action"];

            string userName = filterContext.HttpContext.User.Identity.Name;
            var roles = System.Web.Security.Roles.GetRolesForUser(userName).ToList();

            bool isPass = MvcAuthorization.Author(areaName, controllerName, actionName, userName, roles);
            //未验证通过
            if (!isPass)
            {
                //未验证通过，转到登陆页面
                if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
                {
                    filterContext.Result = new HttpUnauthorizedResult();
              //     FormsAuthentication.RedirectToLoginPage();
                }
                else
                {
                    if (MvcAuthorization.FailedRedirectLoginUrl)
                    {
                        FormsAuthentication.SignOut();
                      //  FormsAuthentication.RedirectToLoginPage();
                        filterContext.Result = new HttpUnauthorizedResult();
                    }
                    else
                    {
                     //   isPass = false;
                        filterContext.Result = new RedirectResult(MvcAuthorization.DefaultRedirectUrl);
                    }
                }
            }
        }


        #endregion
    }
}
