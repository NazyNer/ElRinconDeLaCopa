window.onload = CompletarTabla();


function CompletarTabla() {
  let tabla = $("#tbody-Stock");
  $.ajax({
    url: '../../Stock/Stock',
    type: 'GET',
    success: function (resultado) {
      setTimeout(function () {
        if (resultado.IngresosDeStock != null || resultado.PedidosFormateados != null) {
          tabla.empty();
          $.each(resultado.IngresosDeStock, function (indice, pedido) {
            if (pedido.estado > 0 && pedido.estado < 4) {
                tabla.append(`
                <tr>
                <td>${pedido.emailUsuario}</td>
                  <td>${pedido.fechaPedido}</td>
                  <td>Ingreso</td>
                  <td >
                    <ul id="ProductoI${indice}"></ul>
                  </td>
                  <td>
                    <ul id="CantidadI${indice}"></ul>
                  </td>
                  <td>${pedido.estado}</td>
                </tr>`)
              let nombres = $(`#ProductoI${indice}`);
              let cantidades = $(`#CantidadI${indice}`);
              if (pedido.productos.length == 0) {
                nombres.append("<li>No hay productos</li>");
                cantidades.empty();
              }
              for (let i = 0; i < pedido.productos.length; i++) {
                let producto = pedido.productos[i];
                nombres.append(`<li>${producto.nombre}</li>`);
                cantidades.append(`<li>${producto.cantidad}</li>`);
              }
            }
          });
          $.each(resultado.PedidosFormateados, function (indice, pedido) {

            if (pedido.estado == 0) {
              tabla.append(`
              <tr>
                <td>${pedido.emailUsuario}</td>
                <td>${pedido.fechaPedido}</td>
                <td>Egreso</td>
                <td >
                  <ul id="Producto${indice}"></ul>
                </td>
                <td>
                  <ul id="Cantidad${indice}"></ul>
                </td>
                <td>${pedido.estado}</td>
              </tr>
              `)
            } else {
              tabla.append(`
              <tr>
              <td>${pedido.emailUsuario}</td>
                <td>${pedido.fechaPedido}</td>
                <td>Egreso</td>
                <td >
                  <ul id="Producto${indice}"></ul>
                </td>
                <td>
                  <ul id="Cantidad${indice}"></ul>
                </td>
                <td>${pedido.estado}</td>
              </tr>`)
            }
            let nombres = $(`#Producto${indice}`);
            let cantidades = $(`#Cantidad${indice}`);
            if (pedido.productos.length == 0) {
              nombres.append("<li>No hay productos</li>");
              cantidades.empty();
            }
            for (let i = 0; i < pedido.productos.length; i++) {
              let producto = pedido.productos[i];
              nombres.append(`<li>${producto.nombre}</li>`);
              cantidades.append(`<li>${producto.cantidad}</li>`);
            }
          });
        } else {
          tabla.empty();
          tabla.append("<tr><td colspan='5'>No hay resultados</td></tr>");
        }
      }, 2000
      );
    }
  });
}
