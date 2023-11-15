namespace ElRinconDeLaCopa.Models;
public class ValidacionError {
  public bool nonError { get; set; }
  public string? MsjError { get; set; }
}

public class Catalogo {
  public int CategoriaId { get; set; }
  public string Categoria { get; set; }
  public List<ProductoEnCatalogo> Productos { get; set; }
  public bool Rol { get; set; }
}

public class ProductoEnCatalogo {
  public int Productoid { get; set; }
  public string Nombre { get; set; }
  public string Imagen { get; set; }
  public decimal Precio { get; set; }
}

public enum EstadoCarrito{
            enCurso,
            Completado
        }
public enum EstadoPedido
{
  Incompleto,
  Completado,
  EnEspera,
  Entregado,
  Cancelado,
}