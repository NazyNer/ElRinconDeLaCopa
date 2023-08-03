using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ElRinconDeLaCopa.Models
{
    public class CarritoCompra
    {
        [Key]
        public int ID { get; set; }
        
        public string? UsuarioId { get; set; } // Agregar el Id del usuario propietario del carrito

        [ForeignKey("UsuarioId")]
        public virtual IdentityUser?  Usuario { get; set; } // Referencia al usuario propietario del carrito

        public DateTime FechaActual { get; set; } // Fecha actual del carrito

        public string? DireccionEntrega { get; set; } // Dirección de entrega para el carrito
        
        public virtual ICollection<DetalleCompra>? Detalles { get; set; } // Relación uno a muchos con los detalles de compra
    }
}