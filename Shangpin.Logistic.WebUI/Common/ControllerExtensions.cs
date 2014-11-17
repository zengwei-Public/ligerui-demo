using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Model.Basic;

namespace Shangpin.Logistic.WebUI.Common
{
    public static class ControllerExtensions
    {
        /// <summary>
        /// 将枚举类型发送到View
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="controller">控制器</param>
        /// <param name="name">传入ViewData名称</param>
        /// <param name="enumValue">枚举值</param>
        public static void SendEnumSelectListToView<T>(this Controller controller, string name, T enumItem)
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("泛型T必须是枚举类型。");
            }
            SendEnumSelectListToView<T>(controller, name, Convert.ToInt32(enumItem));
        }

        /// <summary>
        /// 将枚举类型发送到View
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="controller">控制器</param>
        /// <param name="name">传入ViewData名称</param>
        /// <param name="enumValue">枚举值</param>
        public static void SendEnumSelectListToView<T>(this Controller controller, string name, int? enumValue = null)
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("泛型T必须是枚举类型。");
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                name = typeof(T).Name;
            }

            controller.ViewData[name] = EnumHelper.GetEnumValueAndDescriptionsEx<T>()
                .Select(x => new SelectListItem
                {
                    Text = x.Value,
                    Value = x.Key.ToString(),
                    Selected = enumValue.HasValue
                                        ? (enumValue.Value & x.Key) == x.Key
                                        : false,
                });
        }

        /// <summary>
        /// 为搜索列表页面设置默认AjaxOptions
        /// </summary>
        /// <param name="controller">控制器</param>
        /// <param name="updateTargetId">更新元素ID</param>
        public static void SetSearchListAjaxOptions(this Controller controller, string updateTargetId = "SearchResultList")
        {
            if (controller.ViewBag.AjaxOptions == null)
            {
                controller.ViewBag.AjaxOptions = new System.Web.Mvc.Ajax.AjaxOptions
                {
                    UpdateTargetId = updateTargetId,
                    HttpMethod = "Post",
                    LoadingElementId = "Loading",
                    OnBegin = "AjaxBegin_SearchList",
                    OnComplete = "AjaxComplete_SearchList",
                    OnFailure = "AjaxError",
                };
            }
        }

        /// <summary>
        /// 将ID和Name的List发送到View
        /// </summary>
        /// <typeparam name="T">泛型类</typeparam>
        /// <param name="controller">控制器</param>
        /// <param name="list">数据列表</param>
        /// <param name="name">传入ViewData名称</param>
        /// <param name="addDefaultItem">是否添加默认"请选择"</param>
        public static void SendSelectListToView<T>(this Controller controller, List<T> list, string name, bool addDefaultItem = false) where T : IDAndNameModel, new()
        {
            if (list != null)
            {
                controller.ViewData[name] = list
                    .Select(x => new SelectListItem
                    {
                        Text = x.Name,
                        Value = x.ID,
                    }).ToList();
            }
            else             
            {
                controller.ViewData[name] = new List<SelectListItem>();
            }
            if (addDefaultItem)
            {
                ((List<SelectListItem>)controller.ViewData[name])
                    .Insert(0, new SelectListItem() { Selected = true, Text = "--请选择--", Value = "-1" });
            }
        }
    }
}