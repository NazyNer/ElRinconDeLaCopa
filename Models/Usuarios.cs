using System.ComponentModel.DataAnnotations;

namespace ElRinconDeLaCopa.Models;
public class Usuario 
{
    [Key]
    public int ID { get; set; }
    public string? IdUsuario { get; set; }
    public string? Nombre { get; set; }
    public byte[]? Imagen { get; set; }
    public string? NombreImagen { get; set; }
    public string? TipoImagen { get; set; }
    public bool Eliminado { get; set; }
    public string? IdRol { get; set; }
    public string? NumeroDeTelefono { get; set; }
    public string? Calle { get; set; }
    public int Numero { get; set; }
    public string? Depto { get; set; } 
}
