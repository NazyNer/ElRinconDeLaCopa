using System.ComponentModel.DataAnnotations;

namespace ElRinconDeLaCopa.Models;

public class Categoria
{
    [Key]
    public int ID { get; set; }
    public string? Nombre { get; set; }
    public bool Eliminado { get; set; }
    public virtual ICollection<Producto>? Productos { get; set; }
}