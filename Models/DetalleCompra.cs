using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElRinconDeLaCopa.Models
{
    public class DetalleCompra
    {
        [Key]
        public int DetalleCompraID { get; set; }

        public int CarritoID { get; set; } // Agregar el Id del carrito al que pertenece este detalle

        public int ProductoID { get; set; } // Agregar el Id del producto comprado

        public int Cantidad { get; set; } // Cantidad del producto comprado
        public virtual CarritoCompra? CarritoCompra { get; set; } // Referencia al carrito al que pertenece este detalle
         
    }
}