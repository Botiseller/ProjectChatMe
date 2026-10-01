namespace Business.Entities
{
    //Rubro y subrubro del negocio (tablas Rubros / SubRubros). El negocio apunta al subrubro y el subrubro trae su
    //rubro adentro, que es de donde sale el icono: el subrubro aporta el nombre y el rubro la imagen del grupo.
    public class SubRubro
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public Rubro Rubro { get; set; }
    }

    public class Rubro
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        //Clase CSS de Font Awesome, como en el resto de la plataforma (por ejemplo "fal fa-store"): se aplica tal cual
        //sobre un <i> en la pantalla, no es una URL de imagen.
        public string Icono { get; set; }
    }
}
