using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.Util.Pager
{
    public class PageInfo
    {
        /// <summary>
        /// 每页条数
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// 当前页
        /// </summary>
        public int CurrentPageIndex { get; set; }

        private int _pageCount;
        /// <summary>
        /// 页总数
        /// </summary>
        public Int32 PageCount
        {
            get
            {
                if (_pageCount == 0)
                {
                    _pageCount = ItemCount / PageSize;
                    if (ItemCount % PageSize > 0)
                        _pageCount += 1;
                }
                return _pageCount;
            }
            set
            {
                _pageCount = value;
            }
        }

        /// <summary>
        /// 排序字符串
        /// </summary>
        public string SortString { get; set; }

        /// <summary>
        /// 数据总行数
        /// </summary>
        public int ItemCount { get; set; }

        /// <summary>
        /// 关键字列
        /// </summary>
        public string KeyColumn
        {
            get
            {
                if (string.IsNullOrEmpty(_keycolumn))
                {
                    return _defaultColumnNum;
                }
                return _keycolumn;
            }
            set
            {
                _keycolumn = value.Trim();            
            }
        }

        private string _keycolumn;

        /// <summary>
        /// 默认排序列数字信息
        /// </summary>
        private string _defaultColumnNum = "1";

        /// <summary>
        /// 逻辑层使用此方法设置实际条数，并计算实际的当前页码。
        /// </summary>
        /// <param name="itemCount">记录条数</param>
        public void SetItemCount(int itemCount)
        {
            if (itemCount == 0)
            {
                ItemCount = 0;
                PageCount = 0;
                CurrentPageIndex = 0;
                return;
            }

            ItemCount = itemCount;
            PageCount = itemCount / PageSize;
            if (itemCount % PageSize > 0)
            {
                PageCount++;	//向上取整
            }

            //超出实际页数，则取最后一页。
            CurrentPageIndex = CurrentPageIndex < 1 ? PageCount : Math.Min(PageCount, CurrentPageIndex);
        }

        private int _rowStart;
        /// <summary>
        /// 当前页开始编号
        /// </summary>
        public Int32 RowStart
        {
            get
            {
                return _rowStart == 0 ? (CurrentPageIndex - 1) * PageSize + 1 : _rowStart;
            }
            set
            {
                _rowStart = value;
            }
        }

        private int _rowEnd;
        /// <summary>
        /// 当前页结束编号
        /// </summary>
        public Int32 RowEnd
        {
            get
            {
                return _rowEnd == 0 ? CurrentPageIndex * PageSize : _rowEnd;
            }
            set
            {
                _rowEnd = value;
            }
        }
    }
}
