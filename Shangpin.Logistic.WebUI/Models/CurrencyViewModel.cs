using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Shangpin.Logistic.WebUI.Models
{
    public class CurrencyViewModel
    {
        [Display(Name = "货币编号")]
        public string CurrencyNumber { get; set; }

        [Display(Name = "货币名称")]
        public string CurrencyName {get;set;}

        [Display(Name = "货币符号")]
        public string CurrencySymbo { get; set; }

        [Display(Name = "货币代码")]
        public string CurrencyCode { get; set; }

        [Display(Name = "汇率")]
        public decimal CurrencyExchangRate { get; set; }

        [Display(Name = "默认货币")]
        public string IsDefault { get; set; }

        [Display(Name = "创建时间")]
        public DateTime CreateTime { get; set; }

    }
}