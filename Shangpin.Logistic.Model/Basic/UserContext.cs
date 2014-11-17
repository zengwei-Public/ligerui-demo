using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Util.LogMail;

namespace Shangpin.Logistic.Model.Basic
{
    public class UserContext
    {

        /// <summary>
        /// 当前用户
        /// </summary>
        public static UserModel CurrentUser
        {
            get
            {
                return GetAuthUser();
            }
        }

        /// <summary>
        /// 获取用户对象
        /// </summary>
        /// <returns></returns>
        private static UserModel GetAuthUser()
        {
            if (HttpContext.Current == null)
            {
                return new UserModel();
            }
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket = null;
            UserModel model = null;
            try
            {
                //解密
                authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                model = authTicket.UserData.DesrializeToObject<UserModel>();
            }
            catch (Exception ex)
            {
                Log.logger.Error("AuthTicket解密异常，登陆失败", ex);

                FormsAuthentication.SignOut();
                FormsAuthentication.RedirectToLoginPage();
            }
            return model ?? new UserModel();
        }

        /// <summary>
        /// 设置客户端口验证票据
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userModel"></param>
        /// <param name="createPersistentCookie"></param>
        /// <param name="strCookiePath"></param>
        public static void SetAuthCookie(UserModel userModel, bool createPersistentCookie, string strCookiePath = "/")
        {
            string userName = userModel.UserName;

            // 获得Cookie
            HttpCookie authCookie = FormsAuthentication.GetAuthCookie(userName, createPersistentCookie, strCookiePath);

            string userData = userModel.SerializeToString();

            //// 得到ticket凭据
            //FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);

            // 根据之前的ticket凭据创建新ticket凭据，然后加入自定义信息
            FormsAuthenticationTicket newTicket = new FormsAuthenticationTicket(
                2, userModel.UserID, DateTime.Now, DateTime.Now.AddDays(Consts.COOKIE_EXPIRES),
                createPersistentCookie, userData, strCookiePath);

            // 将新的Ticke转变为Cookie值，然后添加到Cookies集合中
            authCookie.Value = FormsAuthentication.Encrypt(newTicket);
            if (HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName] == null)
            {
                HttpContext.Current.Response.Cookies.Add(authCookie);
            }
            else
            {
                HttpContext.Current.Response.Cookies.Set(authCookie);
            }
        }
    }
}
