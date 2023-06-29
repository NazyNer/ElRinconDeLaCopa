using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ElRinconDeLaCopa.Data;
using ElRinconDeLaCopa.Models;

namespace ElRinconDeLaCopa.Controllers
{
    public class CategoriaController : Controller
    {
        private readonly ILogger<CategoriaController> _logger;
        private readonly ApplicationDbContext _context;
        public CategoriaController(ApplicationDbContext context, ILogger<CategoriaController> logger)
        {
            _context = context;
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        public JsonResult BuscarCategorias(int Id = 0)
        {
            var categorias = _context.Categorias?.ToList();
            if(Id > 0 ){
                categorias = categorias?.Where(c => c.ID == Id).OrderBy(c => c.Nombre).ToList();
            }
            return Json(categorias);
        }
        public JsonResult GuardarCategoria(int id, string nombre)
        {
            var resultado = new ValidacionError();
            resultado.nonError = false;
            resultado.MsjError = "No se agrego una nombre a la categoria";
            if(!string.IsNullOrEmpty(nombre)){
                nombre = nombre.ToUpper();
                //SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA
                if(id == 0)
                {
                    //BUSCAMOS EN LA TABLA SI EXISTE UNO CON EL MISMO NOMBRE
                    var categoriaOriginal = _context.Categorias?.Where(c => c.Nombre == nombre).FirstOrDefault();
                    if(categoriaOriginal == null){
                        //DECLARAMOS EL OBJETO DADO EL VALOR
                        var categoriaGuardar = new Categoria{
                            Nombre = nombre
                        };
                        _context.Add(categoriaGuardar);
                        _context.SaveChanges();
                        resultado.nonError = true;
                    }
                    else{
                        resultado.nonError = false;
                        resultado.MsjError = "Ya existe una categoría con el nombre " +  categoriaOriginal.Nombre;
                    }
                    //SI ES DISTINTO A 0 QUIERE DECIR QUE ESTA EDITANDO LA CATEGORIA
                }else{
                    var categoriaOriginal = _context.Categorias?.Where(c => c.Nombre == nombre && c.ID != id).FirstOrDefault();
                    if(categoriaOriginal == null){
                        //DECLARAMOS EL OBJETO DADO EL VALOR
                        var categoriaEditar = _context.Categorias?.Find(id);
                        if(categoriaEditar != null){
                            categoriaEditar.Nombre = nombre;
                            _context.SaveChanges();
                            resultado.nonError = true;
                        }
                    }
                    else{
                        resultado.nonError = false;
                        resultado.MsjError = " Ha sido imposible editar, ya que ya existe una categoría con el nombre " +  categoriaOriginal.Nombre;
                    }
                }
            }
            return Json(resultado);
        }


    public JsonResult eliminarCategoria(int Id){
        var resultado = new ValidacionError();
        resultado.nonError = false;
        resultado.MsjError = "No se selecciono ninguna categoria";
        // bool resultado = false;
            //SI ES DISTINTO A 0 QUIERE DECIR QUE ESTA ELIMINANDO LA CATEGORIA
            if(Id != 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON EL MISMO ID
                var categoriaOriginal = _context.Categorias.Find(Id);
                var producto = _context.Productos.Where(P => P.ID == Id && P.Eliminado == false).Count();
                //SI TIENE SUBCATEGORIAS HABILITAS NO PRODECER
                if (producto == 0)
                {
                    //SI LA CATEGORIA NO ESTE ELIMINADA PROCEDEMOS A HACERLO
                    if(categoriaOriginal?.Eliminado == false)
                    {
                        categoriaOriginal.Eliminado = true;
                        _context.SaveChanges();
                        resultado.nonError = true;
                    }else{
                        categoriaOriginal.Eliminado = false;
                        _context.SaveChanges();
                        resultado.nonError= true;
                    }
                }else{
                    resultado.nonError= false;
                    resultado.MsjError = "Tiene productos habilitados relacionados a esta categoria. *primero deshabilítelos y despues vuelva a intentar*";
                }
            }
            return Json(resultado);
            }
    }
    
}