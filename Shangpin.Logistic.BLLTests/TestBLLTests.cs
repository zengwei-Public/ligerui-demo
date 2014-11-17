using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shangpin.Logistic.BLL;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shangpin.Logistic.IBLL;
using Shangpin.Logistic.Util;
using Shangpin.Logistic.Model;
namespace Shangpin.Logistic.BLL.Tests
{
    [TestClass()]
    public class TestBLLTests
    {
        [TestMethod()]
        public void GetModelTest()
        {
            try
            {
                ITestBLL bll = ServiceLocator.GetService<ITestBLL>();
                TestSearchModel searchModel = new TestSearchModel();
                var test=bll.GetModel(searchModel);
                foreach(var t in test)
                {

                }
                //Assert.Fail();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
