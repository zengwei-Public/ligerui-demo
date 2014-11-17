using System.Web.Mvc;

namespace Shangpin.Logistic.WebUI.Areas.Delivery
{
    public class DeliveryAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Delivery";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Delivery_default",
                "Delivery/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}