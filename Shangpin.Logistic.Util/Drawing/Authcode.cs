using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Drawing.Text;

namespace Shangpin.Logistic.Util.Drawing
{
    /// <summary>
    /// 验证码生成类
    /// </summary>
    public class Authcode
    {

        private const double PI = 3.1415926535897932384626433832795;
        private const double PI2 = 6.283185307179586476925286766559;

        public string Code { get; private set; }
        public Bitmap Bitmap { get; private set; }

        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <param name="code">验证码</param>
        /// <param name="length">验证码长度</param>
        /// <returns>验证码</returns>
        public static Authcode Generate(string code=null,int length=4)
        {
            var vcode = new Authcode();
            if (string.IsNullOrWhiteSpace(code))
            {
                vcode.Code = RndNum(length);   //这里的数字4代表显示的是4位的验证字符串！ 
            }
            else
            {
                vcode.Code = code;
                length = code.Length;
            }

            // 在此处放置用户代码以初始化页面
        //    string VNum = RndNum(4);   //这里的数字4代表显示的是4位的验证字符串！   
         //   Session["VNum"] = VNum.ToLower();

            Bitmap objBitmap;
            Graphics objGraphics;

            // Prepare Font
            Random rd = new Random();
            String[] fontname = { "System", "Verdana", "Arial" };    //定义 5 种字体
            Font objFont = new Font(fontname[rd.Next(0, fontname.Length)], 14);
            Color[] fontcolor = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Red, Color.Brown, Color.DarkCyan, Color.Purple };  //定义 8 种颜色 
            SolidBrush brush = new SolidBrush(fontcolor[rd.Next(0, fontcolor.Length)]);

            objBitmap = new Bitmap(1, 1);
            objGraphics = Graphics.FromImage(objBitmap);

            SizeF sizeF = objGraphics.MeasureString(vcode.Code, objFont);
            objGraphics.Dispose();
            objBitmap.Dispose();

            // Create Bitmap
            int width = sizeF.Width > 50 ? (int)sizeF.Width : 50;
            int height = sizeF.Height > 25 ? (int)sizeF.Height : 25;
            objBitmap = new Bitmap(width, height);
            objGraphics = Graphics.FromImage(objBitmap);

            // Create Graphics
            objGraphics = Graphics.FromImage(objBitmap);
            objGraphics.Clear(Color.White);

            //画图片的背景噪音线
            for (int i = 0; i < 3; i++)
            {
                int x1 = rd.Next(objBitmap.Width);
                int x2 = rd.Next(objBitmap.Width);
                int y1 = rd.Next(objBitmap.Height);
                int y2 = rd.Next(objBitmap.Height);
                objGraphics.DrawLine(new Pen(brush), x1, y1, x2, y2);
            }
            objGraphics.TextRenderingHint = TextRenderingHint.AntiAlias;
            objGraphics.DrawString(vcode.Code, objFont, brush, 2, 2);

            // Display Bitmap
            // objBitmap.Save(Response.OutputStream, ImageFormat.Jpeg);
            vcode.Bitmap = objBitmap;
            return vcode;
        }

        /// <summary>
        /// 生成随机数
        /// </summary>
        /// <param name="VcodeNum">长度</param>
        /// <returns>随机数</returns>
        private static string RndNum(int VcodeNum)
        {
            string chars = "123456789ABCDEFGHJKLMNPQRSTWXYabdfghkmnopqrswxy";

            string VNum = "";
            int l = 0;
            Random rand = new Random();
            for (int i = 1; i < VcodeNum + 1; i++)
            {
                l = rand.Next(chars.Length);
                VNum += chars[l];
            }
            return VNum;
        }

        /// <summary>
        /// 正弦曲线Wave扭曲图片
        /// </summary>
        /// <param name="srcBmp">图片路径</param>
        /// <param name="bXDir">如果扭曲则选择为True</param>
        /// <param name="dMultValue">波形的幅度倍数，越大扭曲的程度越高，一般为3</param>
        /// <param name="dPhase">波形的起始相位，取值区间[0-2*PI2)</param>
        /// <returns></returns>
        private static System.Drawing.Bitmap TwistImage(Bitmap srcBmp, bool bXDir, double dMultValue, double dPhase)
        {
            System.Drawing.Bitmap destBmp = new Bitmap(srcBmp.Width, srcBmp.Height);

            // 将位图背景填充为白色
            System.Drawing.Graphics graph = System.Drawing.Graphics.FromImage(destBmp);
            graph.FillRectangle(new SolidBrush(System.Drawing.Color.White), 0, 0, destBmp.Width, destBmp.Height);
            graph.Dispose();

            double dBaseAxisLen = bXDir ? (double)destBmp.Height : (double)destBmp.Width;

            for (int i = 0; i < destBmp.Width; i++)
            {
                for (int j = 0; j < destBmp.Height; j++)
                {
                    double dx = 0;
                    dx = bXDir ? (PI2 * (double)j) / dBaseAxisLen : (PI2 * (double)i) / dBaseAxisLen;
                    dx += dPhase;
                    double dy = Math.Sin(dx);

                    // 取得当前点的颜色
                    int nOldX = 0, nOldY = 0;
                    nOldX = bXDir ? i + (int)(dy * dMultValue) : i;
                    nOldY = bXDir ? j : j + (int)(dy * dMultValue);

                    System.Drawing.Color color = srcBmp.GetPixel(i, j);
                    if (nOldX >= 0 && nOldX < destBmp.Width
                     && nOldY >= 0 && nOldY < destBmp.Height)
                    {
                        destBmp.SetPixel(nOldX, nOldY, color);
                    }
                }
            }

            return destBmp;
        }
    }
}
