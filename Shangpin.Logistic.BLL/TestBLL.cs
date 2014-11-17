using Shangpin.Logistic.DAL;
using Shangpin.Logistic.IBLL;
using Shangpin.Logistic.Model;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.BLL
{
    public class TestBLL : ITestBLL
    {
        private TestDal _testDal;

        public List<TestModel> GetModel(TestSearchModel searchModel)
        {
            return _testDal.GetModel(searchModel);
        }


        public PagedList<TestModel> GetListModel(TestSearchModel searchModel)
        {
            return _testDal.GetListModel(searchModel);
        }
    }
}
