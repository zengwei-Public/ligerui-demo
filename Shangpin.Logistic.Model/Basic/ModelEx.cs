using Shangpin.Logistic.Model.CustomerAttribute;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Logistic.Model.Basic
{
    public static partial class ModelEx
    {
        /// <summary>
        /// 对象属性字典集合
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="model">原始列表</param>
        /// <param name="filter">需要筛选的列表</param>
        /// <returns></returns>
        public static Dictionary<String, String> DicProperty<T>(this T model, params String[] filter) where T : new()
        {
            Dictionary<String, String> dicResult = new Dictionary<String, String>();
            Type type = typeof(T);
            PropertyInfo[] arrProperty = type.GetProperties();
            if (filter != null && filter.Length > 0)
            {
                arrProperty = arrProperty.Except(filter).ToArray();
            }
            foreach (var item in arrProperty)
            {
                var descAttr = item.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (descAttr != null && descAttr.Length > 0)
                {
                    dicResult.Add(item.Name, (descAttr[0] as DescriptionAttribute).Description);
                    continue;
                }
                dicResult.Add(item.Name, item.Name);
            }
            return dicResult;
        }

        /// <summary>
        /// 检索对象字符串属性Trim
        /// </summary>
        /// <typeparam name="T">检索类型</typeparam>
        /// <param name="searchModel">检索对象</param>
        public static void Trim<T>(this T searchModel) where T : PageInfo, new()
        {
            Type type = typeof(T);
            PropertyInfo[] arrProperty = type.GetProperties();
            Type pitype = null;
            foreach (var item in arrProperty)
            {
                pitype = item.PropertyType;
                if (pitype == typeof(String))
                {
                    object piValue = item.GetValue(searchModel, null);
                    if (piValue != null)
                    {
                        item.SetValue(searchModel, piValue.ToString().Trim(), null);
                    }
                }
            }
        }

        /// <summary>
        /// 转换列表到二维数组
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="listModel">原始列表</param>
        /// <param name="listFilter">需要筛选的列表</param>
        /// <returns></returns>
        public static String[,] To2Array<T>(this PagedList<T> listModel, params String[] filter) where T : new()
        {
            Type type = typeof(T);
            PropertyInfo[] arrProperty = type.GetProperties();
            if (filter != null && filter.Length > 0)
            {
                arrProperty = arrProperty.Except(filter).ToArray();
            }
            PropertyInfo pi = null;
            String[,] arrData = new String[listModel.Count + 1, arrProperty.Length];
            //append title
            for (int i = 0; i < arrProperty.Length; i++)
            {
                pi = arrProperty[i];
                var descAttr = pi.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (descAttr != null && descAttr.Length > 0)
                {
                    arrData[0, i] = (descAttr[0] as DescriptionAttribute).Description;
                    continue;
                }
                arrData[0, i] = pi.Name;
            }
            //append data
            for (int i = 0; i < listModel.Count; i++)
            {
                for (int j = 0; j < arrProperty.Length; j++)
                {
                    pi = arrProperty[j];
                    object piValue = pi.GetValue(listModel[i], null);
                    if (piValue == null)
                    {
                        arrData[i + 1, j] = null;
                        continue;
                    }
                    Type pitype = pi.PropertyType;
                    if (pitype.Name.ToLower().Contains("nullable"))
                    {
                        pitype = Nullable.GetUnderlyingType(pitype);
                    }
                    if (pitype == typeof(bool))
                    {
                        arrData[i + 1, j] = Convert.ToBoolean(piValue) ? "是" : "否";
                        continue;
                    }
                    if (pitype.IsEnum)
                    {
                        arrData[i + 1, j] = EnumHelper.GetDescription(pitype, (int)piValue);
                        continue;
                    }
                    if (pitype == typeof(DateTime)
                        || pitype == typeof(DateTime?))
                    {
                        var showDateTimeAttr = pi.GetCustomAttributes(typeof(DateTimeFormatAttribute), false);
                        if (showDateTimeAttr != null && showDateTimeAttr.Length > 0)
                        {
                            DateTime nowtime = DateTime.Parse(piValue.ToString());
                            arrData[i + 1, j] = nowtime.ToString((showDateTimeAttr[0] as DateTimeFormatAttribute).DataFormatString);
                            continue;
                        }
                        //default datetime showformater
                        arrData[i + 1, j] = DateTime.Parse(piValue.ToString()).ToString("yyyy-MM-dd HH:mm:ss");
                        continue;
                    }
                    arrData[i + 1, j] = piValue.ToString();
                }
            }
            return arrData;
        }

        /// <summary>
        /// 转换列表到二维数组
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="listModel">原始列表</param>
        /// <param name="listFilter">需要筛选的列表</param>
        /// <returns></returns>
        public static String[,] To2Array<T>(this IList<T> listModel, params String[] filter) where T : new()
        {
            Type type = typeof(T);
            PropertyInfo[] arrProperty = type.GetProperties();
            if (filter != null && filter.Length > 0)
            {
                arrProperty = arrProperty.Except(filter).ToArray();
            }
            PropertyInfo pi = null;
            String[,] arrData = new String[listModel.Count + 1, arrProperty.Length];
            //append title
            for (int i = 0; i < arrProperty.Length; i++)
            {
                pi = arrProperty[i];
                var descAttr = pi.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (descAttr != null && descAttr.Length > 0)
                {
                    arrData[0, i] = (descAttr[0] as DescriptionAttribute).Description;
                    continue;
                }
                arrData[0, i] = pi.Name;
            }
            //append data
            for (int i = 0; i < listModel.Count; i++)
            {
                for (int j = 0; j < arrProperty.Length; j++)
                {
                    pi = arrProperty[j];
                    object piValue = pi.GetValue(listModel[i], null);
                    if (piValue == null)
                    {
                        arrData[i + 1, j] = null;
                        continue;
                    }
                    Type pitype = pi.PropertyType;
                    if (pitype.Name.ToLower().Contains("nullable"))
                    {
                        pitype = Nullable.GetUnderlyingType(pitype);
                    }
                    var rowNumberAttr = pi.GetCustomAttributes(typeof(ShowRowNumberAttribute), false);
                    if (rowNumberAttr != null && rowNumberAttr.Length > 0)
                    {
                        arrData[i + 1, j] = (i + 1).ToString();
                        continue;
                    }
                    if (pitype == typeof(bool))
                    {
                        arrData[i + 1, j] = Convert.ToBoolean(piValue) ? "是" : "否";
                        continue;
                    }
                    if (pitype.IsEnum)
                    {
                        arrData[i + 1, j] = EnumHelper.GetDescription(pitype, (int)piValue);
                        continue;
                    }
                    if (pitype == typeof(DateTime)
                        || pitype == typeof(DateTime?))
                    {
                        var showDateTimeAttr = pi.GetCustomAttributes(typeof(DateTimeFormatAttribute), false);
                        if (showDateTimeAttr != null && showDateTimeAttr.Length > 0)
                        {
                            DateTime nowtime = DateTime.Parse(piValue.ToString());
                            arrData[i + 1, j] = nowtime.ToString((showDateTimeAttr[0] as DateTimeFormatAttribute).DataFormatString);
                            continue;
                        }
                        //default datetime showformater
                        arrData[i + 1, j] = DateTime.Parse(piValue.ToString()).ToString("yyyy-MM-dd HH:mm:ss");
                        continue;
                    }
                    arrData[i + 1, j] = piValue.ToString();
                }
            }
            return arrData;
        }


        /// <summary>
        /// 把datarow转换为model
        /// 调用此函数请保证一下几点：
        /// 1.model的内不包含子model。
        /// 2.model有无参构造函数
        /// 3.model的属性名和datatable的列名一致（不区分大小写）
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dr"></param>
        /// <param name="dcc"></param>
        /// <returns></returns>
        public static T ConvertDataRowToModel<T>(DataRow dr, DataColumnCollection dcc) where T : new()
        {
            if (dr == null || dcc == null)
            {
                return default(T);
            }
            T t = new T();
            PropertyInfo[] pis = t.GetType().GetProperties();
            PropertyInfo pi = null;
            foreach (DataColumn dc in dcc)
            {
                pi = pis.FirstOrDefault(p => p.Name.ToLower().Equals(dc.ColumnName.ToLower()));
                if (pi != null
                    && dr[dc] != null
                    && dr[dc] != DBNull.Value
                    && pi.CanWrite)
                {
                    Type type = pi.PropertyType;
                    if (type.Name.ToLower().Contains("nullable"))
                    {
                        type = Nullable.GetUnderlyingType(type);
                    }
                    if (type.IsEnum)
                    {
                        if (dr[dc] != null && dr[dc] != DBNull.Value)
                        {
                            pi.SetValue(t, Enum.Parse(type, Convert.ToInt32(dr[dc]).ToString()), null);
                        }
                    }
                    else
                    {
                        pi.SetValue(t, Convert.ChangeType(dr[dc], type), null);
                    }
                }
            }
            return t;
        }

        /// <summary>
        /// 把datatable转换为mode
        /// 调用此函数请保证一下几点：
        /// 1.model的内不包含子model。
        /// 2.model有无参构造函数
        /// 3.model的属性名和datatable的列名一致（不区分大小写）
        /// </summary>
        /// <typeparam name="T">model的类型</typeparam>
        /// <param name="dt">datatable</param>
        /// <returns></returns>
        public static T SetValueFromDB<T>(this T model, DataTable dt) where T : new()
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                return ConvertDataRowToModel<T>(dt.Rows[0], dt.Columns);
            }
            return default(T);
        }

        /// <summary>
        /// 把datatable转换为modeList
        /// 调用此函数请保证一下几点：
        /// 1.model的内不包含子model。
        /// 2.model有无参构造函数
        /// 3.model的属性名和datatable的列名一致（不区分大小写）
        /// </summary>
        /// <typeparam name="T">model的类型</typeparam>
        /// <param name="dt">datatable</param>
        /// <returns></returns>
        public static IList<T> SetValueFromDB<T>(this IList<T> listModel, DataTable dt) where T : new()
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                List<T> lstReturn = new List<T>();
                DataColumnCollection dcc = dt.Columns;
                foreach (DataRow dr in dt.Rows)
                {
                    lstReturn.Add(ConvertDataRowToModel<T>(dr, dcc));
                }
                return lstReturn;
            }
            return null;
        }

        /// <summary>
        /// 从DataReader转换到Model
        /// </summary>
        /// <param name="model"></param>
        /// <param name="DataSource"></param>
        public static T SetValueFromDB<T>(this T model, DbDataReader DataSource) where T : new()
        {
            if (DataSource != null)
            {
                using (DataSource)
                {
                    if (!DataSource.HasRows) return default(T);
                    PropertyInfo[] pis = model.GetType().GetProperties();
                    if (DataSource.Read())
                    {
                        PropertyInfo pi = null;
                        for (int i = 0; i < DataSource.FieldCount; i++)
                        {
                            pi = pis.FirstOrDefault(p => p.Name.ToLower().Equals(DataSource.GetName(i).ToLower()));
                            if (pi != null
                                && DataSource[i] != null
                                && DataSource[i] != DBNull.Value
                                && pi.CanWrite)
                            {
                                Type type = pi.PropertyType;
                                if (type.Name.ToLower().Contains("nullable"))
                                {
                                    type = Nullable.GetUnderlyingType(type);
                                }
                                if (type.IsEnum)
                                {
                                    if (DataSource[i] != null && DataSource[i] != DBNull.Value)
                                    {
                                        pi.SetValue(model, Enum.Parse(type, Convert.ToInt32(DataSource[i]).ToString()), null);
                                    }
                                }
                                else
                                {
                                    pi.SetValue(model, Convert.ChangeType(DataSource[i], type), null);
                                }
                            }
                        }// end for
                        return model;
                    }// end if
                }//end DataSource
            }
            return default(T);
        }

        /// <summary>
        /// 从DataReader转换到List Model
        /// 适合小数据量反射转换
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="listModel"></param>
        /// <param name="DataSource"></param>
        public static IList<T> SetValueFromDB<T>(this IList<T> listModel, DbDataReader DataSource) where T : new()
        {
            if (DataSource != null)
            {
                using (DataSource)
                {
                    while (DataSource.Read())
                    {
                        T model = new T();
                        PropertyInfo[] pis = model.GetType().GetProperties();
                        PropertyInfo pi = null;
                        for (int i = 0; i < DataSource.FieldCount; i++)
                        {
                            pi = pis.FirstOrDefault(p => p.Name.ToLower().Equals(DataSource.GetName(i).ToLower()));
                            if (pi != null
                                && DataSource[i] != null
                                && DataSource[i] != DBNull.Value
                                && pi.CanWrite)
                            {
                                Type type = pi.PropertyType;
                                if (type.Name.ToLower().Contains("nullable"))
                                {
                                    type = Nullable.GetUnderlyingType(type);
                                }
                                if (type.IsEnum)
                                {
                                    if (DataSource[i] != null && DataSource[i] != DBNull.Value)
                                    {
                                        pi.SetValue(model, Enum.Parse(type, Convert.ToInt32(DataSource[i]).ToString()), null);
                                    }
                                }
                                else
                                {
                                    pi.SetValue(model, Convert.ChangeType(DataSource[i], type), null);
                                }
                            }
                        }//end for
                        listModel.Add(model);
                    }//end while
                }//end DataSource
            }
            return listModel;
        }
    }
}
