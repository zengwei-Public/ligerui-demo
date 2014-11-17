using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml.Linq;
using System.Web;
using System.Threading;

namespace Shangpin.Logistic.Web.WebControls.Mvc.Authorization
{
    /// <summary>
    /// MVC验证
    /// </summary>
    public class MvcAuthorization
    {
        private const string FILE_PATH = @"~/Authorization.config";
        private const string FILE_PATH_ForTest = @"D:\Authorization.config";
        private static string fullPath;
        private static XElement authorizationElement;
        /// <summary>
        /// 是否正在加载配置文件
        /// </summary>
        private static bool IsLoading;
        private static object loadlock = new object();

        public static bool FailedRedirectLoginUrl { get; set; }
        public static string DefaultRedirectUrl { get; set; }

        static MvcAuthorization()
        {
            // fullPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, FILE_PATH);
            if (HttpContext.Current != null)
            {
                fullPath = HttpContext.Current.Server.MapPath(FILE_PATH);
            }
            else
            {
                fullPath = FILE_PATH_ForTest;
            }

            //监视指定的配置文件
            FileSystemWatcher configFileWatcher = new FileSystemWatcher(Path.GetDirectoryName(fullPath), Path.GetFileName(fullPath));
            configFileWatcher.Changed += new FileSystemEventHandler(configFileWatcher_Changed);
            configFileWatcher.NotifyFilter = NotifyFilters.LastWrite; //监视最后写入时间
            configFileWatcher.EnableRaisingEvents = true;//允许触发事件
        }

        static void configFileWatcher_Changed(object sender, FileSystemEventArgs e)
        {
            loadConfig();
        }

        /// <summary>
        /// 加载配置文件
        /// </summary>
        private static void loadConfig()
        {
            IsLoading = true;
            lock (loadlock)
            {
                try
                {
                    var xdoc = XDocument.Load(fullPath);
                    var settings = xdoc.Descendants("settings").Descendants("add");
                    MvcAuthorization.FailedRedirectLoginUrl = Convert.ToBoolean(
                        settings.FirstOrDefault(x => x.Attribute("key").Value == "FailedRedirectLoginUrl")
                            .Attribute("value").Value);
                    MvcAuthorization.DefaultRedirectUrl = settings.FirstOrDefault(x => x.Attribute("key").Value == "DefaultRedirectUrl")
                        .Attribute("value").Value;

                    authorizationElement = xdoc.Descendants("authorization").First();
                    authorizationElement.Descendants().ToList()
                        .ForEach(x =>
                        {
                            string name = x.Name.LocalName;
                            string allowRoles = x.Attribute("allowRoles") == null ? null : x.Attribute("allowRoles").Value;
                            string allowUsers = x.Attribute("allowUsers") == null ? null : x.Attribute("allowUsers").Value;

                            var xtmp = x;
                            bool changeflag = false;
                            while (xtmp.Parent.Name.LocalName != "authorization")
                            {
                                xtmp = xtmp.Parent;
                                if (allowRoles == null)
                                {
                                    string pAllowRoles = xtmp.Attribute("allowRoles") == null ? null : xtmp.Attribute("allowRoles").Value;
                                    allowRoles = pAllowRoles;
                                    changeflag = true;
                                }

                                if (allowUsers == null)
                                {
                                    string pAllowUsers = xtmp.Attribute("allowUsers") == null ? null : xtmp.Attribute("allowUsers").Value;
                                    allowUsers = pAllowUsers;
                                    changeflag = true;
                                }
                            }
                            if (changeflag)
                            {
                                if (allowRoles != null)
                                {
                                    x.SetAttributeValue("allowRoles", allowRoles);
                                }
                                if (allowUsers != null)
                                {
                                    x.SetAttributeValue("allowUsers", allowUsers);
                                }
                            }
                        });
                }
                catch (Exception)
                {
                    authorizationElement = null;
                }
                IsLoading = false;
            }
        }

        /// <summary>
        /// 验证
        /// </summary>
        /// <param name="area"></param>
        /// <param name="controller"></param>
        /// <param name="action"></param>
        /// <param name="userName"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public static bool Author(string area, string controller, string action, string userName, List<string> roles)
        {
            if (IsLoading)
            {
                return false;
            }
            if (authorizationElement == null)
            {
                loadConfig();
            }
            string allowRoles = "";
            string allowUsers = "";
            var xAreas = authorizationElement.Element("areas");
            allowRoles = xAreas.Attribute("allowRoles").Value;
            allowUsers = xAreas.Attribute("allowUsers").Value;

            //Area Xelement
            var xArea = xAreas.Descendants("area")
                .Where(x => x.Attribute("name").Value.Equals(area, StringComparison.CurrentCultureIgnoreCase))
                .FirstOrDefault();
            if (xArea != null)
            {
                allowRoles = xArea.Attribute("allowRoles").Value;
                allowUsers = xArea.Attribute("allowUsers").Value;
                //Controller Xelement
                var xController = xArea.Descendants("controller")
                    .Where(x => x.Attribute("name").Value.Equals(controller, StringComparison.CurrentCultureIgnoreCase))
                    .FirstOrDefault();
                if (xController != null)
                {
                    allowRoles = xController.Attribute("allowRoles").Value;
                    allowUsers = xController.Attribute("allowUsers").Value;
                    //Action Xelement
                    var xAction = xController.Descendants("action")
                    .Where(x => x.Attribute("name").Value.Equals(action,StringComparison.CurrentCultureIgnoreCase))
                    .FirstOrDefault();
                    if (xAction != null)
                    {
                        allowRoles = xAction.Attribute("allowRoles").Value;
                        allowUsers = xAction.Attribute("allowUsers").Value;
                    }
                }
            }
            var allowUserList = allowUsers.Split(',').ToList();
            var allowRoleList = allowRoles.Split(',').ToList();
            //允许匿名访问
            if (allowUserList.Contains("?"))
            {
                return true;
            }
            //允许所有验证用户访问
            if (allowUserList.Contains("*"))
            {
                if (!string.IsNullOrWhiteSpace(userName))
                {
                    return true;
                }
            }
            //允许该用户名
            if (allowUserList.Contains(userName))
            {
                return true;
            }
            if (roles != null && roles.Count() > 0)
            {
                //允许该角色
                if (allowRoleList.Intersect(roles).Any())
                {
                    return true;
                }
            }

            return false;
        }

    }
}
