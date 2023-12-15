
function CompletarDatosVista() {
  var pageActive = $("div.col-md-9");
  var perfil = $("#profile");
  var email = $("#email");
  var password = $("#change-password");
  var datos = $("#datos")
  console.log(perfil);
  perfil.removeClass("active");
  email.removeClass("active");
  password.removeClass("active");
  datos.addClass("active");
  pageActive.empty();
  pageActive.append(`
  <div class="row">
  <div class="col-md-6">
        <form>
            <div class="form-floating">
                <input class="form-control" type="text" id="NombreCompleto" name="Nombre">
                <label class="form-label" for="Nombre">Nombre completo</label>
            </div>
        </form>
        <button class="w-100 btn btn-lg btn-primary" onclick="GuardarDatos()">Guardar</button>
    </div>
    </div>
  `);
}

function GuardarDatos() {
  var nombreCompleto = $("#NombreCompleto").val();
  console.log(nombreCompleto);
  if (nombreCompleto.length == 0) {
    alert("Ingrese un nombre");
  }else{
    $.ajax({
      url: '../../Usuarios/GuardarDatos',
      data: {nombre: nombreCompleto},
      type: 'POST',
      dataType: 'json',
      success: function (resultado) {
        if (resultado.nonError) {
          window.location.href = "/";
        }else{
          alert(resultado.msjError);
        }
        console.log(resultado);
      } 
    });
  } 
}

function showAlertPedidos() {
  $.ajax({
    url: '../../Pedido/BuscarPedidoEnEsperaRespuesta',
    type: 'GET',
    success: function (resultado) {
      if (resultado) {
        Swal.fire({
          position: 'bottom-end',
          icon: 'info',
          title: 'Hay pedidos en cola, como completados',
          showConfirmButton: true,
          timer: 9999999,
          timerProgressBar: true,
          allowOutsideClick: false,
          confirmButtonText: 'Ir'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/Stock";
          }
        });
      }
    }
  });
}

setInterval(showAlertPedidos, 60000);

function hiddenNav() {
  var nav = $("#navbar");
  nav.attr("hidden",true);
}
