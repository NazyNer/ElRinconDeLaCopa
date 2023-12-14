window.onload = CompletarTabla();


function FechaFormat(fecha) {
  var FechaFormateada = fecha.split("T")[0];
  FechaFormateada = FechaFormateada.split("-");
  FechaFormateada = `${FechaFormateada[2]}/${FechaFormateada[1]}/${FechaFormateada[0]}`
  return FechaFormateada;
}

function SelectEstados() {
  var SelectEstados = $("#EstadosIngresos");
  return SelectEstados;
}


function ChangeEstados() {
  CompletarTabla(1, 1)
}

const EstadosDicc = {
  0: "Incompleto",
  1: "Completado",
  2: "Esperando",
  3: "Entregado",
  4: "Cancelado"
}
function tablaIngreso(Ingresos) {
  let tabla = $("#tbody-Stock");
  $.each(Ingresos, function (indice, pedido) {
    var SelectOrNot = $(`#ProductoI0`);
    if (pedido.estado != 0) {
      tabla.append(`
      <tr id="${pedido, indice}" class="table-warning">
        <td >${pedido.emailUsuario}</td>
        <td>${FechaFormat(pedido.fechaPedido)}</td>
        <td>Ingreso</td>
        <td >
          <ul id="Producto${indice}"></ul>
        </td>
        <td>
          <ul id="Cantidad${indice}"></ul>
        </td>
      </tr>`)
        let trOptions = $(`#${pedido, indice}`);
        
        if (SelectOrNot.val() != undefined || EstadosDicc[pedido.estado] == "Entregado" || EstadosDicc[pedido.estado] == "Cancelado") {
          if (EstadosDicc[pedido.estado] == "Cancelado") {
            trOptions.addClass("table-danger");
            trOptions.removeClass("table-warning");
          }
          if (EstadosDicc[pedido.estado] == "Entregado") {
            trOptions.addClass("table-success");
            trOptions.removeClass("table-warning");
          }
          trOptions.append(`<td>${EstadosDicc[pedido.estado]}</td>`)
        }else{
          trOptions.append(`<td>
          <select id="estado${indice}" onchange="CambiarEstadoPedido('estado${indice}', '${pedido.emailUsuario}', '${pedido.fechaPedido}')">
            <option value="1" ${EstadosDicc[pedido.estado] == "Completado" ? "selected" : "" }>Completo</option>
            <option value="2" ${EstadosDicc[pedido.estado] == "Esperando" ? "selected" : ""} >Esperando</option>
            <option value="3" ${EstadosDicc[pedido.estado] == "Entregado" ? "selected" : ""} >Entregado</option>
            <option value="4" ${EstadosDicc[pedido.estado] == "Cancelado" ? "selected" : ""} >Cancelado</option>
          </select>
        </td>`)
          let select = $(`#estado${indice}`);
          $.each(select["0"].childNodes, function (indice, option) {
            if ((indice % 2) != 0) {
              
              if (EstadosDicc[pedido.estado] == "Completado") {
                if (EstadosDicc[option.value] == "Entregado") {
                  option.setAttribute("disabled", true);
                }
              }
              if (EstadosDicc[pedido.estado] == "Esperando") {
                if(EstadosDicc[option.value] == "Completado"){
                  option.setAttribute("disabled", true);
                }
              }
              if (EstadosDicc[pedido.estado] == "Entregado") {
                if(EstadosDicc[option.value] != "Entregado"){
                  option.setAttribute("disabled", true);
                }
              }
              if (EstadosDicc[pedido.estado] == "Cancelado") {
                if(EstadosDicc[option.value] != "Cancelado"){
                  option.setAttribute("disabled", true);
                }
              }
            }
          });
        }
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
      cantidades.append(`<li>${producto.cantidad} $${producto.subtotal}</li>`);
    }
    cantidades.append(`<li>Total: $${pedido.total}</li>`);
  });
}
function tablaGasto(Gastos) {
  let tabla = $("#tbody-Stock");
  $.each(Gastos, function (indice, pedido) {
    tabla.append(`
    <tr class="table-danger">
    <td>${pedido.emailUsuario}</td>
      <td>${FechaFormat(pedido.fechaPedido)}</td>
      <td>Gasto</td>
      <td >
        <ul id="ProductoI${indice}"></ul>
      </td>
      <td>
        <ul id="CantidadI${indice}"></ul>
      </td>
      <td>${EstadosDicc[pedido.estado]}</td>
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
    cantidades.append(`<li>${producto.cantidad} $${producto.subtotal}</li>`);
  }
  cantidades.append(`<li>Total: $${pedido.total}</li>`);
});
}

function CompletarTabla(Ingreso_Egreso = 1, EstadosIngreso = 1) {
  console.log(Ingreso_Egreso, EstadosIngreso);
  var selectEstados = SelectEstados();
  if (Ingreso_Egreso == 1) {
    if (EstadosIngreso = 1) {
      selectEstados.val()
      EstadosIngreso = selectEstados.val()
      selectEstados.removeClass("visually-hidden");
      var div = $("#EstadosIngresosDiv");
      div.addClass("text-white")
    }else{
      selectEstados.val(0)
      EstadosIngreso = selectEstados.val()
    }
  }else{
    selectEstados.addClass("visually-hidden");
    var div = $("#EstadosIngresosDiv");
    div.removeClass("text-white")
      let buttontags = $("#ul_tags")
      $.each(buttontags["0"].childNodes, function (indice, button) {
            
          if (Ingreso_Egreso == 2) {
            if (indice == 1 || indice == 5) {
              button.childNodes[1].classList.remove("btn-outline-primary");
              button.childNodes[1].classList.remove("active");
              button.childNodes[1].classList.add("btn-outline-secondary")
            }
            else if (indice == 3) {
              button.childNodes[1].classList.add("btn-outline-primary");
              button.childNodes[1].classList.add("active");
              button.childNodes[1].classList.remove("btn-outline-secondary")
            }else if(indice == 9){
              button.childNodes[1].classList.remove("text-success")
              button.childNodes[1].classList.remove("text-warning")
              button.childNodes[1].classList.add("text-danger")
            }

          }
          if (Ingreso_Egreso == 0) {
            if (indice == 1 || indice == 3) {
              button.childNodes[1].classList.remove("btn-outline-primary");
              button.childNodes[1].classList.remove("active");
              button.childNodes[1].classList.add("btn-outline-secondary")
            }
            else if (indice == 5) {
              button.childNodes[1].classList.add("btn-outline-primary");
              button.childNodes[1].classList.add("active");
              button.childNodes[1].classList.remove("btn-outline-secondary")
            }else if(indice == 9){
              button.childNodes[1].classList.remove("text-success")
              button.childNodes[1].classList.remove("text-danger")
              button.childNodes[1].classList.add("text-warning")
            }
          }
      });
  }
  let tabla = $("#tbody-Stock");
  tabla.empty();
  tabla.append(`
  <td></td>
  <td></td>
  <td>
    <div class="text-center bg-transparent p-5 m-5">
      <div class="spinner-border text-danger bg-white" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </td>`)
  $.ajax({
    url: '../../Stock/Stock',
    data: {EstadoPedidos: EstadosIngreso,Pedidos: Ingreso_Egreso },
    dataType: 'json',
    type: 'POST',
    success: function (resultado) {
      setTimeout(function () {
        if (resultado.IngresosDeStock != null || resultado.PedidosFormateados != null) {
          tabla.empty();
          console.log(resultado);
            //Ingreso
            tablaIngreso(resultado.PedidosFormateados);
            //Gasto
            tablaGasto(resultado.IngresosDeStock);
          
        } else {
          tabla.empty();
          tabla.append("<tr><td colspan='5'>No hay resultados</td></tr>");
        }
      }, 2000
      );
    }
  });
}

function CambiarEstadoPedido(IdSelectec, pedidoEmail, pedidoFecha) {
  let EstadoId = $("#" + IdSelectec)[0].value;
  let Email = pedidoEmail;
  let Fecha = pedidoFecha;
  $.ajax({
    url: '../../Stock/CambiarDeEstadoElPedido',
    data: { EstadoId: EstadoId, Email: Email, Fecha: Fecha },
    dataType: 'json',
    type: 'POST',
    success: function (resultado) {
      if (resultado.nonError) {
        if (EstadosDicc[EstadoId] == "Esperando") {
          Swal.fire({
            icon: "info",
            iconColor: "#2b2b2b",
            title: "Desea mandar un mensaje Pesonalizado o Automatico?",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Automatico',
            denyButtonText: `Personalizado`,
            confirmButtonColor: '#6b5944',
            denyButtonColor: '#a5731d',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              $.ajax({
                url: '../../Stock/PedidoNumero',
                data: { EstadoPedidos: EstadoId, Email: Email, Fecha: Fecha },
                dataType: 'json',
                type: 'POST',
                success: function(Numero) {
                  window.open(`https://wa.me/549${Numero}?text=Muchas%20gracias%20por%20comprar%20con%20nosotros.%0AAguarde%20nuestro%20delivery%20ya%20salió.`, '_blank');
                }
              });
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se abrira WhatsApp con el mensaje automatico',
                showConfirmButton: false,
                timer: 1500
                }).then(() => {
                  window.location.reload();
                });

            } else if (result.isDenied) {
              $.ajax({
                url: '../../Stock/PedidoNumero',
                data: { Email: Email, Fecha: Fecha },
                dataType: 'json',
                type: 'POST',
                success: function(Numero) {
                  window.open(`https://wa.me/549${Numero}`, '_blank');
                }
              });
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se abrira WhatsApp Web',
                showConfirmButton: false,
                timer: 1500
                }).then(() => {
                  window.location.reload();
                });
            }});
        }else if (EstadosDicc[EstadoId] == "Cancelado") {
          $.ajax({
            url: '../../Stock/CancelarPedido',
            data: { EstadoPedidos: EstadoId, Email: Email, Fecha: Fecha },
            dataType: 'json',
            type: 'POST',
            success: function(resultado) {
              if (resultado.nonError) {
                Swal.fire({
                  position: 'center',
                  icon: 'warning',
                  title: 'El pedido a sido Cancelado',
                  showConfirmButton: false,
                  timer: 1500
                  }).then(() => {
                    window.location.reload();
                  });
              }
            }});
        }else{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se completo el envio ',
            showConfirmButton: false,
            timer: 1500
            }).then(() => {
              window.location.reload();
            });
        }
      }else{
        alert(resultado.msjError)
      }
    }
  });
}