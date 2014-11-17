using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Shangpin.Logistic.Web.WebControls.Mvc.Authorization;

namespace Shangpin.Logistic.WebUI.Common
{
    public class TMSAuthorizeAttribute : AuthorizeAttribute 
    {
        #region IAuthorizationFilter 成员

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var arrts = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AllowAnoumousAttribute), false);
            //允许匿名访问
            if (arrts.Length == 0)
            {
                base.OnAuthorization(filterContext);

                //未验证通过，转到登陆页面
                if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
                {                    
                    filterContext.Result = new RedirectResult("~/Home/GoLogin");
                } 
            }

        }

        #endregion
    }
}