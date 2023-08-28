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
    public class CarritoController : Controller
    {
        private readonly ILogger<CarritoController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public CarritoController(ApplicationDbContext context, ILogger<CarritoController> logger, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }
        public async Task<JsonResult> AbrirCarrito(){
          var resultado = new ValidacionError();
          resultado.nonError = true;
          resultado.MsjError = "";
          var user = await _userManager.GetUserAsync(User);
          var carritoCreado = _context.CarritoCompra?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetalleCompra?.Where(c => c.CarritoID == carritoCreado.CarritoID).ToList();
          dynamic Productos = new ExpandoObject();
          dynamic Detalle = new ExpandoObject();
          if(DetalleCarrito != null){
            foreach (var item in DetalleCarrito)
            {
              var producto = _context.Productos?.Where(p => p.ID == item.ProductoID).FirstOrDefault();
              var detalleProducto = DetalleCarrito.Where(p => p.ProductoID == producto?.ID).FirstOrDefault();
              ((IDictionary<string, object>)Productos)[producto.Nombre] = producto;
              ((IDictionary<string, object>)Detalle)[producto.Nombre] = detalleProducto;
            }
          }
          var Carrito = new {resultado = resultado, detalleCompra = Detalle, productos = Productos};
          return Json(Carrito);
        }
        public async Task<JsonResult> SubtQuantity(int IdProducto){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "Ocurrio un error con el producto seleccionado";
          var user = await _userManager.GetUserAsync(User);
          var carritoCreado = _context.CarritoCompra?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetalleCompra?.Where(d => d.CarritoID == carritoCreado.CarritoID && d.ProductoID == IdProducto).FirstOrDefault();
          if(DetalleCarrito != null){
            resultado.nonError = true;
            resultado.MsjError = "";
            DetalleCarrito.Cantidad -= 1;
            _context.SaveChanges();
          }
          return Json(resultado);
        }
        public async Task<JsonResult> RemoveDetail(int IdProducto){
          var resultado = new ValidacionError();
          resultado.nonError = false;
          resultado.MsjError = "Ocurrio un error con el producto seleccionado";
          var user = await _userManager.GetUserAsync(User);
          var carritoCreado = _context.CarritoCompra?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
          var DetalleCarrito = _context.DetalleCompra?.Where(d => d.CarritoID == carritoCreado.CarritoID && d.ProductoID == IdProducto).FirstOrDefault();
          if(DetalleCarrito != null){
            resultado.nonError = true;
            resultado.MsjError = "Eliminado con exito";
            _context.DetalleCompra?.Remove(DetalleCarrito);
            _context.SaveChanges();
          }
          return Json(resultado);
        }
    }
}