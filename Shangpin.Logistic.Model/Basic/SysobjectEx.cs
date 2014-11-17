using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Logistic.Model.Basic
{
    public static partial class ModelEx
    {
        /// <summary>
        /// 排除相应属性
        /// </summary>
        /// <param name="property"></param>
        /// <param name="filter">筛选属性名称,此集合的属性对象不会出现在返回结果中</param>
        /// <returns></returns>
        public static IEnumerable<PropertyInfo> Except(this IEnumerable<PropertyInfo> property, IEnumerable<String> filter)
        {
            if (filter != null && filter.Count() > 0)
            {
                List<PropertyInfo> listExcept = new List<PropertyInfo>();
                foreach (var item in property)
                {
                    if (!filter.Contains(item.Name))
                    {
                        listExcept.Add(item);
                    }
                }
                return listExcept;
            }
            return property;
        }
    }
}
