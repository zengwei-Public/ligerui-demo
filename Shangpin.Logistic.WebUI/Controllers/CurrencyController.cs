using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Shangpin.Logistic.WebUI.Models;
using Shangpin.Logistic.WebUI.Common;

namespace Shangpin.Logistic.WebUI.Controllers
{
    public class CurrencyController : Controller
    {
        //
        // GET: /Currency/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Create()
        {
           return View("Edit");
        }

        [HttpPost]
        public ActionResult Create(CurrencyFormModel model)
        {
            if(ModelState.IsValid)
            {
                return Json(new { Successed = true, Message = "保存成功！" });
            }

            return Json(new { Successed = false, Message = "保存失败！" });
        }

        public ActionResult Edit()
        {
            return PartialView("_EditPartial");
        }

        public ActionResult GetDataList(QueryCriteria query)
        {
            var dataList = new List<CurrencyViewModel>(){};

            dataList.Add(new CurrencyViewModel()
            {
                CurrencyNumber = "001",
                CurrencyName = "人民币",
                CurrencySymbo = "￥",
                CurrencyCode = "CNY",
                CurrencyExchangRate = 6.5M,
                IsDefault = "是",
                CreateTime = new DateTime(2014,6,8)
            });

            dataList.Add(new CurrencyViewModel()
            {
                CurrencyNumber = "002",
                CurrencyName = "港币",
                CurrencySymbo = "＄",
                CurrencyCode = "HKD",
                CurrencyExchangRate = 6.5M,
                IsDefault = "否",
                CreateTime = new DateTime(2014, 6, 8)
            });

            dataList.Add(new CurrencyViewModel()
            {
                CurrencyNumber = "003",
                CurrencyName = "美元",
                CurrencySymbo = "＄",
                CurrencyCode = "USD",
                CurrencyExchangRate = 6.5M,
                IsDefault = "否",
                CreateTime = new DateTime(2014, 6, 8)
            });

            dataList.Add(new CurrencyViewModel()
            {
                CurrencyNumber = "004",
                CurrencyName = "欧元",
                CurrencySymbo = "EUR",
                CurrencyCode = "EUR",
                CurrencyExchangRate = 6.5M,
                IsDefault = "否",
                CreateTime = new DateTime(2014, 6, 8)
            });

            return new JsonNetResult(new { Rows = dataList, Total = 8 });
        }
    }
}
