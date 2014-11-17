using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Shangpin.Logistic.Util
{
    public class XmlHelper
    {
        public XmlHelper()
        {
        }

        /// <summary>
        /// 创建一个XmlDocument对象
        /// </summary>
        /// <param name="PathOrString">文件名称或XML字符串</param>
        public static XmlDocument xmlDoc(string PathOrString)
        {
            try
            {
                XmlDocument xDoc = new XmlDocument();
                if (System.IO.File.Exists(PathOrString))
                {
                    xDoc.Load(PathOrString);
                }
                else
                {
                    xDoc.LoadXml(PathOrString);
                }
                return xDoc;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 创建一个xml文档，只写入根节点
        /// </summary>
        /// <param name="fileFullName"></param>
        /// <param name="rootName"></param>
        public static void CreateXMLFile(string fileFullName, string rootName, params AttributeParameter[] attps)
        {
            XmlDocument xDoc = new XmlDocument();
            XmlNode xn;
            xn = xDoc.CreateXmlDeclaration("1.0", "UTF-8", null);
            xDoc.AppendChild(xn);
            XmlNode root = xDoc.CreateElement(rootName);
            XmlNode xa = xDoc.CreateNode(XmlNodeType.Attribute, attps[0].Name, null);
            xa.Value = attps[0].Value;
            root.Attributes.SetNamedItem(xa);

            xDoc.AppendChild(root);
            try
            {
                xDoc.Save(fileFullName);
            }
            catch
            {
                throw;
            }
        }

        #region 获取node
        /// <summary>
        /// 返回符合条件的nodelist
        /// </summary>
        /// <param name="fileFullName"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static XmlNodeList SearchXmlNodeList(string fileFullName, string condition)
        {
            XmlDocument xDoc = xmlDoc(fileFullName);
            return SearchXmlNodeList(xDoc, condition);
        }

        public static XmlNodeList SearchXmlNodeList(XmlDocument xDoc, string condition)
        {
            try
            {
                XmlNodeList xnList = xDoc.SelectNodes(condition);
                return xnList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static XmlNodeList SearchXmlNodeList(XmlNode xn, string condition)
        {
            try
            {
                XmlNodeList xnList = xn.SelectNodes(condition);
                return xnList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// 返回第一个匹配条件的node
        /// </summary>
        /// <param name="xmlDoc"></param>
        /// <param name="searchXmlPath"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static XmlNode SearchXmlNode(string fileFullName, string condition)
        {
            XmlNodeList xnList = SearchXmlNodeList(fileFullName, condition);

            if (xnList == null || xnList.Count <= 0) return null;

            return xnList[0];
        }

        public static XmlNode SearchXmlNode(XmlDocument xDoc, string condition)
        {
            XmlNodeList xnList = SearchXmlNodeList(xDoc, condition);

            if (xnList == null || xnList.Count <= 0) return null;

            return xnList[0];
        }

        public static XmlNode SearchXmlNode(XmlNode xn, string condition)
        {
            XmlNodeList xnList = SearchXmlNodeList(xn, condition);

            if (xnList == null || xnList.Count <= 0) return null;

            return xnList[0];
        }

        #endregion

        /// <summary>
        /// 获取一个xml大节点下指定节点的文本
        /// </summary>
        /// <param name="xn"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static string SearchNodeText(XmlNode xn, string condition)
        {
            XmlNode xn1 = SearchXmlNode(xn, condition);
            if (xn1 == null) return null;
            return xn1.InnerText;
        }

        /// <summary>
        /// 根据节点名称返回text
        /// </summary>
        /// <param name="xn"></param>
        /// <param name="nodeName"></param>
        /// <returns></returns>
        public static string GetXmlNodeTextByNodeName(XmlNode xn, string nodeName)
        {
            try
            {
                return xn.SelectSingleNode(nodeName).InnerText.Trim();
            }
            catch
            {
                return "";
            }
        }

        /// <summary>
        /// 在documentElement下增加节点
        /// </summary>
        /// <param name="fileFullName">xml路径</param>
        /// <param name="xmlPath">为空时表示在documentElement下直接增加</param>
        /// <param name="xps">增加节点的相关参数</param>
        /// <returns></returns>
        public static bool AddNewNode(string fileFullName, string xmlPath, params XmlParameter[] xps)
        {
            XmlDocument xDoc = xmlDoc(fileFullName);
            XmlNode xn = string.IsNullOrWhiteSpace(xmlPath) ? null : SearchXmlNode(fileFullName, xmlPath);

            AppendChild(xDoc, xn, xps);
            xDoc.Save(fileFullName);
            return true;
        }

        /// <summary>
        /// 更新节点内容或属性值
        /// </summary>
        /// <param name="fileFullName"></param>
        /// <param name="node"></param>
        /// <param name="update_xp"></param>
        /// <returns></returns>
        public static bool UpdateNode(string fileFullName, XmlNode node, XmlParameter update_xp)
        {
            node.InnerText = update_xp.InnerText;
            foreach (AttributeParameter ap in update_xp.Attributes)
            {
                foreach (XmlAttribute xa in node.Attributes)
                {
                    if (ap.Name == xa.Name)
                    {
                        xa.Value = ap.Value;
                        break;
                    }
                }
            }
            node.OwnerDocument.Save(fileFullName);
            return true;
        }

        public static bool DeleteNode(string fileFullName, XmlNode node)
        {
            try
            {
                if (node == null) return true;
                XmlDocument xDoc = node.OwnerDocument;
                xDoc.DocumentElement.RemoveChild(node);
                xDoc.Save(fileFullName);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static string GetAttributeValue(XmlNode xn, string attributeName)
        {
            if (xn == null || xn.Attributes[attributeName] == null) return null;

            return xn.Attributes[attributeName].Value;
        }

        #region AppendChild
        private static void AppendChild(XmlDocument xDoc, XmlNode parentNode, params XmlParameter[] paras)
        {
            foreach (XmlParameter xpar in paras)
            {
                XmlNode newNode = xDoc.CreateNode(XmlNodeType.Element, xpar.Name, null);
                string ns = xpar.NamespaceOfPrefix == null ? "" : newNode.GetNamespaceOfPrefix(xpar.NamespaceOfPrefix);
                foreach (AttributeParameter attp in xpar.Attributes)
                {
                    XmlNode attr = xDoc.CreateNode(XmlNodeType.Attribute, attp.Name, ns == "" ? null : ns);
                    attr.Value = attp.Value;
                    newNode.Attributes.SetNamedItem(attr);
                }
                newNode.InnerText = xpar.InnerText;
                if (parentNode == null)
                    xDoc.DocumentElement.AppendChild(newNode);
                else
                    parentNode.AppendChild(newNode);
            }
        }
        #endregion

        #region private AddEveryNode
        private static void AddEveryNode(XmlDocument xDoc, XmlNode parentNode, params XmlParameter[] paras)
        {
            XmlNodeList nlst = xDoc.DocumentElement.ChildNodes;
            foreach (XmlNode xns in nlst)
            {
                if (xns.Name == parentNode.Name)
                {
                    AppendChild(xDoc, xns, paras);
                }
                else
                {
                    foreach (XmlNode xn in xns)
                    {
                        if (xn.Name == parentNode.Name)
                        {
                            AppendChild(xDoc, xn, paras);
                        }
                    }
                }
            }
        }
        #endregion
    }

    public sealed class XmlParameter
    {
        private string name;
        private string innerText;
        private string namespaceOfPrefix;
        private AttributeParameter[] attributes;
        public XmlParameter()
        {
            //
            // TODO: Add constructor logic here
            //
            this.namespaceOfPrefix = null;
        }
        public XmlParameter(string name, params AttributeParameter[] attParas)
        {
            this.name = name;
            this.namespaceOfPrefix = null;
            this.attributes = attParas;
        }

        public XmlParameter(string name, string innerText, params AttributeParameter[] attParas)
        {
            this.name = name;
            this.innerText = innerText;
            this.namespaceOfPrefix = null;
            this.attributes = attParas;
        }
        public XmlParameter(string name, string innerText, string namespaceOfPrefix, params AttributeParameter[] attParas)
        {
            this.name = name;
            this.innerText = innerText;
            this.namespaceOfPrefix = namespaceOfPrefix;
            this.attributes = attParas;
        }
        public string Name
        {
            get { return this.name; }
            set { this.name = value; }
        }
        public string InnerText
        {
            get { return this.innerText; }
            set { this.innerText = value; }
        }
        public string NamespaceOfPrefix
        {
            get { return this.namespaceOfPrefix; }
            set { this.namespaceOfPrefix = value; }
        }
        public AttributeParameter[] Attributes
        {
            get { return this.attributes; }
            set { this.attributes = value; }
        }
    }

    public sealed class AttributeParameter
    {
        private string name;
        private string value;
        public AttributeParameter()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        public AttributeParameter(string attributeName, string attributeValue)
        {
            this.name = attributeName;
            this.value = attributeValue;
        }
        public string Name
        {
            get { return this.name; }
            set { this.name = value; }
        }
        public string Value
        {
            get { return this.value; }
            set { this.value = value; }
        }
    }
}
