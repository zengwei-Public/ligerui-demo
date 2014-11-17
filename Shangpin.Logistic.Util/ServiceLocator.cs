using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Spring.Context;
using Common.Logging;
using System.Collections;
using Spring.Context.Support;

namespace Shangpin.Logistic.Util
{
    public class ServiceLocator
    {
        ///<summary>
        /// Spring's Application Context.
        ///</summary>
        public static readonly IApplicationContext Context;

        protected static readonly ILog Logger = LogManager.GetLogger(typeof(ServiceLocator));

        private static readonly Hashtable Table = new Hashtable();

        static ServiceLocator()
        {
            try
            {
                Context = ContextRegistry.GetContext();
            }
            catch (Exception e)
            {
                Logger.Fatal(m => m("初始化spring context失败!", e));
                throw;
            }
        }

        /// <summary>
        /// 获取一个Service的实例。如果获取未在<see cref="ServiceLocator"/>
        /// 注册的Service，则<see cref="ServiceLocator"/>会返回Spring中配置的实例。
        /// Spring中配置实例的名称应该遵循lowerCamalCase原则。比如，用户
        /// 请求“INeedService”接口的实例，Spring的配置文件中应该有一个对应的id或
        /// 者name为“needService”的定义。
        /// </summary>
        public static T GetService<T>() where T : class
        {
            try
            {
                var service = Table[typeof(T)] as T;
                if (service == null)
                {
                    string serviceName = typeof(T).Name;
                    if (serviceName.StartsWith("I"))
                    {
                        serviceName = serviceName[1].ToString().ToLower() + serviceName.Substring(2, serviceName.Length - 2);
                    }

                    else
                    {
                        throw new InvalidOperationException(
                            "A service must have a interface, and naming convension must follow IUpperCamelCase.");
                    }
                    service = Context.GetObject(serviceName) as T;
                }
                return service;
            }
            catch (Exception e)
            {
                Logger.Fatal(m => m("Init spring context failed!!", e));
                throw;
            }
        }

        /// <summary>
        /// 获取一个Service的实例。如果获取未在<see cref="ServiceLocator"/>
        /// 注册的Service，则<see cref="ServiceLocator"/>会返回Spring中配置的实例。
        /// Spring中配置实例的名称应该遵循lowerCamalCase原则。比如，用户
        /// 请求“INeedService”接口的实例，Spring的配置文件中应该有一个对应的id或
        /// 者name为“needService”的定义。
        /// </summary>
        public static T GetDao<T>() where T : class
        {
            var service = Table[typeof(T)] as T;
            if (service == null)
            {
                string serviceName = typeof(T).Name;
                if (serviceName.StartsWith("I"))
                {
                    serviceName = serviceName[1].ToString().ToLower() + serviceName.Substring(2, serviceName.Length - 2);
                }

                else
                {
                    throw new InvalidOperationException(
                        "A service must have a interface, and naming convension must follow IUpperCamelCase.");
                }
                service = Context.GetObject(serviceName) as T;
            }
            return service;
        }

        /// <summary>
        /// 获取指定类型的一个类的实例，该类会返回Spring中配置id或name为
        /// <param name="serviceName"></param>的实例。
        /// </summary>
        public static T GetDao<T>(string serviceName) where T : class
        {
            return Context.GetObject(serviceName) as T;
        }

        /// <summary>
        /// 获取指定类型的一个类的实例，该类会返回Spring中配置id或name为
        /// <param name="serviceName"></param>的实例。
        /// </summary>
        public static T GetService<T>(string serviceName) where T : class
        {
            return Context.GetObject(serviceName) as T;
        }

        /// <summary>
        /// 判断是否包含某实例。
        /// </summary>
        public static bool IsContained(string objectName, Type objType)
        {
            var name = objectName;
            if (string.IsNullOrEmpty(name))
            {
                name = objType.Name;
                name = name[0].ToString().ToLower() + name.Substring(1, name.Length - 1);
            }
            return Context.ContainsObject(name);
        }

        /// <summary>
        /// 获取指定类型的一个类的实例，该类会返回Spring中配置的实例。Spring中
        /// 配置实例的名称应该遵循lowerCamalCase原则。
        /// </summary>
        public static T GetObject<T>() where T : class
        {
            string typeName = typeof(T).Name;
            typeName = typeName[0].ToString().ToLower() + typeName.Substring(1, typeName.Length - 1);
            return Context.GetObject(typeName) as T;
        }

        /// <summary>
        /// 获取指定类型的一个类的实例，该类会返回Spring中配置id或name为
        /// <param name="objectName"></param>的实例。
        /// </summary>
        public static T GetObject<T>(string objectName) where T : class
        {
            return Context.GetObject(objectName) as T;
        }

        /// <summary>
        /// 初始化，引发静态成员自动初始化
        /// </summary>
        public static void Init()
        {
        }
    }
}
