using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElRinconDeLaCopa.Models
{
    public class DetalleDelPedido
    {
        [Key]
        public int DetalleDelPedidoID { get; set; }

        public int PedidoID { get; set; } // Agregar el Id del carrito al que pertenece este detalle

        public int ProductoID { get; set; } // Agregar el Id del producto comprado

        public int Cantidad { get; set; } // Cantidad del producto comprado

        public decimal Precio { get; set; } // Precio del producto comprado

        public decimal Subtotal { get; set; } // Subtotal del producto comprado

        public virtual PedidoCliente? PedidoCliente { get; set; } // Referencia al carrito al que pertenece este detalle
    }
}