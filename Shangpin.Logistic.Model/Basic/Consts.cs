using Shangpin.Logistic.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Logistic.Model.Basic
{
    public static class Consts
    {
        /// <summary>
        /// Cookie过期默认时长(天)
        /// </summary>
        public static readonly int COOKIE_EXPIRES = int.Parse(ConfigurationHelper.GetAppSetting("CookieExpires"));
    }
}
