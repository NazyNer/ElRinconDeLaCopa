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

namespace ElRinconDeLaCopa.Controllers
{
    [Authorize]
    public class ProductoController : Controller
    {
        private readonly ILogger<ProductoController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public ProductoController(ApplicationDbContext context, ILogger<ProductoController> logger, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }
        // GET: Producto
        public async Task<IActionResult> Index()
        {
            var Categoria = _context.Categorias?.Where(c => c.Eliminado == false).ToList();
            ViewBag.CategoriaID = new SelectList(Categoria?.OrderBy(p => p.Nombre), "ID", "Nombre");
            
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var carritoCreado = _context.CarritoCompra?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
                if (carritoCreado == null){
                    carritoCreado = new CarritoCompra{
                        FechaActual = DateTime.Now,
                        UsuarioID = user.Id,
                        Estado = 0
                    };
                    _context.Add(carritoCreado);
                    _context.SaveChanges();
                }
            }
            return View();
        }
        public IActionResult Catalogo()
        {
            return View();
        }

        public JsonResult BuscarProductos(int Id = 0)
        {

            var productos = _context.Productos?.ToList();
            if (Id > 0)
            {
                productos = productos?.Where(c => c.ID == Id).OrderBy(c => c.Nombre).ToList();
            }
            foreach(var producto in productos)
            {
                if (producto.Imagen != null && producto.Imagen?.Length > 0)
                {
                    producto.ImagenString = System.Convert.ToBase64String(producto.Imagen);
                }
            }
            return Json(productos);
        }
        public JsonResult GuardarProducto(int CategoriaID, decimal Precio, int Cantidad, IFormFile imagen, string Nombre, int Productoid)
        {
            var resultado = new ValidacionError();
            //El nombre del producto no se encuentra
            if (string.IsNullOrEmpty(Nombre))
            {
                resultado.nonError = false;
                resultado.MsjError = "No se agrego un nombre a la producto";
                return Json(resultado);
            }
            //Si no es mayor a 0 o es 0 no se agrego ningun precio
            if (Precio <= 0)
            {
                resultado.nonError = false;
                resultado.MsjError = "No se agrego un precio a la producto";
                return Json(resultado);
            }
            //Si no es mayor a 0 no se agrego una categoria
            if (CategoriaID < 0)
            {
                resultado.nonError = false;
                resultado.MsjError = "No se agrego una categoria a la producto";
                return Json(resultado);
            }
            Nombre = Nombre.ToUpper();
            //Se esta creando el producto
            if (Productoid == 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNO CON EL MISMO NOMBRE
                var productoOriginal = _context.Productos?.Where(P => P.Nombre == Nombre).FirstOrDefault();
                if (productoOriginal == null)
                {
                    //BUSCAMOS LA CATEGORIA SELECCIONADA
                    var categoriaSeleccionada = _context.Categorias?.Where(c => c.ID == CategoriaID).FirstOrDefault();
                    if (categoriaSeleccionada != null)
                    {
                        //DECLAMOS EL OBJETO DANDO EL VALOR
                        var productoGuardar = new Producto
                        {
                            IDCategoria = CategoriaID,
                            NombreCategoria = categoriaSeleccionada.Nombre,
                            Nombre = Nombre,
                            Precio = Precio,
                            Cantidad = Cantidad,
                            Categoria = categoriaSeleccionada
                        };
                        //Si no es mayor a 0 y es null no se agrego una imagen
                        if (imagen != null || imagen?.Length > 0)
                        {
                            byte[]? imagenBinaria = null;
                            using (var fs1 = imagen?.OpenReadStream())
                            using (var ms1 = new MemoryStream())
                            {
                                fs1?.CopyTo(ms1);
                                imagenBinaria = ms1.ToArray();
                            }
                            productoGuardar.Imagen = imagenBinaria;
                            productoGuardar.TipoImagen = imagen?.ContentType;
                            productoGuardar.NombreImagen = imagen?.FileName;
                        }
                        _context.Add(productoGuardar);
                        _context.SaveChanges();
                        resultado.nonError = true;
                        resultado.MsjError = "";   
                    }
                }
            }
            else{
                var ProductoOriginal = _context.Productos?.Where(p => p.Nombre == Nombre && p.ID != Productoid).FirstOrDefault();
                if (ProductoOriginal != null)
                {
                    resultado.nonError = false;
                    resultado.MsjError = "El producto " + Nombre + " ya existe, por favor ingrese otro nombre";
                    return Json(resultado);
                }else{
                    //BUSCAMOS EL PRODUCTO A EDITAR
                    var productoEditar = _context.Productos?.Find(Productoid);
                    if(productoEditar != null){
                        if (productoEditar.Eliminado == true)
                        {
                            resultado.nonError = false;
                            resultado.MsjError = "El producto " + productoEditar.Nombre + " esta deshabilitado";
                            return Json(resultado);
                        }
                        //BUSCAMOS LA CATEGORIA SELECCIONADA
                        var categoriaSeleccionada = _context.Categorias?.Where(c => c.ID == CategoriaID).FirstOrDefault();
                        if (categoriaSeleccionada != null){
                                productoEditar.Nombre = Nombre;
                                productoEditar.IDCategoria = CategoriaID;
                                productoEditar.NombreCategoria = categoriaSeleccionada.Nombre;
                                productoEditar.Precio = Precio;
                                productoEditar.Cantidad = Cantidad;
                                productoEditar.Categoria = categoriaSeleccionada;
                                //Si no es mayor a 0 y es null no se agrego una imagen
                                if (imagen != null || imagen?.Length > 0)
                                {
                                    byte[]? imagenBinaria = null;
                                    using (var fs1 = imagen?.OpenReadStream())
                                    using (var ms1 = new MemoryStream())
                                    {
                                        fs1?.CopyTo(ms1);
                                        imagenBinaria = ms1.ToArray();
                                    }
                                    productoEditar.Imagen = imagenBinaria;
                                    productoEditar.TipoImagen = imagen?.ContentType;
                                    productoEditar.NombreImagen = imagen?.FileName;
                                }
                                _context.SaveChanges();
                                resultado.nonError = true;
                                resultado.MsjError = "";
                                return Json(resultado);
                        }
                        resultado.nonError = false;
                        resultado.MsjError = "No existe la categoria seleccionada";
                        return Json(resultado);
                    }
                    resultado.nonError = false;
                    resultado.MsjError = "No exite el producto a editar";
                    return Json(resultado);
                }
            }
            return Json(resultado);
        }


        public JsonResult EliminarProducto(int Id){
        var resultado = new ValidacionError();
        resultado.nonError = false;
        resultado.MsjError = "No se selecciono ningun producto";
        // bool resultado = false;
            //SI ES DISTINTO A 0 QUIERE DECIR QUE ESTA ELIMINANDO LA CATEGORIA
            if(Id != 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON EL MISMO ID
                var productoOriginal = _context.Productos.Find(Id);
                    //SI LA CATEGORIA NO ESTE ELIMINADA PROCEDEMOS A HACERLO
                    if(productoOriginal?.Eliminado == false)
                    {
                        productoOriginal.Eliminado = true;
                        _context.SaveChanges();
                        resultado.nonError = true;
                    }
                    else{
                        var categoriaRelacionada = _context.Categorias?.Find(productoOriginal?.IDCategoria);
                        if(categoriaRelacionada.Eliminado == false)
                        {
                            productoOriginal.Eliminado = false;
                            _context.SaveChanges();
                            resultado.nonError= true;
                        }else{
                            categoriaRelacionada.Eliminado = false;
                            productoOriginal.Eliminado = false;
                            _context.SaveChanges();
                            resultado.nonError= true;
                        }
                    }
            }
            return Json(resultado);
        }
        public JsonResult RemoveProducto(int ID){
            var resultado = new ValidacionError();
            resultado.nonError = false;
            resultado.MsjError = "No se selecciono ningun producto";
            if(ID > 0)
            {
                var productoOriginal = _context.Productos?.Find(ID);
                if(productoOriginal != null){
                    if (productoOriginal.Cantidad == 0)
                    {
                        _context.Remove(productoOriginal);
                        _context.SaveChanges();
                        resultado.nonError = true;
                        resultado.MsjError = "Producto " + productoOriginal.Nombre + " eliminado correctamente";
                        return Json(resultado);
                    }
                    resultado.MsjError = "El Producto " + productoOriginal.Nombre + " Tiene stock (Asegurese de que la cantidad del producto sea 0 y volver a intentar).";
                    return Json(resultado);
                }
                resultado.MsjError = "No se encuentra el producto seleccionado";
                return Json(resultado);
            }            
        public async Task<JsonResult> AgregarDetalle(int Id){

            var resultado = new ValidacionError();
            resultado.nonError = false;
            resultado.MsjError = "No se selecciono ningun producto";

            var productoSeleccionado = _context.Productos?.Find(Id);
            if(productoSeleccionado != null){
                resultado.nonError = true;
                resultado.MsjError = "";
                var user = await _userManager.GetUserAsync(User);
                var carrito = _context.CarritoCompra?.Where(c => c.UsuarioID == user.Id && c.Estado == 0).FirstOrDefault();
                var detalleCreado = _context.DetalleCompra?.Where(d => d.CarritoID == carrito.CarritoID && d.ProductoID == Id).FirstOrDefault();
                if(detalleCreado == null)
                {
                    var Detalle = new DetalleCompra
                    {
                        CarritoID = carrito.CarritoID,                   
                        ProductoID = Id,                
                        Cantidad = 1
                    };               
                    _context.Add(Detalle);
                    _context.SaveChanges();
                    resultado.nonError = true;
                    resultado.MsjError = "";
                }else{
                    detalleCreado.Cantidad += 1;
                    _context.SaveChanges();
                }
            }
            return Json(resultado);
        }
    }


}
