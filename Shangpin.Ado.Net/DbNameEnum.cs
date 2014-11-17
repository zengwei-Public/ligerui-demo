using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Ado.Net
{
    public enum DbNameEnum
    {
        /// <summary>
        /// erp写库
        /// </summary>
        [Description("ComBeziErp")]
        ComBeziErpExec = 0,
        /// <summary>
        /// ERP只读库
        /// </summary>
        [Description("ComBeziErpReadOnly")]
        ComBeziErpReadOnly = 1,
    }
}
