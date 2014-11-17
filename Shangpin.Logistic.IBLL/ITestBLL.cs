using Shangpin.Logistic.Model;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.IBLL
{
    public interface ITestBLL
    {
        List<TestModel> GetModel(TestSearchModel searchModel);

        PagedList<TestModel> GetListModel(TestSearchModel searchModel);
    }
}
