using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ElRinconDeLaCopa.Data;
using ElRinconDeLaCopa.Models;
using System.Dynamic;

namespace ElRinconDeLaCopa.Controllers
{
  [Authorize]
  public class StockController : Controller
  {
    private readonly ILogger<StockController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public StockController(ApplicationDbContext context, ILogger<StockController> logger, UserManager<IdentityUser> userManager)
    {
      _context = context;
      _logger = logger;
      _userManager = userManager;
    }

    public class PedidoFormateado
    {
      public string? EmailUsuario { get; set; }
      public DateTime FechaPedido { get; set; }
      public List<ProductoPedido>? Productos { get; set; }
      public EstadoPedido Estado { get; set; }
    }
    public class IngresoStockFormateado{
      public string? EmailUsuario { get; set; }
      public DateTime FechaPedido { get; set; }
      public List<ProductoPedido>? Productos { get; set; }
      public EstadoCarrito Estado { get; set; }
    }
    public class ProductoPedido
    {
      public string? Nombre { get; set; }
      public int Cantidad { get; set; }
    }

    public IActionResult Index()
    {
      return View();
    }

    public async Task<JsonResult> Stock()
    {
      dynamic resultado = new ExpandoObject();
      var pedidosFormateados = new List<PedidoFormateado>();
      var ingresosDeStock = new List<IngresoStockFormateado>();
      var pedidos = _context.PedidosClientes.ToList();

      foreach (var pedido in pedidos)
      {
        var usuario = await _userManager.FindByIdAsync(pedido.UsuarioID);
        var productosPedido = new List<ProductoPedido>();
        var detallesPedido = _context.DetallesDePedidos.Where(d => d.PedidoID == pedido.PedidoID).ToList();

        foreach (var detalle in detallesPedido)
        {
          var producto = _context.Productos.FirstOrDefault(p => p.ID == detalle.ProductoID);
          if (producto != null)
          {
            productosPedido.Add(new ProductoPedido
            {
              Nombre = producto.Nombre,
              Cantidad = detalle.Cantidad
            });
          }
        }

        pedidosFormateados.Add(new PedidoFormateado
        {
          EmailUsuario = usuario?.Email,
          FechaPedido = pedido.FechaActual,
          Productos = productosPedido,
          Estado = pedido.Estado
        });
      }

      // Obtener ingresos de stock
      var ingresos = _context.CarritoCompra.Where(c => c.Estado == EstadoCarrito.Completado).ToList();
      foreach (var ingreso in ingresos)
      {
        var usuario = await _userManager.FindByIdAsync(ingreso.UsuarioID);
        var detallesCompra = new List<ProductoPedido>();
        var detalleCompra = _context.DetalleCompra.Where(d => d.CarritoID == ingreso.CarritoID).ToList();
        foreach (var detalle in detalleCompra)
        {
          var producto = _context.Productos.FirstOrDefault(p => p.ID == detalle.ProductoID);
          if (producto != null)
          {
            detallesCompra.Add(new ProductoPedido
            {
              Nombre = producto.Nombre,
              Cantidad = detalle.Cantidad
            });
          }
        }

        ingresosDeStock.Add(new IngresoStockFormateado
        {
          EmailUsuario = usuario.Email,
          FechaPedido = ingreso.FechaActual,
          Productos = detallesCompra,
          Estado = ingreso.Estado
        });
      }
      resultado.IngresosDeStock = ingresosDeStock;
      resultado.PedidosFormateados = pedidosFormateados;
      return Json(resultado);
    }

  }
}