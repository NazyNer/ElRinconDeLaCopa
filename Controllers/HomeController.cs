using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ElRinconDeLaCopa.Models;
using Microsoft.AspNetCore.Identity;
using ElRinconDeLaCopa.Data;

namespace ElRinconDeLaCopa.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly RoleManager<IdentityRole> _rolManager;
    private readonly UserManager<IdentityUser> _userManager;
    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context,  RoleManager<IdentityRole> rolManager, UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
        _logger = logger;
        _context = context;
         _rolManager = rolManager;
    }

    public async Task<IActionResult> IndexAsync()
    {
         //CREAR ROLES SI NO EXISTEN
        var nombreRolCrearAdmin = _context.Roles.Where(r => r.Name == "Administrador").SingleOrDefault();
        if (nombreRolCrearAdmin == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Administrador"));
        }
        var nombreRolCrearEmpleado = _context.Roles.Where(r => r.Name == "Empleado").SingleOrDefault();
        if (nombreRolCrearEmpleado == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Empleado"));
        }
        var nombreRolCrearCliente = _context.Roles.Where(r => r.Name == "Cliente").SingleOrDefault();
        if (nombreRolCrearCliente == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Cliente"));
        }
        var nombreRolCrearUsuario = _context.Roles.Where(r => r.Name == "Usuario").SingleOrDefault();
        if (nombreRolCrearUsuario == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Usuario"));
        }

        var usuario = await _userManager.FindByNameAsync("Administrador");
        if(usuario == null){
            var user = new IdentityUser { UserName = "Administrador", Email = "admin@delacopa.com"};
            var result = await _userManager.CreateAsync(user, "123456");
            if (result.Succeeded){
                var NewUsuario = new Usuario{
                    IdUsuario = user.Id,
                    IdRol = nombreRolCrearAdmin.Id,
                };
                _context.Usuarios.Add(NewUsuario);
                var usuarioAdmin = await _userManager.FindByNameAsync("Administrador");
                var asignarRolResult = await _userManager.AddToRoleAsync(usuarioAdmin, "Administrador");
            }
        }
        
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
