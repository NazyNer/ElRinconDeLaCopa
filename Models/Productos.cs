using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElRinconDeLaCopa.Models;
public class Producto 
{
    [Key]
    public int ID { get; set; }
    public int IDCategoria { get; set; }
    public string? NombreCategoria { get; set; }
    public string? Nombre { get; set; }
    public decimal PrecioDeCompra { get; set; }
    public decimal PrecioDeVenta { get; set; }
    public int CantidadXPack { get; set; }
    public int Cantidad { get; set; }
    public byte[]? Imagen { get; set; }
    public string? NombreImagen { get; set; }
    public string? TipoImagen { get; set; }
    public bool Eliminado { get; set; }
    
    [NotMapped]
    public string? ImagenString { get; set; }
    public virtual Categoria? Categoria { get; set; }
}
