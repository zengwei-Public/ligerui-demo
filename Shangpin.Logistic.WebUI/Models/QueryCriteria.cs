using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shangpin.Logistic.WebUI.Models
{
    public class QueryCriteria
    {
        private int _pageNumber;
        /// <summary>
        /// 页号
        /// </summary>
        public int PageNumber
        {
            get
            {
                if (this._pageNumber <= 0)
                    return 1;
                else
                    return _pageNumber;
            }
            set
            {
                if (value <= 0)
                    _pageNumber = 1;
                else
                    _pageNumber = value;
            }
        }

        private int _pageSize;
        /// <summary>
        /// 每页的多少条数据
        /// </summary>
        public int PageSize
        {
            get
            {
                return this._pageSize;
            }
            set
            {
                this._pageSize = (value == 0 ? 20 : value);
            }
        }

        public string SortName { get; set; }

        public string View { get; set; }

        public string Where { get; set; }

        private string _sortOrder;
        /// <summary>
        /// 排序规则
        /// </summary>
        public string SortOrder
        {
            get
            {
                if (this._sortOrder == "desc")
                    return this._sortOrder;
                else
                    return "asc";
            }

            set
            {
                this._sortOrder = value;
            }
        }
    }
}