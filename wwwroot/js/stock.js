


function CompletarTabla() {
  let tabla = $("#tbody-Stock");
  $.ajax({
    url: '../../Stock/Stock',
    type: 'GET',
    success: function (resultado) {
      setTimeout(function () {
        console.log(resultado);
        if (resultado.IngresosDeStock != null || resultado.PedidosFormateados != null) {
          tabla.empty();
          $.each(resultado.IngresosDeStock, function (indice, pedido) {
            console.log(pedido);
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
              console.log(pedido.productos[i].nombre, pedido.productos[i].cantidad);
              let producto = pedido.productos[i];
              nombres.append(`<li>${producto.nombre}</li>`);
              cantidades.append(`<li>${producto.cantidad}</li>`);
            }
          });
          $.each(resultado.PedidosFormateados, function (indice, pedido) {
            console.log(pedido);
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
              console.log("llegue aqui");
              nombres.append("<li>No hay productos</li>");
              cantidades.empty();
            }
            for (let i = 0; i < pedido.productos.length; i++) {
              let producto = pedido.productos[i];
              console.log(producto.nombre, producto.cantidad);
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
