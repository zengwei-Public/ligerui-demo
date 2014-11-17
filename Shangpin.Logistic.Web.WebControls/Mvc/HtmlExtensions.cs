using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Linq.Expressions;
using System.Web;
using System.Reflection;
using System.ComponentModel;
using System.Globalization;

namespace Shangpin.Logistic.Web.WebControls.Mvc
{
    public static class HtmlExtensions
    {
        #region TextBoxFor Format

        public static MvcHtmlString TextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string format)
        {
            return htmlHelper.TextBoxFor(expression, format, (IDictionary<string, object>)null);
        }

        public static MvcHtmlString TextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string format, object htmlAttributes)
        {
            return htmlHelper.TextBoxFor(expression, format, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        public static MvcHtmlString TextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string format, IDictionary<string, object> htmlAttributes)
        {
            ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            return TextBoxHelper(htmlHelper, InputType.Text, metadata, ExpressionHelper.GetExpressionText(expression),
                metadata.Model, format, false /* useViewData */, false /* isChecked */, true /* setId */, true /* isExplicitValue */, htmlAttributes);
        }

        #endregion

        #region CheckBoxList
        public static MvcHtmlString CheckBoxListFor<TModel, TProperty>(this HtmlHelper<TModel> html,
            Expression<Func<TModel, TProperty>> expression,
            IEnumerable<SelectListItem> selectList,
            Func<dynamic, object> format,
            object htmlAttributes)
        {
            return CheckBoxListFor(html, expression, selectList, format, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        public static MvcHtmlString CheckBoxListFor<TModel, TProperty>(this HtmlHelper<TModel> html,
            Expression<Func<TModel, TProperty>> expression,
            IEnumerable<SelectListItem> selectList,
            Func<dynamic, object> format = null,
            IDictionary<string, object> htmlAttributes = null)
        {
            return CheckBoxList(html, GetName(expression), selectList, format, htmlAttributes);
        }

        public static MvcHtmlString CheckBoxList(this HtmlHelper html,
          string name,
          IEnumerable<SelectListItem> selectList,
          Func<dynamic, object> format,
          object htmlAttributes)
        {
            return CheckBoxList(html, name, selectList, format, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        public static MvcHtmlString CheckBoxList(this HtmlHelper html,
           string name,
           IEnumerable<SelectListItem> selectList,
           Func<dynamic, object> format = null,
           IDictionary<string, object> htmlAttributes = null)
        {
            return InputListInternal(html, name, selectList, true, format, htmlAttributes);
        }
        #endregion

        #region RadioButtonList

        public static MvcHtmlString RadioButtonList(this HtmlHelper html,
         string name,
         IEnumerable<SelectListItem> selectList,
         Func<dynamic, object> format,
         object htmlAttributes)
        {
            return RadioButtonList(html, name, selectList, format, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        public static MvcHtmlString RadioButtonList(this HtmlHelper html,
         string name,
         IEnumerable<SelectListItem> selectList = null,
         Func<dynamic, object> format = null,
         IDictionary<string, object> htmlAttributes = null)
        {
            return InputListInternal(html, name, selectList, false, format, htmlAttributes);
        }

        public static MvcHtmlString RadioButtonListFor<TModel, TProperty>(this HtmlHelper<TModel> html,
          Expression<Func<TModel, TProperty>> expression,
          IEnumerable<SelectListItem> selectList,
          Func<dynamic, object> format,
          object htmlAttributes)
        {
            return RadioButtonList(html, GetName(expression), selectList, format, htmlAttributes);
        }

        public static MvcHtmlString RadioButtonListFor<TModel, TProperty>(this HtmlHelper<TModel> html,
            Expression<Func<TModel, TProperty>> expression,
            IEnumerable<SelectListItem> selectList,
            Func<dynamic, object> format = null,
            IDictionary<string, object> htmlAttributes = null)
        {
            return RadioButtonList(html, GetName(expression), selectList, format, htmlAttributes);
        }

        #endregion

        #region Private Function

        private static MvcHtmlString InputListInternal(
            this HtmlHelper html,
            string name,
            IEnumerable<SelectListItem> selectList,
            bool allowMultiple,
            Func<dynamic, object> format,
            IDictionary<string, object> htmlAttributes
           )
        {

            // If we got a null selectList, try to use ViewData to get the list of items.
            if (selectList == null)
            {
                selectList = GetSelectData(html, name);
            }

            string fullHtmlFieldName = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (string.IsNullOrEmpty(fullHtmlFieldName))
            {
                throw new ArgumentException("filed can't be null or empty !", "name");
            }
            if (format == null)
                format = i => "<label>" + i.Button + "<span>" + i.Text + "</span></label>\n";
            StringBuilder strBuilder = new StringBuilder();
            foreach (var item in selectList)
            {
                //Clear first
                TagBuilder tagBuilder = new TagBuilder("input");
                tagBuilder.InnerHtml = string.Empty;
                if (allowMultiple)
                {
                    tagBuilder.MergeAttribute("type", "checkbox", true);
                }
                else
                {
                    tagBuilder.MergeAttribute("type", "radio", true);
                }
                tagBuilder.MergeAttribute("value", item.Value, true);
                if (item.Selected)
                {
                    tagBuilder.MergeAttribute("checked", "checked", true);
                }
                tagBuilder.MergeAttributes<string, object>(htmlAttributes);
                tagBuilder.MergeAttribute("name", fullHtmlFieldName, true);
                var btnHtmlString = new MvcHtmlString(tagBuilder.ToString());
                var inputItem = new { Button = btnHtmlString, Text = item.Text };
                var s = format(inputItem).ToString();
                strBuilder.Append(s);
            }
            return new MvcHtmlString(strBuilder.ToString());
        }

        private static string GetName(LambdaExpression expression)
        {
            if (expression == null)
            {
                throw new ArgumentNullException("expression");
            }
            return ExpressionHelper.GetExpressionText(expression);
        }

        private static IEnumerable<SelectListItem> GetSelectData(this HtmlHelper htmlHelper, string name)
        {
            object o = null;
            if (htmlHelper.ViewData != null)
            {
                o = htmlHelper.ViewData.Eval(name);
            }
            if (o == null)
            {
                throw new InvalidOperationException(
                    String.Format(
                        CultureInfo.CurrentCulture,
                        "There is no ViewData item of type '{1}' that has the key '{0}'.",
                        name,
                        "IEnumerable<SelectListItem>"));
            }
            IEnumerable<SelectListItem> selectList = o as IEnumerable<SelectListItem>;
            if (selectList == null)
            {
                throw new InvalidOperationException(
                    String.Format(
                        CultureInfo.CurrentCulture,
                        "There is no ViewData item of type '{1}' that has the key '{0}'.",
                        name,
                        o.GetType().FullName,
                        "IEnumerable<SelectListItem>"));
            }
            return selectList;
        }

        private static MvcHtmlString TextBoxHelper(HtmlHelper htmlHelper, InputType inputType, ModelMetadata metadata, string name, object value, string format, bool useViewData, bool isChecked, bool setId, bool isExplicitValue, IDictionary<string, object> htmlAttributes)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name can't null", "name");
            }

            TagBuilder tagBuilder = new TagBuilder("input");
            tagBuilder.MergeAttributes(htmlAttributes);
            tagBuilder.MergeAttribute("type", HtmlHelper.GetInputTypeString(inputType));
            tagBuilder.MergeAttribute("name", fullName, true);

            string valueParameter = string.Empty;
            if (string.IsNullOrWhiteSpace(format))
            {
                valueParameter = Convert.ToString(value, CultureInfo.CurrentCulture);
            }
            else
            {
                valueParameter = string.Format(format, value);
            }

            string attemptedValue = null;

            ModelState modelState;
            if (htmlHelper.ViewData.ModelState.TryGetValue(fullName, out modelState))
            {
                if (modelState.Value != null)
                {
                    attemptedValue = (string)modelState.Value.ConvertTo(typeof(string), null /* culture */);
                }
                // If there are any errors for a named field, we add the css attribute.
                if (modelState.Errors.Count > 0)
                {
                    tagBuilder.AddCssClass(HtmlHelper.ValidationInputCssClassName);
                }
            }
            string val = attemptedValue ?? valueParameter;
            tagBuilder.MergeAttribute("value", val, isExplicitValue);

            if (setId)
            {
                tagBuilder.GenerateId(fullName);
            }

            tagBuilder.MergeAttributes(htmlHelper.GetUnobtrusiveValidationAttributes(name, metadata));

            return new MvcHtmlString(tagBuilder.ToString(TagRenderMode.SelfClosing));
        }

        #endregion
    }
}