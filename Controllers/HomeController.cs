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
    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context,  RoleManager<IdentityRole> rolManager)
    {
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
