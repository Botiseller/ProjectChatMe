using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Entities
{
    public class Provider
    {
        public int Id { get; set; }
        public IList<Application> Applications { get; set; }
        public DateTime DateAdd { get; set; }
        public string TaxId { get; set; }
        public string Code { get; set; }
        public Billing Billing { get; set; }
    }

    public class Billing
    {
        public string CreditCard { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string SecurityCode { get; set; }
    }

    public class Application {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Available { get; set; }
        public string WebhookUrl { get; set; }
        
    }

}
