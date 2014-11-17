using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Reflection;

namespace Shangpin.Logistic.Util
{
    public class ConvertDT2DtoList<T> where T : new()
    {
        /// <summary>  
        /// 利用反射和泛型  
        /// </summary>  
        /// <param name="dt"></param>  
        /// <returns></returns>  
        public static List<T> ConvertToList(DataTable dt)
        {
            // 定义集合  
            List<T> ts = new List<T>();

            // 获得此模型的类型  
            Type type = typeof(T);
            //定义一个临时变量  
            string tempName = string.Empty;
            //遍历DataTable中所有的数据行  
            foreach (DataRow dr in dt.Rows)
            {
                T t = new T();
                // 获得此模型的公共属性  
                PropertyInfo[] propertys = t.GetType().GetProperties();
                //遍历该对象的所有属性  
                foreach (PropertyInfo pi in propertys)
                {
                    tempName = pi.Name;//将属性名称赋值给临时变量  
                    //检查DataTable是否包含此列（列名==对象的属性名）    
                    if (dt.Columns.Contains(tempName))
                    {
                        // 判断此属性是否有Setter  
                        if (!pi.CanWrite) continue;//该属性不可写，直接跳出  
                        //取值  
                        object value = dr[tempName];
                        //如果非空，则赋给对象的属性  
                        if (value != DBNull.Value)
                        {
                            //属性声明类型 DbType C#所有类型枚举 防止sql中bit类型转换到int失败
                            Type typeResult = pi.PropertyType;
                            //检查是否类型为允许Nullable，是则取真实类型
                            if (typeResult.IsGenericType && typeResult.GetGenericTypeDefinition() == typeof(Nullable<>))
                            {
                                Type[] type1 = typeResult.GetGenericArguments();
                                typeResult = type1[0];
                            }
                            if (typeResult.IsEnum)
                            {
                                pi.SetValue(t, Enum.Parse(typeResult, value.ToString()), null);
                                continue;
                            }
                            bool value_bool;
                            if (typeResult.Name == DbType.Int32.ToString() && bool.TryParse(value.ToString(), out value_bool))
                            {
                                pi.SetValue(t, value_bool == true ? 1 : 0, null);
                                continue;
                            }
                            Int64 value_int;
                            if (typeResult.Name == DbType.String.ToString() && Int64.TryParse(value.ToString(), out value_int))
                            {
                                pi.SetValue(t, value.ToString(), null);
                                continue;
                            }
                            pi.SetValue(t, value, null);
                        }
                    }
                }
                //对象添加到泛型集合中  
                ts.Add(t);
            }

            return ts;

        }
    }  
    public class ConvertHelper
    {
        /// <summary>
        /// 泛型列表中的某一指定属性转string，指定间隔符拼接
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="propertyName"></param>
        /// <param name="spacer"></param>
        /// <returns></returns>
        public static string ListOneProperty2String<T>(List<T> list, string propertyName, string spacer, bool removeRepeat = false) where T : new()
        {
            if (list == null || list.Count <= 0)
                return null;

            StringBuilder sbStr = new StringBuilder();

            foreach (T t in list)
            {
                PropertyInfo[] propertys = t.GetType().GetProperties();
                foreach (PropertyInfo p in propertys)
                {
                    if (p.Name == propertyName)
                    {
                        var v = p.GetValue(t, null).ToString();
                        if (removeRepeat && sbStr.ToString().Contains(v + spacer)) continue;
                        sbStr.Append(v + spacer);
                    }
                }
            }
            return sbStr.ToString().TrimEnd(spacer.ToCharArray());
        }
    }
}
