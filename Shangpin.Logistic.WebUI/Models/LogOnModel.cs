using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI.Models
{
    public class LogOnModel
    {
        [Required]
        [Display(Name = "用户名")]
        [StringLength(30)]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        [StringLength(20)]
        public string Password { get; set; }

        [Required]
        [Display(Name = "验证码")]
        //[StringLength(5, MinimumLength=3)]
        [Remote("CheckVerificationCode", "Home")]
        public string VerificationCode { get; set; }

        [Display(Name = "记住我")]
        public bool RememberMe { get; set; }
    }
}