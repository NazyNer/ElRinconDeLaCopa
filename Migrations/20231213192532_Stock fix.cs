using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class Stockfix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PrecioPorUnidad",
                table: "DetalleCompra",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Subtotal",
                table: "DetalleCompra",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                table: "CarritoCompra",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecioPorUnidad",
                table: "DetalleCompra");

            migrationBuilder.DropColumn(
                name: "Subtotal",
                table: "DetalleCompra");

            migrationBuilder.DropColumn(
                name: "Total",
                table: "CarritoCompra");
        }
    }
}
