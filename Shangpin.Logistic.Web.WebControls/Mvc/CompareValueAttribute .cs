using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.ComponentModel.DataAnnotations;
using System.Web.UI.WebControls;
using System.Reflection;

namespace Shangpin.Logistic.Web.WebControls.Mvc
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = true)]
    public class CompareValueAttribute : ValidationAttribute
    {
        public string OriginalProperty { get; private set; }
        public ValidationCompareOperator Operator { get; private set; }
        public ValidationDataType Type { get; private set; }

        private const string _defaultErrorMessage = "'{0}' 与 '{1}' 进行 {2} 比较失败";

        public CompareValueAttribute(string originalProperty, ValidationCompareOperator op, ValidationDataType type)
            : base(_defaultErrorMessage)
        {
            OriginalProperty = originalProperty;
            Operator = op;
            Type = type;
        }

        public override string FormatErrorMessage(string name)
        {
            return String.Format(CultureInfo.CurrentUICulture, ErrorMessageString,
                name, OriginalProperty, Operator.ToString());
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            PropertyInfo originalProperty = validationContext.ObjectType.GetProperty(this.OriginalProperty);
            object originalValue = originalProperty.GetValue(validationContext.ObjectInstance, null);

            if (!compare(value, originalValue))
                return new ValidationResult(this.FormatErrorMessage(validationContext.DisplayName));

            return null;
        }

        private bool compare(object sourceProperty, object originalProperty)
        {
            int num = 0;
            switch (this.Type)
            {
                case ValidationDataType.String:
                    num = string.Compare((string)sourceProperty, (string)originalProperty, false, CultureInfo.CurrentCulture);
                    break;

                case ValidationDataType.Integer:
                    num = ((int)sourceProperty).CompareTo(originalProperty);
                    break;

                case ValidationDataType.Double:
                    num = ((double)sourceProperty).CompareTo(originalProperty);
                    break;

                case ValidationDataType.Date:
                    num = ((DateTime)sourceProperty).CompareTo(originalProperty);
                    break;

                case ValidationDataType.Currency:
                    num = ((decimal)sourceProperty).CompareTo(originalProperty);
                    break;
            }
            switch (this.Operator)
            {
                case ValidationCompareOperator.Equal:
                    return (num == 0);

                case ValidationCompareOperator.NotEqual:
                    return (num != 0);

                case ValidationCompareOperator.GreaterThan:
                    return (num > 0);

                case ValidationCompareOperator.GreaterThanEqual:
                    return (num >= 0);

                case ValidationCompareOperator.LessThan:
                    return (num < 0);

                case ValidationCompareOperator.LessThanEqual:
                    return (num <= 0);
            }
            return true;

        }
    }
}
