using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class BOOLPRODUCTO : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Productos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Productos");
        }
    }
}
