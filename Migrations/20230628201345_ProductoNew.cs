using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class ProductoNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Productos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NombreCategoria",
                table: "Productos",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "NombreCategoria",
                table: "Productos");
        }
    }
}
