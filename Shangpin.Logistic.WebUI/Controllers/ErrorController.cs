using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 404
        /// </summary>
        /// <returns></returns>
        public ActionResult NotFound()
        {
            return View();
        }

        /// <summary>
        /// 403
        /// </summary>
        /// <returns></returns>
        public ActionResult Forbidden()
        {
            return View();
        }
    }
}
