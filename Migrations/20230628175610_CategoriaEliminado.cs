using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class CategoriaEliminado : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Categorias",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Categorias");
        }
    }
}
