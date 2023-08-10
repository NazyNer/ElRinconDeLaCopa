window.onload = BuscarProductos();

function CrearNuevo() {
  $("#form-producto input[name='Productoid']").val(`0`);
  $(`#CategoriaID`).val('0');
  $("#ModalProducto").modal("show");
  $("#h1Producto").text("Crear Producto");
  $("#form-producto input[name='Nombre']").val("");
  $("#texto-error").text("");
  $("#btnEliminarProducto").hide();
  $("#btnHabilitarProducto").hide();
  $("#btnCrear").show();
  $("#btnCrear").text("Crear");
  $("#form-producto input[name='Cantidad']").val(``);
  $("#form-producto input[name='Precio']").val(``);
  $("#selectorImagen").val("");
  $("#nombreImagen").text("Imagen por defecto");
  $("#imagenSeleccionada").attr("src", "/img/productos/fotodefaullt.jpg")
}

function BuscarProductos() {
  let TablaProducto = $("#tbody-productos");
  TablaProducto.empty();
  $.ajax({
    // la URL para la petición
    url: '../../Producto/BuscarProductos',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {},
    // especifica si será una petición POST o GET
    type: 'GET',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (productos) {
      TablaProducto.empty();
      $.each(productos, function (index, producto) {
        if (producto.eliminado) {
          TablaProducto.append(`
                        <tr class="">
                            <td class="thcat"> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
                            <td><b>${producto.cantidad}</b></td>
                            <td>
                            ${producto.imagen == null
              ? `<img src="/img/productos/fotodefaullt.jpg" style="width: 40px;"/>`
              : `<img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 40px;"/>`
            }
                            </td> 
                            <td><button onClick="RemoveProducto(${producto.id})"><i class="fa-regular fa-trash-can" style="color: #be540e;"></i></button></td>
                        </tr>`);
        } else {
          TablaProducto.append(`
                        <tr class="">
                            <td class="thcat"> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
                            <td><b>${producto.cantidad}</b></td>
                            <td>
                            ${producto.imagen == null
              ? `<img src="/img/productos/fotodefaullt.jpg" style="width: 40px;"/>`
              : `<img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 40px;"/>`
            }
                            </td>
                            <td><button onClick="RemoveProducto(${producto.id})"><i class="fa-regular fa-trash-can" style="color: #be540e;"></i></button></td>
                        </tr>`);
        }
      })
    },
  })
}

function GuardarProducto() {
  $("#lbl-error").text("");
  let form = $("form#form-producto");
  let formData = new FormData(form[0])
  $.ajax({
    url: '../../Producto/GuardarProducto',
    type: 'POST',
    data: formData,
    async: false,
    success: function (resultado) {
      if (resultado.nonError) {
        $("#ModalProducto").modal("hide");
        BuscarProductos();
      }
      else {
        $("#texto-error").text(resultado.msjError);
      }
    },
    cache: false,
    contentType: false,
    processData: false
  });
}

function BuscarProducto(ID) {

  $.ajax({
    // la URL para la petición
    url: '../../Producto/BuscarProductos',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { Id: ID },
    // especifica si será una petición POST o GET
    type: 'GET',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (productos) {
      if (productos.length = 1) {
        let producto = productos[0];
        $("#texto-error").text("");
        $("#h1Producto").text("Editar producto")
        $("#form-producto input[name='Productoid']").val(producto.id);
        $("#btnCrear").show();
        $("#form-producto input[name='Nombre']").val(producto.nombre);
        $(`#CategoriaID`).val(producto.idCategoria);
        $("#form-producto input[name='Precio']").val(producto.precio);
        $("#form-producto input[name='Cantidad']").val(producto.cantidad);
        if (producto.imagen == null) {
          var imagenGuardadaBytes = "/img/productos/fotodefaullt.jpg"
          $("#nombreImagen").text("Imagen por defecto");
        } else {
          var imagenGuardadaBytes = "data:image/" + producto.tipoImagen + ";base64," + producto.imagen;
          $("#nombreImagen").text(producto.nombreImagen);
          $("#selectorImagen").val("");
        }
        $("#imagenSeleccionada").attr("src", imagenGuardadaBytes);
        if (!producto.eliminado) {
          $("#btnEliminarProducto").show();
          $("#btnHabilitarProducto").hide();
          $("#btnCrear").show();
          $("#btnCrear").text("Editar");
        }
        else {
          $("#btnHabilitarProducto").show();
          $("#btnEliminarProducto").hide();
          $("#btnCrear").hide();
        }
        $("#ModalProducto").modal("show");
      }
    },
  })

}

function eliminarProducto() {

  //JAVASCRIPT
  let Id = $("#form-producto input[name='Productoid']").val();
  $.ajax({
    // la URL para la petición
    url: '../../Producto/EliminarProducto',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { Id: Id },
    // especifica si será una petición POST o GET
    type: 'POST',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (resultado) {
      if (resultado.nonError) {
        $("#ModalProducto").modal("hide");
        BuscarProductos();
      }
      else {
        $("#lbl-error").text(resultado.msjError);
      }
    },
    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert('Disculpe, existió un problema');
      $("#ModalProducto").modal("hide");
      BuscarCategorias();
    }
  });
}
function RemoveProducto(id) {
  $.ajax({
    // la URL para la petición
    url: '../../Producto/RemoveProducto',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { ID: id },
    // especifica si será una petición POST o GET
    type: 'POST',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (resultado) {
      if (resultado.nonError) {
        alert(resultado.msjError)
        BuscarProductos();
      }
      else {
        alert(resultado.msjError)
      }
    },
    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert('Disculpe, existió un problema');
      $("#ModalProducto").modal("hide");
      BuscarCategorias();
    }
  });
}

$("#textoInput").on("input", function () {
  var input = $(this);
  var startPosition = input[0].selectionStart;  // Guardar la posición del cursor

  input.val(input.val().toUpperCase());  // Convertir texto a mayúsculas

  input[0].setSelectionRange(startPosition, startPosition);  // Restaurar la posición del cursor
});

$("#selectorImagen").change(function () {
  var inputFile = $(this)[0];
  if (inputFile.files.length > 0) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#imagenSeleccionada").attr("src", e.target.result).show();
    };

    reader.readAsDataURL(inputFile.files[0]);

    var imagenGuardadaNombre = inputFile.files[0].name;
    $("#nombreImagen").text(imagenGuardadaNombre);
  }
});

