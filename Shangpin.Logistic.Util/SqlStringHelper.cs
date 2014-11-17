using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Logistic.Util
{
    public class SqlStringHelper
    {
        public static void CreateWhereInIntByEnum<T>(T enumStr, SqlDbType dataType, string whereName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            if (enumStr == null) return;
            List<T> tList = new List<T>();
            tList.Add(enumStr);
            CreateWhereInIntByEnum<T>(tList, dataType, whereName, ref sbWhere, ref parameterList);
        }

        public static void CreateWhereInIntByEnum<T>(List<T> enumList, SqlDbType dataType, string whereName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            if (enumList == null || enumList.Count <= 0)
            {
                return;
            }

            StringBuilder sb_para = new StringBuilder();
            int i = 0;
            foreach (T t in enumList)
            {
                var key = t.GetHashCode();
                var value = t.GetType().ToString().Split('.');
                var str = "@" + value[value.Length - 1] + i;
                sb_para.Append("," + str);
                parameterList.Add(new SqlParameter(str, dataType) { Value = key });
                i++;
            }
            sbWhere.Append(string.Format(" AND {0} IN ({1})", whereName, sb_para.ToString().TrimStart(',')));
        }

        public static void CreateWhereInNameByEnum<T>(List<T> enumList, SqlDbType dataType, string whereName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            if (enumList == null || enumList.Count <= 0)
            {
                return;
            }

            StringBuilder sb_para = new StringBuilder();
            int i = 0;
            foreach (T t in enumList)
            {
                var key = t.ToString();
                var value = t.GetType().ToString().Split('.');
                var str = "@" + value[value.Length - 1] + i;
                sb_para.Append("," + str);
                parameterList.Add(new SqlParameter(str, dataType) { Value = key });
                i++;
            }
            sbWhere.Append(string.Format(" AND {0} IN ({1})", whereName, sb_para.ToString().TrimStart(',')));
        }

        /// <summary>
        /// List中String多值获取参数化参数和参数列表
        /// </summary>
        /// <typeparam name="T">枚举类型</typeparam>
        /// <param name="enumList">枚举列表</param>
        /// <param name="dataType">查询列类型</param>
        /// <param name="parameterStr">返回参数串</param>
        /// <returns></returns>
        public static void CreateWhereInIntByList<T>(List<T> strList, SqlDbType dataType, string whereName, string paraName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            if (strList == null || strList.Count <= 0)
            {
                return;
            }
            StringBuilder sb_para = new StringBuilder();
            int i = 0;
            foreach (T t in strList)
            {
                var pataNames = "@" + paraName + i;
                sb_para.Append("," + pataNames);
                parameterList.Add(new SqlParameter(pataNames, dataType) { Value = t });
                i++;
            }
            sbWhere.Append(string.Format(" AND {0} IN ({1})", whereName, sb_para.ToString().TrimStart(',')));
        }

        public static void CreateWhereInByString(string str, SqlDbType dataType, string whereName, string paraName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            StringBuilder sb_para = new StringBuilder();
            int i = 0;
            string[] strs = str.Split(',');
            foreach (string t in strs)
            {
                var paraNames = "@" + paraName + i;
                sb_para.Append("," + paraNames);
                parameterList.Add(new SqlParameter(paraNames, dataType) { Value = t });
                i++;
            }

            sbWhere.Append(string.Format(" AND {0} IN ({1})", whereName, sb_para.ToString().TrimStart(',')));
        }

        public static void CreateLikeWhereAndPara(string str, SqlDbType dataType, string whereName, string paraName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList)
        {
            if (string.IsNullOrWhiteSpace(str)) return;
            var paraNames = "@" + paraName;
            parameterList.Add(new SqlParameter(paraNames, dataType) { Value = str });
            sbWhere.Append(string.Format(" AND {0} LIKE {1}+'%'", whereName, paraNames));
        }

        public static void CreateSqlWhereAndPara<T>(T values, SqlDbType sqlType, string whereName, string paraName, ref StringBuilder sbWhere, ref List<SqlParameter> parameterList, string sign = "=")
        {
            if (values == null) return;
            if (string.IsNullOrWhiteSpace(values.ToString())) return;
            string whereModel = @" AND {0}{1}@{2} ";
            sbWhere.Append(string.Format(whereModel, whereName, sign, paraName));

            Type type = values.GetType();

            if (type == typeof(string) && !string.IsNullOrWhiteSpace(values.ToString()))
            {
                parameterList.Add(new SqlParameter("@" + paraName, sqlType) { Value = values.ToString() });
            }

            if (type == typeof(int)
                || type == typeof(int?)
                || type == typeof(Int16)
                || type == typeof(Int32)
                || type == typeof(Int64))
            {
                Int64 n = 0;
                if (!Int64.TryParse(values.ToString(), out n)) return;

                parameterList.Add(new SqlParameter("@" + paraName, sqlType) { Value = n });
            }

            if (type == typeof(DateTime) || type == typeof(DateTime?))
            {
                if (DateTime.Parse(values.ToString()) == DateTime.MinValue) return;
                parameterList.Add(new SqlParameter("@" + paraName, sqlType) { Value = DateTime.Parse(values.ToString()) });
            }

            if (type.IsEnum)
            {
                parameterList.Add(new SqlParameter("@" + paraName, sqlType) { Value = (int)Enum.Parse(values.GetType(), values.ToString()) });
            }

            if (type == typeof(bool)
                || type == typeof(Boolean)
                || type == typeof(bool?)
                )
            {
                bool v = false;
                if (bool.TryParse(values.ToString(), out v))
                {
                    parameterList.Add(new SqlParameter("@" + paraName, sqlType) { Value = v ? 1 : 0 });
                }
            }
        }
    }
}
