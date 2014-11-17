using Shangpin.Logistic.Model.Basic;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Util.Drawing;
using Shangpin.Logistic.Util.Security;
using Shangpin.Logistic.Web.WebControls.Mvc.Authorization;
using Shangpin.Logistic.WebUI.Models;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Xml;

namespace Shangpin.Logistic.WebUI.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// 验证码名字
        /// </summary>
        private const string VerificationCodeID = "VerificationCodeID";

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

        [AllowAnoumous]
        public ActionResult Login()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                return Redirect(FormsAuthentication.DefaultUrl);
            }

            return View();
        }

        [AllowAnoumous]
        [HttpPost]
        public ActionResult Login(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                HttpCookie cookie = Request.Cookies[VerificationCodeID];
                //if (cookie == null || string.IsNullOrWhiteSpace(cookie.Value) || !VerificationCodeService.VerifyCode(cookie.Value, model.VerificationCode, true))
                if (cookie == null || string.IsNullOrWhiteSpace(cookie.Value) || MD5.Encrypt(model.VerificationCode.ToLower()) != cookie.Value)
                {
                    ModelState.AddModelError("VerificationCode", "验证码不正确。");
                }
                else
                {
                    bool loginResult = false;
                    try
                    {
                        loginResult = Membership.ValidateUser(model.UserName, model.Password);
                        if (loginResult)
                        {
                            cookie.Expires = DateTime.Now.AddDays(-1);
                            Response.Cookies.Set(cookie);
                            // todo zengwei 获取登录用户信息
                            //var user = UserContextService.GetUserInfo(model.UserName);
                            var user = new UserModel()
                            {
                                UserName = "zengwei",
                                UserID = "zengwei",
                            };
                            
                            UserContext.SetAuthCookie(user, model.RememberMe);
                            //  FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
                            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                            {
                                return Redirect(returnUrl);
                            }
                            else
                            {
                                return Redirect(FormsAuthentication.DefaultUrl);
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("UserName", "提供的用户名或密码不正确。");
                        }
                    }
                    catch (Exception ex)
                    {
                        loginResult = false;
                        ModelState.AddModelError("Exception", ex.Message);
                    }
                }
            }
            GenerateVerificationCode();
            return View(model);
        }

        [AllowAnoumous]
        public ActionResult GoLogin()
        {
            return View();
        }

        [AllowAnoumous]
        public ActionResult CheckVerificationCode(string VerificationCode)
        {
            bool result = false;
            HttpCookie cookie = Request.Cookies[VerificationCodeID];
            if (cookie == null || string.IsNullOrWhiteSpace(cookie.Value))
            {
                result = false;
            }
            else
            {
                //result = VerificationCodeService.VerifyCode(cookie.Value, VerificationCode, false);
                result = MD5.Encrypt(VerificationCode.ToLower()) == cookie.Value;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [AllowAnoumous]
        public ActionResult GenerateVerificationCode()
        {
            var verificationcode = Authcode.Generate();
            //string id = VerificationCodeService.SetVerificationCode(verificationcode.Code);
            string id = MD5.Encrypt(verificationcode.Code.ToLower());
            if (string.IsNullOrWhiteSpace(id)) return new EmptyResult();

            HttpCookie cookie = new HttpCookie(VerificationCodeID, id);
            Response.Cookies.Add(cookie);
            MemoryStream ms = new MemoryStream();
            verificationcode.Bitmap.Save(ms, ImageFormat.Jpeg);
            ms.Position = 0;
            return File(ms, "image/jpeg");
        }

        [AllowAnoumous]
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Notice()
        {
            //todo zengwei 获取首页动态信息
            //var notice = PermissionService.GetNotice();
            var notice = new NoticeModel();
            notice.Title = "EP-TMS框架搭建";
            notice.NoitceContent = "2014-06-10  EP-TMS物流管理系统新框架搭建完成。";
            if (notice == null) notice = new NoticeModel();
            return PartialView("Welcome", notice);
        }

        private List<MenuModel> GetTestMenuList()
        {
            string path = AppDomain.CurrentDomain.BaseDirectory;
            if (!path.EndsWith(@"\"))
                path = path + @"\";
            var menusPath = string.Format(@"{0}\Config\Menus.xml", path);
            var MenuList = new List<MenuModel>();
            XmlDocument xmlDoc = XmlHelper.xmlDoc(menusPath);
            if (xmlDoc == null) return null;
            foreach (XmlNode xn in xmlDoc.DocumentElement.ChildNodes)
            {
                MenuModel m = new MenuModel();
                m.ID = XmlHelper.GetAttributeValue(xn, "id");
                m.Name = XmlHelper.GetAttributeValue(xn, "name");
                m.MenuLevel = int.Parse(XmlHelper.GetAttributeValue(xn, "menulevel"));
                m.Url = XmlHelper.GetAttributeValue(xn, "url");
                m.ParentID = XmlHelper.GetAttributeValue(xn, "parentid");
                MenuList.Add(m);
            }
            return MenuList;

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
            var menus = Menus().Where(r => r.ParentID == "0" && r.MenuLevel == 0).OrderBy(x => x.OrderBy).ToList();
            return Json(menus, JsonRequestBehavior.AllowGet);
        }

        public ActionResult MenuItems(string parentId)
        {
            var menus = Menus();
            MenusList = new List<MenuModel>();
            CreateMenuLevel(menus, parentId, null);
            return PartialView("_MenusPartial", MenusList);
        }
        private List<MenuModel> MenusList;
        private void CreateMenuLevel(List<MenuModel> menus, string parentId, MenuModel parentMenu)
        {
            var menusItem = menus.Where(r => r.ParentID == parentId).OrderBy(x => x.OrderBy).ToList();
            foreach (MenuModel m in menusItem)
            {
                int childCount = menus.Where(r => r.ParentID == m.ID).Count();
                if (childCount != null && childCount > 0)
                {
                    m.Children = new List<MenuModel>();
                    CreateMenuLevel(menus, m.ID, m);
                }
                if (parentMenu == null)
                    MenusList.Add(m);
                else
                    parentMenu.Children.Add(m);
            }
        }
    }
}
