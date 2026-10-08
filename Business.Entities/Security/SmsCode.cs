using System;

namespace Business.Entities.Security
{
    //Codigo de un solo uso que se manda por SMS para validar que el telefono es de quien dice serlo.
    //La fila la lee SecurityBusinessService, que es quien decide si sirve o no: aca solo viajan los datos.
    public class SmsCode
    {
        public int SmsCodeId { get; set; }
        public string Telefono { get; set; }
        public string Codigo { get; set; }
        public DateTime FechaVence { get; set; }
        public DateTime? FechaUso { get; set; }
        public int Intentos { get; set; }
    }
}
