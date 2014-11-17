using Shangpin.Logistic.Model.Basic;
using Shangpin.Logistic.Util.Pager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.Model
{
    public class TestModel
    {
        public String RoleNo { get; set; }

        public String RoleName { get; set; }

        public String RoleDescription { get; set; }

        public int Status { get; set; }
    }

    public class TestSearchModel:PageInfo
    {
        public String RoleNo { get; set; }

        public String RoleName { get; set; }
    }
}
