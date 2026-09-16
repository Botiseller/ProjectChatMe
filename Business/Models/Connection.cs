using Business.Contracts.Models;
using System;

namespace Business.Models
{
    public class Connection : IConnection
    {
        public string Usuario { get; set; }
        public DateTime LastConnection { get; set; }
    }
}