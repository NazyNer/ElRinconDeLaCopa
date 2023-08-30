using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class Pedidos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PedidoClientePedidoID",
                table: "DetalleCompra",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PedidosClientes",
                columns: table => new
                {
                    PedidoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaActual = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsuarioID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    Calle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Numero = table.Column<int>(type: "int", nullable: false),
                    Depto = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PedidosClientes", x => x.PedidoID);
                });

            migrationBuilder.CreateTable(
                name: "DetallesDePedidos",
                columns: table => new
                {
                    DetalleDelPedidoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PedidoID = table.Column<int>(type: "int", nullable: false),
                    ProductoID = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PedidoClientePedidoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetallesDePedidos", x => x.DetalleDelPedidoID);
                    table.ForeignKey(
                        name: "FK_DetallesDePedidos_PedidosClientes_PedidoClientePedidoID",
                        column: x => x.PedidoClientePedidoID,
                        principalTable: "PedidosClientes",
                        principalColumn: "PedidoID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DetalleCompra_PedidoClientePedidoID",
                table: "DetalleCompra",
                column: "PedidoClientePedidoID");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesDePedidos_PedidoClientePedidoID",
                table: "DetallesDePedidos",
                column: "PedidoClientePedidoID");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleCompra_PedidosClientes_PedidoClientePedidoID",
                table: "DetalleCompra",
                column: "PedidoClientePedidoID",
                principalTable: "PedidosClientes",
                principalColumn: "PedidoID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleCompra_PedidosClientes_PedidoClientePedidoID",
                table: "DetalleCompra");

            migrationBuilder.DropTable(
                name: "DetallesDePedidos");

            migrationBuilder.DropTable(
                name: "PedidosClientes");

            migrationBuilder.DropIndex(
                name: "IX_DetalleCompra_PedidoClientePedidoID",
                table: "DetalleCompra");

            migrationBuilder.DropColumn(
                name: "PedidoClientePedidoID",
                table: "DetalleCompra");
        }
    }
}
