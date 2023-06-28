using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ElRinconDeLaCopa.Data;
using ElRinconDeLaCopa.Models;

namespace ElRinconDeLaCopa.Controllers
{
    public class ProductoController : Controller
    {
        private readonly ILogger<CategoriaController> _logger;
        private readonly ApplicationDbContext _context;

        public ProductoController(ApplicationDbContext context, ILogger<CategoriaController> logger)
        {
            _context = context;
            _logger = logger;
        }
        // GET: Producto
        public IActionResult Index()
        {
            var Categoria = _context.Categorias?.Where(c => c.Eliminado == false).ToList();
            ViewBag.CategoriaID = new SelectList(Categoria?.OrderBy(p => p.Nombre), "ID", "Nombre");
            return View();
        }
        public IActionResult Catalogo()
        {
            return View();
        }

        public JsonResult BuscarProductos(int Id = 0){

            var productos = _context.Productos?.ToList();
            if(Id > 0 ){
                productos = productos?.Where(c => c.ID == Id).OrderBy(c => c.Nombre).ToList();
            }
            foreach (var producto in productos)
            {
                if (producto.Imagen != null)
                {
                    producto.ImagenString = System.Convert.ToBase64String(producto.Imagen);
                }
            }
            return Json(productos);
        }
    }
}
