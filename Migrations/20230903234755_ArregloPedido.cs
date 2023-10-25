using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElRinconDeLaCopa.Migrations
{
    public partial class ArregloPedido : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleCompra_PedidosClientes_PedidoClientePedidoID",
                table: "DetalleCompra");

            migrationBuilder.DropIndex(
                name: "IX_DetalleCompra_PedidoClientePedidoID",
                table: "DetalleCompra");

            migrationBuilder.DropColumn(
                name: "PedidoClientePedidoID",
                table: "DetalleCompra");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PedidoClientePedidoID",
                table: "DetalleCompra",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetalleCompra_PedidoClientePedidoID",
                table: "DetalleCompra",
                column: "PedidoClientePedidoID");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleCompra_PedidosClientes_PedidoClientePedidoID",
                table: "DetalleCompra",
                column: "PedidoClientePedidoID",
                principalTable: "PedidosClientes",
                principalColumn: "PedidoID");
        }
    }
}
