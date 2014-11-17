using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel;

namespace Shangpin.Logistic.WebUI.Common
{
    public class DefaultModelBinderEx : DefaultModelBinder
    {
        /// <summary>
        /// Fix for the default model binder's failure to decode enum types when binding to JSON.
        /// </summary>
        protected override object GetPropertyValue(
            ControllerContext controllerContext,
            ModelBindingContext bindingContext,
            PropertyDescriptor propertyDescriptor,
            IModelBinder propertyBinder)
        {
            var propertyType = propertyDescriptor.PropertyType;

            if (propertyType.IsEnum)
            {
                var providerValue = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

                if (providerValue != null)
                {
                    var value = providerValue.RawValue;

                    if (value != null)
                    {
                        var valueType = value.GetType();

                        if (valueType == typeof(string[]))
                        {
                            valueType = typeof(string);
                            value = ((string[])value)[0];
                        }

                        if (!valueType.IsEnum)
                        {
                            return Enum.Parse(propertyType, value.ToString());
                        }
                    }
                }
            }

            return base.GetPropertyValue(controllerContext, bindingContext, propertyDescriptor, propertyBinder);
        }
    }
}