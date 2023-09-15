using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ElRinconDeLaCopa.Models;

namespace ElRinconDeLaCopa.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {}
    public DbSet<Usuario>? Usuarios{ get; set; }
    public DbSet<Categoria>? Categorias { get; set; }
    public DbSet<Producto>? Productos { get; set; }
    public DbSet<CarritoCompra>? CarritoCompra { get; set; }
    public DbSet<DetalleCompra>? DetalleCompra { get; set; }
    public DbSet<PedidoCliente>? PedidosClientes { get; set; }
    public DbSet<DetalleDelPedido>? DetallesDePedidos { get; set; }
}
