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
                    // Usuario registrado correctamente
                    await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);
                    return Json(new { success = true });
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
                // Inicio de sesión exitoso
                return Json(new { success = true });
            }
            else
            {
                // Error durante el inicio de sesión
                return Json(new { success = false, error = "Credenciales inválidas" });
            }
        }
    }
}
