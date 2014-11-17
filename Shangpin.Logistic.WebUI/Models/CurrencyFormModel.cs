using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Shangpin.Logistic.WebUI.Models
{
    public class CurrencyFormModel
    {
        /// <summary>
        /// 货币编号
        /// </summary>
        [Display(Name = "货币编号")]
        [Required(ErrorMessage = "{0}不能为空！", AllowEmptyStrings = false)]
        [StringLength(16, MinimumLength = 1, ErrorMessage = "{0}长度不能大于{1}！")]
        public string CurrencyNumber { get; set; }

        /// <summary>
        /// 货币名称
        /// </summary>
        [Display(Name = "货币名称")]
        [Required(ErrorMessage = "{0}不能为空！", AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "{0}长度不能大于{1}！")]
        public string CurrencyName { get; set; }

        /// <summary>
        /// 符号
        /// </summary>
        [Display(Name = "符号")]
        [Required(ErrorMessage = "{0}不能为空！", AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "{0}长度不能大于{1}！")]
        public string CurrencySymbo { get; set; }

        /// <summary>
        /// 货币代码
        /// </summary>
        [Display(Name = "货币代码")]
        [Required(ErrorMessage = "{0}不能为空！", AllowEmptyStrings = false)]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "{0}长度不能大于{1}！")]
        public string CurrencyCode { get; set; }

        /// <summary>
        /// 汇率
        /// </summary>
        [Display(Name = "汇率")]
        [Required(ErrorMessage = "{0}不能为空！", AllowEmptyStrings = false)]
        public decimal CurrencyExchangRate { get; set; }

        /// <summary>
        /// 所属国家
        /// </summary>
        [Display(Name = "所属国家")]
        public string CurrencyCountry { get; set; }

        /// <summary>
        /// 默认货币
        /// </summary>
        [Display(Name = "默认货币")]
        [Required(ErrorMessage = "请选择是否为{0}！")]
        public bool IsDefault { get; set; }

        /// <summary>
        /// 权重
        /// </summary>
        [Display(Name = "权重")]
        [Required(ErrorMessage = "{0}不能为空！")]
        public int Weight { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "备注")]
        public string Remark { get; set; }
    }
}