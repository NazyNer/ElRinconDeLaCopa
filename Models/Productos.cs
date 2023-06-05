using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElRinconDeLaCopa.Models;
public class Producto 
{
    [Key]
    public int ID { get; set; }
    public int IDCategoria { get; set; }
    public string? Nombre { get; set; }
    public decimal Precio { get; set; }
    public int Cantidad { get; set; }
    public byte[]? Imagen { get; set; }
    public string? NombreImagen { get; set; }
    public string? TipoImagen { get; set; }
    
    [NotMapped]
    public string? ImagenString { get; set; }
    public virtual Categoria? Categoria { get; set; }
}