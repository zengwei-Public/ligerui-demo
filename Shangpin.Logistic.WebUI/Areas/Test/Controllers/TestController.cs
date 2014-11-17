using Shangpin.Logistic.IBLL;
using Shangpin.Logistic.Model;
using Shangpin.Logistic.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Shangpin.Logistic.WebUI.Common;
using Shangpin.Logistic.Util.Pager;
using Shangpin.Logistic.Model.Basic;

namespace Shangpin.Logistic.WebUI.Areas.Test.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /Test/Test/

        public ActionResult Index()
        {
            ITestBLL bll = ServiceLocator.GetService<ITestBLL>();
            TestSearchModel searchModel = new TestSearchModel();

            var test = bll.GetModel(searchModel);
            return View(test[0]);
        }

        public ActionResult TestList()
        {
            this.SetSearchListAjaxOptions();

            TestSearchModel searchModel = new TestSearchModel();
            int pageSize = Convert.ToInt32(Request["PageSize"] ?? "10");
            int pageIndex = Convert.ToInt32(Request["page"] ?? "1");
            searchModel.CurrentPageIndex = pageIndex;
            searchModel.PageSize = pageSize;

            if (!string.IsNullOrWhiteSpace(Request["RoleName"]))
            {
                searchModel.RoleName = Request["RoleName"];
            }
            //else
            //{
            //    List<TestModel> bm = new List<TestModel>();
            //    PagedList<TestModel> l = new PagedList<TestModel>(bm, 0, 0);
            //    if (Request.IsAjaxRequest())
            //    {
            //        return PartialView("_PartialTestList", l);
            //    }
            //    return View(l);
            //}

            searchModel.Trim();
            ITestBLL bll = ServiceLocator.GetService<ITestBLL>();
            var pagelist = bll.GetListModel(searchModel);

            if (Request.IsAjaxRequest())
            {
                return PartialView("_PartialTestList", pagelist);
            }

            return View(pagelist);
        }
    }
}
