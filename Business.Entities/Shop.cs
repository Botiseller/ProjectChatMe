using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Entities
{
    public class Shop
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Image { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Location { get; set; }
        public string Mail { get; set; }
        //Rubro del negocio. Antes era un string suelto guardado en el JSON de Negocios.Negocio; ahora sale de la tabla
        //SubRubros (via Negocios.SubRubros) y trae su Rubro adentro, que es el que tiene el icono.
        public SubRubro SubRubro { get; set; }
        public Provider Provider { get; set; }
    }
}
