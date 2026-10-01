using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Entities.Security
{
    public class Session
    {

        public string TokenId { get; set; }
        public DateTime Init { get; set; }
        //public string From { get; set; }
        public User Usuario { get; set; }


    }
}
