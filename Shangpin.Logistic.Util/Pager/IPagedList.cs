using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace Shangpin.Logistic.Util.Pager
{
    public interface IPagedList : IList
    {
        int CurrentPageIndex { get; set; }
        int PageSize { get; set; }
        int TotalItemCount { get; set; }

        int TotalPageCount { get; }
        int StartRecordIndex { get; }
        int EndRecordIndex { get; }
    }
}
