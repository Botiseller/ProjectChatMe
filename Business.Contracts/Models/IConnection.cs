using System;

namespace Business.Contracts.Models
{
    public interface IConnection
    {
        string Usuario { get; set; }
        DateTime LastConnection { get; set; }
    }
}
