#nullable disable

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading;
using System.Threading.Tasks;
using ElRinconDeLaCopa.Data;
using ElRinconDeLaCopa.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;

namespace ElRinconDeLaCopa.Controllers
{
    public class RegisterViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

    }
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _context = context;
            _signInManager = signInManager;
        }
        
        [HttpPost]
        [Route("/Account/Register")]
        public async Task<JsonResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    var nombreRolCrearUsuario = _context.Roles.Where(r => r.Name == "Usuario").SingleOrDefault();
                    var NewUsuario = new Usuario{
                        IdUsuario = user.Id,
                        IdRol = nombreRolCrearUsuario.Id,
                    };
                    _context.Usuarios.Add(NewUsuario);
                    var usuario = await _userManager.FindByNameAsync(model.Email);
                    var asignarRolResult = await _userManager.AddToRoleAsync(usuario, "Usuario");
                    if(asignarRolResult.Succeeded){
                        await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);
                        _context.SaveChanges();
                        ViewBag.Roles = nombreRolCrearUsuario.Name;
                        return Json(new { success = true });
                        // Usuario registrado correctamente
                    }else{
                        return Json(new { success = false });
                    }
                }
                else
                {
                    // Hubo errores durante el registro
                    var errors = result.Errors.Select(e => e.Description);
                    return Json(new { success = false, errors = errors });
                }
            }

            // El modelo no es válido
            return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }
        [HttpPost]
        [Route("/Account/Login")]
        public async Task<JsonResult> Login(RegisterViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var nombreRolCrearUsuario = _context.Roles.Where(r => r.Name == "Usuario").SingleOrDefault();
                var usuario = await _userManager.FindByNameAsync(model.Email);
                var usuarioConectado = _context.Usuarios.Where( u => u.IdUsuario == usuario.Id).FirstOrDefault();
                if(usuarioConectado == null){
                    usuarioConectado = new Usuario{
                            IdUsuario = usuario.Id,
                        };
                    }
                if(usuarioConectado.IdRol == null){
                    usuarioConectado.IdRol = nombreRolCrearUsuario.Id;
                    var asignarRolResult = await _userManager.AddToRoleAsync(usuario, "Usuario");
                    if(asignarRolResult.Succeeded){
                        _context.Usuarios.Add(usuarioConectado);
                        _context.SaveChanges();
                        var Rol = _context.Roles.Where(r => r.Id == usuarioConectado.IdRol ).FirstOrDefault();
                         ViewData["Roles"] = Rol.Name;
                        // Inicio de sesión exitoso
                        return Json(new { success = true });
                    }else
                    {
                        // Error durante el inicio de sesión
                        return Json(new { success = false, error = "Credenciales inválidas" });
                    }
                };
                var rol = _context.Roles.Where(r => r.Id == usuarioConectado.IdRol ).FirstOrDefault();
                ViewData["Roles"] = rol.Name;
                return Json(new { success = true });
            }
            else
            {
                // Error durante el inicio de sesión
                return Json(new { success = false, error = "Credenciales inválidas" });
            }
        }

        public async Task<JsonResult> Rol(){
            var user = await _userManager.GetUserAsync(User);
            var usuarioConectado = _context.Usuarios.Where( u => u.IdUsuario == user.Id).FirstOrDefault();
            var rol = _context.Roles.Where(r => r.Id == usuarioConectado.IdRol ).FirstOrDefault();
            return Json(rol.Name);
        }
    }
}
