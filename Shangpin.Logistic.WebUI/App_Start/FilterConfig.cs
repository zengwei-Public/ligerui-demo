using Shangpin.Logistic.Web.WebControls.Mvc.Authorization;
using Shangpin.Logistic.WebUI.Common;
using System.Web;
using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new TMSHandleErrorAttribute());
            //filters.Add(new TMSAuthorizeAttribute());
            filters.Add(new XmlAuthorizeAttribute());
        }
    }
}