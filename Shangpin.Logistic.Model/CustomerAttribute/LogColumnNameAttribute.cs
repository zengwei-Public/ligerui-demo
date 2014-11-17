using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shangpin.Logistic.Model.CustomerAttribute
{
    /// <summary>
    /// 日志列名自定义属性
    /// </summary>
    [Serializable]
    public class LogNameAttribute: Attribute
    {
        /// <summary>
        /// 列名
        /// </summary>
        public String Name
        {
            get;
            private set;
        }

        public LogNameAttribute(String Name)
        {
            this.Name = Name;
        }
    }

}
