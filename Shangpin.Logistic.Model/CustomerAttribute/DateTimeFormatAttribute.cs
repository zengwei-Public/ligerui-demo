using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.Model.CustomerAttribute
{
    /// <summary>
    /// 日期时间格式化特性
    /// </summary>
    public class DateTimeFormatAttribute : Attribute
    {
        /// <summary>
        /// 格式字符串
        /// </summary>
        public String DataFormatString { get; private set; }

        public DateTimeFormatAttribute(String format)
        {
            if (String.IsNullOrWhiteSpace(format)) throw new ArgumentNullException("format is null");
            DataFormatString = format;
        }
    }
}
