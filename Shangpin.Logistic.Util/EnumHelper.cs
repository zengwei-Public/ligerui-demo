using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Shangpin.Logistic.Util
{
    public class EnumHelper
    {
        //ResponseCode =EnumHelper.GetEnumDescription<EnumPdaResponseCode>(EnumPdaResponseCode.Success);
        /// <summary>
        /// 获取枚举描述
        /// </summary>
        /// <typeparam name="TEnum">枚举具体类型</typeparam>
        /// <param name="value">要获取的枚举项</param>
        /// <returns>枚举描述</returns>
        public static string GetEnumDescription<TEnum>(object value)
        {
            Type enumType = typeof(TEnum);
            string enumItem = Enum.GetName(enumType, Convert.ToInt32(value));
            object[] objs = enumType.GetField(enumItem).GetCustomAttributes(typeof(DescriptionAttribute), false);
            return ((DescriptionAttribute)objs[0]).Description;
        }

        /// <summary>
        /// Retrieve the description on the enum, e.g.
        /// [Description("Bright Pink")]
        /// BrightPink = 2,
        /// Then when you pass in the enum, it will retrieve the description
        /// </summary>
        /// <param name="en">The Enumeration</param>
        /// <returns>A string representing the friendly name</returns>
        public static string GetDescription(Enum en)
        {
            Type type = en.GetType();
            MemberInfo[] memInfo = type.GetMember(en.ToString());
            if (memInfo != null && memInfo.Length > 0)
            {
                object[] attrs = memInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (attrs != null && attrs.Length > 0)
                {
                    return ((DescriptionAttribute)attrs[0]).Description;
                }
            }
            return en.ToString();
        }

        /// <summary>
        /// 获取枚举字典信息
        /// 处理乱序或者包含负数的Enum顺序问题
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static Dictionary<int, string> GetEnumValueAndDescriptionsEx<T>()
        {
            var rValue = new Dictionary<int, string>();
            Type type = typeof(T);
            FieldInfo[] fields = type.GetFields(BindingFlags.Static | BindingFlags.Public);
            string[] names = Enum.GetNames(typeof(T));
            int[] values = Enum.GetValues(typeof(T)) as int[];
            if (fields.Length == names.Length && fields.Length == values.Length)
            {
                string desc;
                for (int i = 0; i < names.Length; i++)
                {
                    desc = GetEnumValue(fields, names[i]);
                    if (!rValue.ContainsKey(values[i]))
                    {
                        rValue.Add(values[i], desc);
                    }
                }
            }
            return rValue;
        }

        /// <summary>
        /// 取得枚举项的描述
        /// </summary>
        /// <param name="type">枚举类型</param>
        /// <param name="enumValue">枚举数值</param>
        /// <returns></returns>
        public static string GetDescription(Type type, int enumValue)
        {
            string descriptions = string.Empty;
            var custAttr = type.GetCustomAttributes(typeof(FlagsAttribute), false);
            if (custAttr != null && custAttr.Length > 0)
            {
                Array enumValues = Enum.GetValues(type);
                String[] enumNames = Enum.GetNames(type);
                for (int i = 0; i < enumValues.Length; i++)
                {
                    if ((Convert.ToInt32(enumValues.GetValue(i)) & enumValue) == Convert.ToInt32(enumValues.GetValue(i)))
                    {
                        if (descriptions != string.Empty)
                            descriptions += ";";
                        descriptions += GetDescription(type, enumNames[i]);
                    }
                }
                return descriptions;
            }
            return GetDescription(type, Enum.GetName(type, enumValue));
        }

        /// <summary>
        /// 根据枚举字符取得Description特性的值
        /// </summary>
        /// <param name="type"></param>
        /// <param name="enumStr"></param>
        /// <returns></returns>
        public static string GetDescription(Type type, string enumStr)
        {
            if (!type.IsEnum)
            {
                throw new ArgumentException("传入的值必须是枚举类型。");
            }
            MemberInfo[] memInfos = type.GetMembers();
            MemberInfo memInfo = null;
            string temp = string.Empty;
            for (int i = 0; i < memInfos.Length; i++)
            {
                memInfo = memInfos[i];
                if (string.Compare(enumStr, memInfo.Name, true) == 0)
                {
                    object[] attrs = memInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    if (attrs != null && attrs.Length > 0)
                    {
                        temp = ((DescriptionAttribute)attrs[0]).Description;
                    }
                    return temp;
                }
            }
            return "";
            //throw new Exception("未知的枚举描述");
        }

        /// <summary>
        /// 根据Name取得描述值
        /// </summary>
        /// <param name="fields"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string GetEnumValue(FieldInfo[] fields, string name)
        {
            foreach (var item in fields)
            {
                if (item.Name.Equals(name))
                {
                    object[] custAttrs = item.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    if (custAttrs != null && custAttrs.Length > 0)
                    {
                        return ((DescriptionAttribute)custAttrs[0]).Description;
                    }
                }
            }
            return name;
        }
    }
}
