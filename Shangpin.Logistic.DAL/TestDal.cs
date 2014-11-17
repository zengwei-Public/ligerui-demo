using Shangpin.Ado.Net;
using Shangpin.Logistic.Model;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.DAL
{
    public class TestDal:DalBase
    {
        public List<TestModel> GetModel(TestSearchModel searchModel)
        {
            string sql = @"
SELECT  RoleNo ,
        RoleName ,
        RoleDescription ,
        Status
FROM    dbo.WmsRole (NOLOCK)
WHERE   1 = 1 {0}
";
            List<SqlParameter> parameterList = new List<SqlParameter>();
            StringBuilder sbWhere = new StringBuilder();
            SqlStringHelper.CreateSqlWhereAndPara(searchModel.RoleNo, SqlDbType.VarChar, "RoleNo", "RoleNo", ref sbWhere, ref parameterList);
            SqlStringHelper.CreateSqlWhereAndPara(searchModel.RoleName, SqlDbType.VarChar, "RoleName", "RoleName", ref sbWhere, ref parameterList);
            sql = string.Format(sql, sbWhere);
            return ExecList<TestModel>(sql, false, parameterList);
        }

        public PagedList<TestModel> GetListModel(TestSearchModel searchModel)
        {
            string sqlCount = @"
SELECT  count(1)
FROM    dbo.WmsRole (NOLOCK)
WHERE   1 = 1 {0}
";

            string sqlPage = @"
SELECT  RoleNo ,
        RoleName ,
        RoleDescription ,
        Status
FROM    dbo.WmsRole (NOLOCK)
WHERE   1 = 1 {0}
";
            List<SqlParameter> parameterList = new List<SqlParameter>();
            StringBuilder sbWhere = new StringBuilder();
            SqlStringHelper.CreateSqlWhereAndPara(searchModel.RoleNo, SqlDbType.VarChar, "RoleNo", "RoleNo", ref sbWhere, ref parameterList);
            SqlStringHelper.CreateSqlWhereAndPara(searchModel.RoleName, SqlDbType.VarChar, "RoleName", "RoleName", ref sbWhere, ref parameterList);
            sqlPage = string.Format(sqlPage, sbWhere);
            sqlCount = string.Format(sqlCount, sbWhere);
            return ExecPageSplit<TestModel>(sqlCount, sqlPage, "RoleName", searchModel, false, parameterList);
        }
    }
}
