using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class Productosfix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Precio",
                table: "Productos",
                newName: "PrecioDeVenta");

            migrationBuilder.AddColumn<int>(
                name: "CantidadXPack",
                table: "Productos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioDeCompra",
                table: "Productos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CantidadXPack",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "PrecioDeCompra",
                table: "Productos");

            migrationBuilder.RenameColumn(
                name: "PrecioDeVenta",
                table: "Productos",
                newName: "Precio");
        }
    }
}
