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
      public decimal Total { get; set; }
    }
    public class IngresoStockFormateado
    {
      public string? EmailUsuario { get; set; }
      public DateTime FechaPedido { get; set; }
      public List<ProductoPedido>? Productos { get; set; }
      public EstadoCarrito Estado { get; set; }
      public decimal Total { get; set; }
    }
    public class ProductoPedido
    {
      public string? Nombre { get; set; }
      public int Cantidad { get; set; }
      public decimal Subtotal { get; set; }
    }

    public IActionResult Index()
    {
      return View();
    }

    static int CambioDePedido(int parametro, int queRetornar)
    {
      if (parametro == 0)
      {
        return queRetornar;
      }
      else
      {
        return parametro;
      }
    }
    
    public JsonResult CancelarPedido(EstadoPedido EstadoPedido, string Email, DateTime Fecha){
      var Error = new ValidacionError{
        nonError = true,
        MsjError = ""
      };
      var usuario = _context.Users.Where( u => u.Email == Email).FirstOrDefault();
      var pedido = _context.PedidosClientes.Where(p => p.FechaActual == Fecha && p.UsuarioID == usuario.Id).FirstOrDefault();
      if (pedido != null){
        var DetallesDelPedido = _context.DetallesDePedidos.Where(d => d.PedidoID == pedido.PedidoID).ToList();
        foreach (var Detalle in DetallesDelPedido){
          var producto = _context.Productos.Where(p=> p.ID == Detalle.ProductoID).FirstOrDefault();
          producto.Cantidad += Detalle.Cantidad;
          Detalle.Subtotal = 0;
          _context.SaveChanges();
        }
        pedido.Total = 0;
        _context.SaveChanges();
      }
      return Json(Error);
    }

    public JsonResult PedidoNumero( string Email, DateTime Fecha){
      var usuario = _context.Users.Where( u => u.Email == Email).FirstOrDefault();
      var pedido = _context.PedidosClientes.Where(p => p.FechaActual == Fecha && p.UsuarioID == usuario.Id).FirstOrDefault();
      if (pedido != null){
        if (pedido.NumeroCelular != null){
          return Json(pedido.NumeroCelular);
        }else{
          pedido.Estado = EstadoPedido.Cancelado;
          _context.SaveChanges();
          CancelarPedido(pedido.Estado,Email, Fecha);
          return Json("3562459692");
        }
      }
      return Json("3562459692");
    }

    public JsonResult CambiarDeEstadoElPedido(EstadoPedido EstadoId, string Email, DateTime Fecha)
    {
      var Error = new ValidacionError
      {
        nonError = false,
        MsjError = "No se pudo cambiar el estado del pedido"
      };
      if (EstadoId > 0 && Email != null && Fecha != null)
      {
        Error.MsjError = EstadoId + Email + Fecha;
        var usuario = _context.Users.Where( u => u.Email == Email).FirstOrDefault();
        var pedido = _context.PedidosClientes.Where(p => p.FechaActual == Fecha && p.UsuarioID == usuario.Id).FirstOrDefault();
        if (pedido != null)
        {
          pedido.Estado = EstadoId;
          _context.SaveChanges();
          Error.nonError = true;
          Error.MsjError =  EstadoId + "";
        }
      }
      return Json(Error);
    }



    public async Task<JsonResult> Stock(EstadoPedido EstadoPedidos = EstadoPedido.Incompleto, int Pedidos = 1)
    {
      var parametroPedido = Pedidos;
      dynamic resultado = new ExpandoObject();
      var pedidosFormateados = new List<PedidoFormateado>();
      var ingresosDeStock = new List<IngresoStockFormateado>();
      Pedidos = CambioDePedido(parametroPedido, 1);
      if (Pedidos == 1)
      {
        var pedidos = _context.PedidosClientes.OrderByDescending(p => p.FechaActual).ThenByDescending(p => p.Estado).ToList();
        if (EstadoPedidos != EstadoPedido.Incompleto)
        {
          pedidos = pedidos.Where(p => p.Estado == EstadoPedidos).ToList();
        }
        foreach (var pedido in pedidos)
        {
          if (pedido.Estado != EstadoPedido.Incompleto)
          {
            var usuario = await _userManager.FindByIdAsync(pedido.UsuarioID);
            var productosPedido = new List<ProductoPedido>();
            var detallesPedido = _context.DetallesDePedidos.Where(d => d.PedidoID == pedido.PedidoID).ToList();
            decimal TotalDefinitivo = 0;
            foreach (var detalle in detallesPedido)
            {
              if (pedido.Total == 0)
              {
                TotalDefinitivo += detalle.Subtotal;
              }
              else
              {
                TotalDefinitivo = pedido.Total;
              }
              var producto = _context.Productos.FirstOrDefault(p => p.ID == detalle.ProductoID);
              if (producto != null)
              {
                productosPedido.Add(new ProductoPedido
                {
                  Nombre = producto.Nombre,
                  Cantidad = detalle.Cantidad,
                  Subtotal = detalle.Subtotal
                });
              }
            }
            if (pedido.Total == 0)
            {
              pedido.Total = TotalDefinitivo;
              _context.SaveChanges();
            }
            pedidosFormateados.Add(new PedidoFormateado
            {
              EmailUsuario = usuario?.Email,
              FechaPedido = pedido.FechaActual,
              Productos = productosPedido,
              Estado = pedido.Estado,
              Total = TotalDefinitivo
            });
          }
        }
      }
      Pedidos = CambioDePedido(parametroPedido, 2);
      if (Pedidos == 2)
      {
        // Obtener ingresos de stock
        var ingresos = _context.CarritoCompra.OrderByDescending(p => p.FechaActual).Where(c => c.Estado == EstadoCarrito.Completado).ToList();
        foreach (var ingreso in ingresos)
        {
          var usuario = await _userManager.FindByIdAsync(ingreso.UsuarioID);
          var detallesCompra = new List<ProductoPedido>();
          var detalleCompra = _context.DetalleCompra.Where(d => d.CarritoID == ingreso.CarritoID).ToList();
          decimal TotalDefinitivo = 0;
          foreach (var detalle in detalleCompra)
          {
            var producto = _context.Productos.FirstOrDefault(p => p.ID == detalle.ProductoID);
            if (producto != null)
            {
              if (ingreso.Total == 0)
              {
                detalle.PrecioPorUnidad = producto.PrecioDeCompra / producto.CantidadXPack;
                detalle.Subtotal = detalle.PrecioPorUnidad * detalle.Cantidad;
                _context.SaveChanges();
                TotalDefinitivo += detalle.Subtotal;
              }
              else
              {
                if (detalle.Subtotal == 0)
                {
                  detalle.Subtotal = detalle.Cantidad * producto.PrecioDeCompra;
                }
                TotalDefinitivo = ingreso.Total;
              }

              detallesCompra.Add(new ProductoPedido
              {
                Nombre = producto.Nombre,
                Cantidad = detalle.Cantidad,
                Subtotal = detalle.Subtotal
              });
            }
          }

          if (ingreso.Total == 0)
          {
            ingreso.Total = TotalDefinitivo;
            _context.SaveChanges();
          }
          ingresosDeStock.Add(new IngresoStockFormateado
          {
            EmailUsuario = usuario.Email,
            FechaPedido = ingreso.FechaActual,
            Productos = detallesCompra,
            Estado = ingreso.Estado,
            Total = TotalDefinitivo
          });

        }
      }
      resultado.IngresosDeStock = ingresosDeStock;
      resultado.PedidosFormateados = pedidosFormateados;
      return Json(resultado);
    }

  }
}