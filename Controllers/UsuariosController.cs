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
  public class UsuariosController : Controller
  {
    private readonly ILogger<UsuariosController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public UsuariosController(ApplicationDbContext context, ILogger<UsuariosController> logger, UserManager<IdentityUser> userManager)
    {
      _context = context;
      _logger = logger;
      _userManager = userManager;
    }
    public IActionResult Index()
    {
      return View();
    }

    public async Task<JsonResult>BuscarNumeroUsuario (){
      var user = await _userManager.GetUserAsync(User);
      var usuario = _context.Usuarios?.Where(u => u.IdUsuario == user.Id).FirstOrDefault();
      return Json(usuario);
    }

    public async Task<JsonResult> CompletarTabla()
    {
      dynamic UsuariosFormateados = new ExpandoObject();
      var usuarios = _context.Usuarios.ToList();
      if (usuarios.Count > 0)
      {
        foreach (var usuario in usuarios)
        {
          dynamic usuarioFormateado = new ExpandoObject();
          var usuariotabla2 = _userManager.FindByIdAsync(usuario.IdUsuario).Result;
          usuarioFormateado.Id = usuario.IdUsuario;
          usuarioFormateado.Nombre = usuario.Nombre;
          usuarioFormateado.rolID = usuario.IdRol;
          usuarioFormateado.Email = usuariotabla2.Email;
          ((IDictionary<string, object>)UsuariosFormateados)[usuario.ID.ToString()] = usuarioFormateado;
        }
        ((IDictionary<string, object>)UsuariosFormateados)["Roles"] = _context.Roles.ToList();
      }
      return Json(UsuariosFormateados);
    }
    public async Task<JsonResult> GuardarDatos(string nombre)
    {
      var resultado = new ValidacionError();
      resultado.nonError = false;
      resultado.MsjError = "Error al guardar los datos";
      var user = await _userManager.GetUserAsync(User);
      if (user != null)
      {
        var usuario = _context.Usuarios?.Where(u => u.IdUsuario == user.Id).FirstOrDefault();
        if (usuario != null)
        {
          usuario.Nombre = nombre;
          _context.SaveChanges();
          resultado.nonError = true;
          resultado.MsjError = "";
        }
      }
      return Json(resultado);
    }

    public async Task<JsonResult> CambiarRol(string UsuarioID, string RolName)
    {
      var resultado = new ValidacionError();
      resultado.nonError = false;
      resultado.MsjError = "Error al cambiar Rol";
          resultado.MsjError = "Error al encontrar al usuario";
          var usuarioDb = _context.Usuarios.Where(u => u.IdUsuario == UsuarioID).FirstOrDefault();
          if(usuarioDb != null){
            var usuarioDotNet = await _userManager.FindByIdAsync(UsuarioID);
            if(usuarioDotNet != null){
              var RolNameNormalize = RolName.Normalize();
              var rolAsignar = _context.Roles.Where(r => r.NormalizedName == RolNameNormalize).FirstOrDefault();
              resultado.MsjError = "Error al encontrar el rol";
              if(rolAsignar != null)
              {
                var RolAsignado = await _context.UserRoles.FirstOrDefaultAsync(UR => UR.UserId == UsuarioID && UR.RoleId == usuarioDb.IdRol);
                _context.UserRoles.Remove(RolAsignado);
                _context.SaveChanges();
                usuarioDb.IdRol = rolAsignar.Id;
                _context.SaveChanges();
                var asignarRolResult = await _userManager.AddToRoleAsync(usuarioDotNet, rolAsignar.Name);
                if (asignarRolResult.Succeeded)
                    {
                        resultado.nonError = true;
                        resultado.MsjError = "Rol Cambiado con exito";
                        await _context.SaveChangesAsync();
                    }
              }
            }
      }
      return Json(resultado);
    }
  }
}