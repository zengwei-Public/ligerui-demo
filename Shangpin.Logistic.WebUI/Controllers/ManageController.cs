using Shangpin.Logistic.Model.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI.Controllers
{
    public class ManageController : Controller
    {
        //
        // GET: /Test/

        public ActionResult Index()
        {
            UserModel curUser = UserContext.CurrentUser;
            if (curUser == null)
            {
                curUser = UserContext.CurrentUser;
            }
            ViewData["CurrentUser"] = curUser;
            return View("Index");
        }

        private List<MenuModel> GetTestMenuList()
        {
            var MenuList = new List<MenuModel>();
            MenuModel mm1 = new MenuModel();
            mm1.ID = "1";
            mm1.Name = "测试管理";
            mm1.MenuLevel = 0;
            mm1.ParentID = "0";
            mm1.Url = "";
            MenuList.Add(mm1);

            MenuModel mm = new MenuModel();
            mm.ID = "2";
            mm.Name = "测试";
            mm.MenuLevel = 1;
            mm.ParentID = "1";
            mm.Url = "~/Test/Test";
            MenuList.Add(mm);

            MenuModel mm2 = new MenuModel();
            mm2.ID = "3";
            mm2.Name = "测试列表";
            mm2.MenuLevel = 1;
            mm2.ParentID = "1";
            mm2.Url = "~/Test/Test/TestList";
            MenuList.Add(mm2);

            MenuModel mm3 = new MenuModel();
            mm3.ID = "4";
            mm3.Name = "测试管理1";
            mm3.MenuLevel = 0;
            mm3.ParentID = "0";
            mm3.Url = "";
            MenuList.Add(mm3);

            MenuModel mm4 = new MenuModel();
            mm4.ID = "5";
            mm4.Name = "列表测试1";
            mm4.MenuLevel = 1;
            mm4.ParentID = "4";
            mm4.Url = "~/Currency/index";
            MenuList.Add(mm4);

            return MenuList;
        }

        public ActionResult GetUserButton()
        {
            return Json(null);
        }

        private List<MenuModel> Menus()
        {
            var menus = GetTestMenuList();
            return menus;
        }

        public ActionResult MenuGroups()
        {
            var menus = Menus().Where(r => r.ParentID == "0" && r.MenuLevel == 0).OrderBy(x=>x.OrderBy).ToList();
            return Json(menus, JsonRequestBehavior.AllowGet);
        }

        public ActionResult MenuItems(string parentId)
        {
            var menus=Menus();
            var menuParent = menus.Where(r => r.ID == parentId).ToList();
            string parentName = "";
            if (menuParent.Count == 1)
            {
                parentName = menuParent[0].Name;
            }
            ViewBag.MenuTitle = parentName;

            var menusItem = menus.Where(r => r.ParentID == parentId).OrderBy(x => x.OrderBy).ToList();
            //return Json(menusItem, JsonRequestBehavior.AllowGet);
            return PartialView("_MenusPartial", menusItem);
        }
    }
}
