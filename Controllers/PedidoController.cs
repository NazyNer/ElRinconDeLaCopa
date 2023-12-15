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
using NuGet.Protocol.Core.Types;

namespace ElRinconDeLaCopa.Controllers
{
  [Authorize]
    public class PedidoController : Controller
    {
        private readonly ILogger<PedidoController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        public PedidoController(ApplicationDbContext context, ILogger<PedidoController> logger, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }
        public async Task<JsonResult>AgregarDetalle(int id){
          var resultado = new ValidacionError
          {
              nonError = false,
              MsjError = "No se selecciono ningun producto"
          };
          var Producto = _context.Productos?.Where(p=>p.ID == id).FirstOrDefault();
          if (Producto != null){
            resultado.nonError  = false;
            resultado.MsjError = "No hay mas stock";
            var user = await _userManager.GetUserAsync(User);
            var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
            var detalle = _context.DetallesDePedidos?.Where(d => d.ProductoID == id & d.PedidoID == Pedido.PedidoID).FirstOrDefault();
            var CantidadProducto = Producto.Cantidad - 1;
            if (CantidadProducto >= 0)
            {
              resultado.nonError  = true;
              resultado.MsjError = "Se cargo el producto correctamente en el carrito";
              if (detalle == null){
                detalle = new DetalleDelPedido{
                  PedidoID = Pedido.PedidoID,
                  ProductoID = id,
                  Cantidad = 1,
                  Precio = Producto.PrecioDeVenta,
                  Subtotal = Producto.PrecioDeVenta
                };
                _context.Add(detalle);
                _context.SaveChanges();
              }else{
                detalle.Cantidad += 1;
                detalle.Subtotal = detalle.Cantidad * detalle.Precio;
                _context.SaveChanges();
              }
            }
          }
          return Json(resultado);
        }

        [Authorize(Roles = "Administrador,Empleado")]
        public bool BuscarPedidoEnEsperaRespuesta(){
          var Pedido = _context.PedidosClientes?.Where(p => p.Estado == EstadoPedido.Completado).ToList();
          if (Pedido.Count == 0)
          {
            return false;
          }else{
            return true;
          }
        }


        public async Task<JsonResult>AbrirCarrito(){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "No hay productos en el carrito";
          var user = await _userManager.GetUserAsync(User);
          var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
          var DetallePedido = _context.DetallesDePedidos?.Where(c => c.PedidoID == Pedido.PedidoID).ToList();
          if(DetallePedido.Count != 0){
            resultado.nonError = true;
            resultado.MsjError = "";
            dynamic Productos = new ExpandoObject();
            dynamic Detalle = new ExpandoObject();
            if(DetallePedido != null){
              foreach (var item in DetallePedido)
              {
                var producto = _context.Productos?.Where(p => p.ID == item.ProductoID).FirstOrDefault();
                var detalleProducto = item;
                ((IDictionary<string, object>)Productos)[producto.Nombre] = producto;
                ((IDictionary<string, object>)Detalle)[producto.Nombre] = detalleProducto;
              }
            }
            var Carrito = new {resultado = resultado, detalleCompra = Detalle, productos = Productos};
            return Json(Carrito);
          }
          var ResultadoError = new {resultado = resultado};
          return Json(ResultadoError);
        }
        public async Task<JsonResult>ProductCart(){
          var user = await _userManager.GetUserAsync(User);
          var carritoCreado = _context.PedidosClientes?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
          if (carritoCreado == null){
              carritoCreado = new PedidoCliente{
                UsuarioID = user.Id,
                FechaActual = DateTime.Now,
                Estado = 0
              };
              _context.Add(carritoCreado);
              _context.SaveChanges();
            }
          var DetalleCarrito = _context.DetallesDePedidos?.Where(c => c.PedidoID == carritoCreado.PedidoID).Count();
          return Json(DetalleCarrito);
        }

        public async Task<JsonResult>SubtQuantity(int ProductoID){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "No existe el productos en el carrito";
          var user = await _userManager.GetUserAsync(User);
          var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetallesDePedidos?.Where(c => c.PedidoID == Pedido.PedidoID & c.ProductoID == ProductoID).FirstOrDefault();
          var producto = _context.Productos?.Where(p => p.ID == ProductoID).FirstOrDefault();
          DetalleCarrito.Cantidad -= 1;
          if (DetalleCarrito.Cantidad > 0)
          {
              DetalleCarrito.Subtotal = DetalleCarrito.Precio * DetalleCarrito.Cantidad;
              resultado.nonError = true;
              resultado.MsjError = "";
              _context.SaveChanges();
          }
          
          return Json(resultado);
        }
        public async Task<JsonResult>PlusQuantity(int ProductoID){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "No existe el productos en el carrito";
          var user = await _userManager.GetUserAsync(User);
          var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetallesDePedidos?.Where(c => c.PedidoID == Pedido.PedidoID & c.ProductoID == ProductoID).FirstOrDefault();
          var producto = _context.Productos?.Where(p => p.ID == ProductoID).FirstOrDefault();
          DetalleCarrito.Cantidad += 1;
          if (producto != null)
          {
            resultado.MsjError = "No hay stock del productos";
            var stock = producto.Cantidad - DetalleCarrito.Cantidad;
            if (stock >= 0)
            {
              DetalleCarrito.Subtotal = DetalleCarrito.Precio * DetalleCarrito.Cantidad;
              resultado.nonError = true;
              resultado.MsjError = "";
              _context.SaveChanges();
            }
          }

          return Json(resultado);
        }
        
        public async Task<JsonResult>RemoveDetail(int ProductoID){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "No existe el productos en el carrito";
          var user = await _userManager.GetUserAsync(User);
          var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetallesDePedidos?.Where(c => c.PedidoID == Pedido.PedidoID & c.ProductoID == ProductoID).FirstOrDefault();
          if (DetalleCarrito != null){
            resultado.nonError = true;
            resultado.MsjError = "Eliminado con exito";
            _context.DetallesDePedidos.Remove(DetalleCarrito);
            _context.SaveChanges();
          }
          return Json(resultado);
        }

        public async Task<JsonResult>CompletePurchase(string Calle, int Numero, string Depto, bool GuardarDatos, int NumeroCelular, int Caracteristica){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "Completar campos obligatorios";
          var user = await _userManager.GetUserAsync(User);
          var usuariDB = _context.Usuarios.Where(u => u.IdUsuario == user.Id).FirstOrDefault();
          var Pedido = _context.PedidosClientes?.Where(p => p.UsuarioID == user.Id & p.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetallesDePedidos?.Where(c => c.PedidoID == Pedido.PedidoID).ToList();
          if (!string.IsNullOrEmpty(Calle) && Numero > 0)
          {
            resultado.MsjError = "No se encontraron detalles del pedido";
            if(DetalleCarrito != null){
              using (var transaction = _context.Database.BeginTransaction())
              {
                try
                {
                  foreach (var item in DetalleCarrito)
                  {
                    var producto = _context.Productos.Where(p => p.ID == item.ProductoID).FirstOrDefault();
                    var stock = producto.Cantidad - item.Cantidad;
                    if (stock >= 0)
                      {
                          producto.Cantidad = stock; // Restar la cantidad del producto
                          _context.SaveChanges(); // Guardar los cambios en la base de datos
                      }
                      else
                      {
                          // Si no hay suficiente stock, lanzar una excepción y detener la función
                          throw new Exception("No hay suficiente stock para el producto.");
                      }
                      Pedido.Total += item.Subtotal;
                  }
                  if (GuardarDatos)
                  {
                    usuariDB.NumeroDeTelefono = Caracteristica.ToString() + NumeroCelular.ToString();
                    usuariDB.Calle = Calle;
                    usuariDB.Numero = Numero;
                    if (Depto == "-1" )
                    {
                      usuariDB.Depto = "Estoy en una casa";
                    }else{
                      usuariDB.Depto = "Estoy en el departamento "+Depto;
                    }
                  }
                  Pedido.Calle = Calle;
                  if (Depto == "-1" )
                  {
                    Pedido.Depto = "Estoy en una casa";
                  }else{
                    Pedido.Depto = "Estoy en el departamento "+Depto;
                  }
                  Pedido.FechaActual = DateTime.Now;
                  Pedido.Numero = Numero;
                  Pedido.Estado = EstadoPedido.Completado;
                  Pedido.NumeroCelular = Caracteristica.ToString() + NumeroCelular.ToString();
                  var usuario = _context.Usuarios.Where(u => u.IdUsuario == user.Id).FirstOrDefault();
                  var nombreRolCrearCliente = _context.Roles.Where(r => r.Name == "Cliente").SingleOrDefault();
                  usuario.Calle = Calle;
                  usuario.Depto = Depto;
                  usuario.Numero = Numero;
                  usuario.IdRol = nombreRolCrearCliente.Id;
                  _context.SaveChanges();
                  resultado.nonError = true;
                  resultado.MsjError = "Compra realizada con exito";
                  transaction.Commit();
                }
                catch (Exception error)
                {
                  transaction.Rollback(); // Deshacer la transacción en caso de error
                  resultado.MsjError = error.Message; // Actualizar el mensaje de error
                }
              }
            }
          }
          return Json(resultado);
        }
    }
}