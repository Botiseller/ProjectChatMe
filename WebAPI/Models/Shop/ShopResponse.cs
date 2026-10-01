using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Business.Entities;
using Microsoft.Ajax.Utilities;

namespace WebAPI.Models.Shop
{
    public class ShopResponse
    {
        public int ShopId { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string Category { get; set; }
        public string Address { get; set; }
        public string Mail { get; set; }
        public string Phone { get; set; }

        public static ShopResponse convert(Business.Entities.Shop shop) {
            var s = new ShopResponse() { 
                ShopId = shop.Id,
                Name = shop.Nombre,
                Picture = shop.Image,
                Address = shop.Address,
                Mail =shop.Mail,
                Phone = shop.Phone,
                Category = shop.SubRubro?.Nombre
            };
            return s;
        }

    }
}