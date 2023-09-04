using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ElRinconDeLaCopa.Models
{
    public class PedidoCliente
    {
        [Key]
        public int PedidoID { get; set; }
        public DateTime FechaActual { get; set; } // Fecha actual del carrito
        public string? UsuarioID { get; set; } // Agregar el Id del usuario propietario del carrito
        public EstadoPedido Estado { get; set; } // Estado actual del pedido
        public string? Calle { get; set; } // Calle donde se realizará el envio
        public int Numero { get; set; } // Numero de la calle
        public int Depto { get; set; } // Numero del departamento(Si es que vive en un departamento)
        public decimal Total { get; set; } // Total a pagar
        public virtual ICollection<DetalleDelPedido>? DetalleDelPedido { get; set; } // Relación uno a muchos con los detalles de compra
        
    }
}