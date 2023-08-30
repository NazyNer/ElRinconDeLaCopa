namespace ElRinconDeLaCopa.Models;
public class ValidacionError
{
  public bool nonError { get; set; }
  public string? MsjError { get; set; }
}
public enum EstadoCarrito
{
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