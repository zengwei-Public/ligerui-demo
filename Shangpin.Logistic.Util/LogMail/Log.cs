using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Common.Logging;

namespace Shangpin.Logistic.Util.LogMail
{
    public class Log
    {
        public static readonly ILog logger = GetFactoryLogger();
        public static readonly ILog loggeremail = GetFactoryEmail();

        private static ILog GetFactoryLogger()
        {
            return LogManager.GetLogger(FactoryLog);
        }
        private static ILog GetFactoryEmail()
        {
            return LogManager.GetLogger(FactoryEMail);
        }
        /// <summary>
        /// 工厂日志
        /// </summary>
        private static string FactoryLog
        {
            get
            {
                try
                {
                    return System.Configuration.ConfigurationManager.AppSettings["FactoryLog"];
                }
                catch (Exception ex)
                {
                    return "default_Log";
                }
            }
        }
        /// <summary>
        /// 工厂邮件
        /// </summary>
        private static string FactoryEMail
        {
            get
            {
                try
                {
                    return System.Configuration.ConfigurationManager.AppSettings["FactoryEMail"];
                }
                catch (Exception ex)
                {
                    return "default_EMail";
                }
            }
        }
    }
}
