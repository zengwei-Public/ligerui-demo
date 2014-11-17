using Microsoft.ApplicationBlocks.Data;
using Shangpin.Framework.Common;
using Shangpin.Framework.Common.Dapper;
using Shangpin.Logistic.Model.Basic;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Ado.Net
{
    public abstract class DalBase
    {
        protected static string ConstrOfComBeziErp;//ERP读写串
        protected static string ConstrOfComBeziErpReadOnly;//ERP只读串

        private static readonly Dictionary<string, string> ConnMapper = new Dictionary<string, string>();
        private static readonly ConcurrentDictionary<string, SqlStatement> SqlTemplates = DapperInitializer.SqlStatements;

        protected DalBase()
        {
            if (string.IsNullOrEmpty(ConstrOfComBeziErp))
                ConstrOfComBeziErp = GetConstring(EnumHelper.GetEnumDescription<DbNameEnum>(DbNameEnum.ComBeziErpExec));
            if (string.IsNullOrEmpty(ConstrOfComBeziErpReadOnly))
                ConstrOfComBeziErpReadOnly = GetConstring(EnumHelper.GetEnumDescription<DbNameEnum>(DbNameEnum.ComBeziErpReadOnly));
        }

        private static void InitContringList()
        {
            string path = AppDomain.CurrentDomain.BaseDirectory;
            if (!path.EndsWith(@"\"))
                path = path + @"\";
            var file = string.Format("{0}_dbconnection.properties", path);
            if (!File.Exists(file))
                throw new ArgumentException("数据库配置文件丢失");
            var line = File.ReadAllLines(file);
            foreach (var s in line)
            {
                if (string.IsNullOrEmpty(s))
                    continue;
                if (string.IsNullOrEmpty(s.Trim()))
                    continue;
                int index = s.IndexOf("=", StringComparison.Ordinal);
                if (index <= 0)
                    throw new ArgumentException("数据库配置文件格式或内容错误");
                ConnMapper.Add(s.Substring(0, index), s.Substring(index + 1));
            }
        }
        private static string GetConstring(string dbName)
        {
            if (ConnMapper.Count < 1)
            {
                InitContringList();
            }
            if (ConnMapper.ContainsKey(dbName))
                return ConnMapper[dbName];
            throw new ArgumentException("不存在该数据库配置：" + dbName);
        }

        /// <summary>
        /// 返回对象列表第一组
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected T ExecListFirst<T>(string sql, bool isReadOnly, List<SqlParameter> parameters = null) where T : new()
        {
            List<T> list = ExecList<T>(sql, isReadOnly, parameters);
            if (list == null || list.Count < 1)
                return default(T);
            return list.First();
        }

        /// <summary>
        /// 返回对象列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected List<T> ExecList<T>(string sql, bool isReadOnly, List<SqlParameter> parameters = null) where T : new()
        {
            DataTable dt = ExecFirstDataTable(sql, isReadOnly, parameters);
            if (dt.Rows.Count <= 0)
                return new List<T>();

            return ConvertDT2DtoList<T>.ConvertToList(dt);
        }

        /// <summary>
        /// 返回DataTable
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected DataTable ExecFirstDataTable(string sql, bool isReadOnly, List<SqlParameter> parameters = null)
        {
            DataSet ds = ExecDataSet(sql, isReadOnly, parameters);
            return ds.Tables[0];
        }

        /// <summary>
        /// 返回DataSet
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected DataSet ExecDataSet(string sql, bool isReadOnly, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(sql))
                throw new ArgumentException("查询的sql不能为空");
            DataSet ds = SqlHelper.ExecuteDataset(isReadOnly ? ConstrOfComBeziErpReadOnly : ConstrOfComBeziErp, CommandType.Text, sql, parameters == null ? null : parameters.ToArray());
            return ds;
        }

        /// <summary>
        /// 查询只读上 返回统计数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected object ExecScalar(string sql, bool isReadOnly, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(sql))
                throw new ArgumentException("查询的sql不能为空");
            return SqlHelper.ExecuteScalar(isReadOnly ? ConstrOfComBeziErpReadOnly : ConstrOfComBeziErp, CommandType.Text, sql, parameters == null ? null : parameters.ToArray());
        }

        /// <summary>
        /// 主库执行sql，返回影响行数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        protected int ExecNonQuery(string sql, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(sql))
                throw new ArgumentException("查询的sql不能为空");
            object n = SqlHelper.ExecuteNonQuery(ConstrOfComBeziErp, CommandType.Text, sql, parameters == null ? null : parameters.ToArray());
            return (int)n;
        }
        #region 模板执行方法
        /// <summary>
        /// 返回DataSet
        /// </summary>
        /// <param name="templateId">模板编号</param>
        /// <param name="isReadOnly">是否在只读库查询</param>
        /// <param name="parameters">查询参数</param>
        /// <returns></returns>
        protected List<T> ExecTemplateList<T>(string templateId, bool isReadOnly, List<SqlParameter> parameters = null) where T : new()
        {
            if (string.IsNullOrWhiteSpace(SqlTemplates[templateId].StatementText))
                throw new ArgumentException("模板不能为空");
            var dt = ExecDataSet(SqlTemplates[templateId].StatementText, isReadOnly, parameters).Tables[0];
            return ConvertDT2DtoList<T>.ConvertToList(dt);
        }
        /// <summary>
        /// 返回DataSet
        /// </summary>
        /// <param name="templateId">模板编号</param>
        /// <param name="isReadOnly">是否在只读库查询</param>
        /// <param name="parameters">查询参数</param>
        /// <returns></returns>
        protected DataSet ExecTemplateDataSet(string templateId, bool isReadOnly, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(SqlTemplates[templateId].StatementText))
                throw new ArgumentException("模板不能为空");
            return ExecDataSet(SqlTemplates[templateId].StatementText, isReadOnly, parameters);
        }

        /// <summary>
        /// 查询只读上 返回统计数
        /// </summary>
        /// <param name="templateId">模板编号</param>
        /// <param name="isReadOnly">是否在只读库查询</param>
        /// <param name="parameters">执行参数</param>
        /// <returns></returns>
        protected object ExecTemplateScalar(string templateId, bool isReadOnly, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(SqlTemplates[templateId].StatementText))
                throw new ArgumentException("模板不能为空");
            return ExecScalar(SqlTemplates[templateId].StatementText, isReadOnly, parameters);
        }

        /// <summary>
        /// 主库执行sql，返回影响行数
        /// </summary>
        /// <param name="templateId">模板编号</param>
        /// <param name="parameters">执行参数</param>
        /// <returns>返回结果</returns>
        protected int ExecTemplateNonQuery(string templateId, List<SqlParameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(SqlTemplates[templateId].StatementText))
                throw new ArgumentException("模板不能为空");
            return ExecNonQuery(SqlTemplates[templateId].StatementText, parameters);
        }
        #endregion
        /// <summary>
        /// 分页查询
        /// </summary>
        /// <typeparam name="T">输出对象类型</typeparam>
        /// <param name="searchModel">查询模板：select {0} from table</param>
        /// <param name="countColumn">统计列：</param>
        /// <param name="searchColumn">查询列：table.column1,table.column2...</param>
        /// <param name="orderBy">查询结果排序:table.column1 desc,table.column2 ASC</param>
        /// <param name="page">分页对象：取RowStart、RowEnd</param>
        /// <param name="isReadOnly">true 访问只读，false 访问主库</param>
        /// <param name="parameterList">参数列表</param>
        /// <returns></returns>
        protected PagedList<T> ExecPageSplit<T>(string searchModel, string countColumn, string searchColumn, string where, string orderBy, PageInfo page,bool isReadOnly, List<SqlParameter> parameterList = null) where T : new()
        {
            string sqlCount = string.Empty;
            if (countColumn.Contains(","))
            {
                string countModel = "WITH t AS({0})select count(1) from t";
                string t = string.Format(searchModel, countColumn, where);
                sqlCount = string.Format(countModel, t);
            }
            else
                sqlCount = string.Format(searchModel, string.Format(" count({0}) ", countColumn), where);

            string sqlPage = string.Format(searchModel, searchColumn, where);

            return ExecPageSplit<T>(sqlCount, sqlPage, orderBy, page, isReadOnly, parameterList);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">输出对象类型</typeparam>
        /// <param name="sqlCount">统计查询sql</param>
        /// <param name="sqlPage">分页查询SQL</param>
        /// <param name="orderBy">排序</param>
        /// <param name="page">分页对象</param>
        /// <param name="isReadOnly">分页对象：取RowStart、RowEnd</param>
        /// <param name="parameterList">true 访问只读，false 访问主库</param>
        /// <returns></returns>
        protected PagedList<T> ExecPageSplit<T>(string sqlCount, string sqlPage, string orderBy, PageInfo page,
            bool isReadOnly, List<SqlParameter> parameterList = null) where T : new()
        {
            int count = (int)ExecScalar(sqlCount, isReadOnly, parameterList == null ? null : parameterList);
            if (count <= 0) {
                IList<T> listNull = new List<T>();
                return PagedList.Create<T>(listNull, page.CurrentPageIndex, page.PageSize);
            }

            string sqlPageModel = @"
WITH    t AS ( {0}
             ),
        t1
          AS ( SELECT   ROW_NUMBER() OVER ( ORDER BY {1} ) rowid ,
                        *
               FROM     t
             )
    SELECT  *
    FROM    t1
    WHERE   rowid BETWEEN @rowStart AND @rowEnd
";
            sqlPageModel = string.Format(sqlPageModel, sqlPage, orderBy);
            parameterList.Add(new SqlParameter("@rowStart", SqlDbType.Int) { Value = page.RowStart });
            parameterList.Add(new SqlParameter("@rowEnd", SqlDbType.Int) { Value = page.RowEnd });
            IList<T> list = ExecList<T>(sqlPageModel, isReadOnly, parameterList);
            if (list == null)
            {
                IList<T> listNull = new List<T>();
                return PagedList.Create<T>(listNull, page.CurrentPageIndex, page.PageSize);
            }
            PageInfo p = new PageInfo()
            {
                CurrentPageIndex = page.CurrentPageIndex,
                PageSize = page.PageSize,
                ItemCount = (int)count,

            };
            return PagedList.Create(list, p.CurrentPageIndex, p.PageSize, p.ItemCount);
        }
    }
}
