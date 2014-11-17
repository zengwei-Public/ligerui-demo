using Shangpin.Logistic.Model.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI.Controllers
{
    public class FrameController : Controller
    {
        //
        // GET: /Frame/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Main()
        {
            return View();
        }

        public ActionResult Menu()
        {
            //todo zengwei 获取菜单权限
            //var MenuList = UserContextService.GetUserMenuByUserName(UserContext.CurrentUser.UserCode);
            var MenuList = GetTestMenuList();

            return View(MenuList);
        }

        private List<MenuModel> GetTestMenuList()
        {
            var MenuList = new List<MenuModel>();
            MenuModel mm1 = new MenuModel();
            mm1.ID = "1";
            mm1.Name = "test";
            mm1.MenuLevel = 0;
            mm1.ParentID = "0";
            mm1.Url = "";
            MenuList.Add(mm1);

            MenuModel mm = new MenuModel();
            mm.ID = "2";
            mm.Name = "test";
            mm.MenuLevel = 1;
            mm.ParentID = "1";
            mm.Url = "~/Test/Test";
            MenuList.Add(mm);

            MenuModel mm2 = new MenuModel();
            mm2.ID = "3";
            mm2.Name = "testList";
            mm2.MenuLevel = 1;
            mm2.ParentID = "1";
            mm2.Url = "~/Test/Test/TestList";
            MenuList.Add(mm2);

            return MenuList;
        }


        public ActionResult LeftLine()
        {
            return View();
        }

        public ActionResult TopLine()
        {
            return View();
        }

        public ActionResult TabPage()
        {
            return View();
        }

        public ActionResult Notice()
        {
            //todo zengwei 获取首页动态信息
            //var notice = PermissionService.GetNotice();
            var notice = new NoticeModel();
            notice.Title = "EP-TMS框架搭建";
            notice.NoitceContent = "2014-06-03EP-TMS物流管理系统框架搭建完成。";
            if (notice == null) notice = new NoticeModel();
            return View(notice);
        }


        private string JSList = string.Empty;
    }
}
