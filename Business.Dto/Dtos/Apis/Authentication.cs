using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Dto.Dtos.Apis
{
    public class Authentication
    {
        public int shopId { get; set; }
        public string code { get; set; }
        public string  tokenId { get; set; }
        public DateTime expire { get; set; }





    }
}
