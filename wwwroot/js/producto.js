// Asignar la función BuscarProductos al evento onload de la ventana
window.onload = BuscarProductos();

// Función para crear un nuevo producto
function CrearNuevo() {
  // Configurar los campos del formulario y mostrar el modal
  $("#form-producto input[name='Productoid']").val(`0`);
  $(`#CategoriaID`).val('0');
  $("#ModalProducto").modal("show");
  $("#h1Producto").text("P R O D U C T O");
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
  $("#imagenSeleccionada").attr("src", "/img/productos/fotodefaullt.jpg");
}

// Función para buscar productos
function BuscarProductos() {
  // Seleccionar la tabla de productos
  let TablaProducto = $("#tbody-productos");
  TablaProducto.empty();
  
  $.ajax({
    // la URL para la petición
    url: '../../Producto/BuscarProductosTabla',
    // la información a enviar
    data: {},
    // especifica si será una petición POST o GET
    type: 'GET',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria
    success: function (productos) {
      TablaProducto.empty();
      console.log(productos);
      $.each(productos, function (index, producto) {
        if (producto.eliminado) {
          // Agregar fila para productos eliminados
          TablaProducto.append(`
            <tr class="">
              <td class="thcat"> <a class="btn btn-warning btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
              <td> <a class="btn btn-warning btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
              <td> <a class="btn btn-warning btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
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
          // Agregar fila para productos no eliminados (disponibles)
          TablaProducto.append(`
            <tr class="">
              <td class="thcat"> <a class="btn btn-primary btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
              <td> <a class="btn btn-primary btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
              <td> <a class="btn btn-primary btn-sm botones-tablas" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
              <td><b>${producto.cantidad}</b></td>
              <td>
                ${producto.imagen == null
                  ? `<img src="/img/productos/fotodefaullt.jpg" style="width: 40px;"/>`
                  : `<img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 40px;"/>`
                }
              </td>
              <td> <button class="btn btn-producto-cart" onClick="AgregarAlDetalle(${producto.id})"><i class="fa-solid fa-cart-plus"></i></button></td>
              <td class="tdbasura"><button class="delete-button" onClick="RemoveProducto(${producto.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`);
        }
      })
    },
  })
}

// Función para guardar un producto
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

// Función para buscar un producto por ID
function BuscarProducto(ID) {
  $.ajax({
    // la URL para la petición
    url: '../../Producto/BuscarProductosTabla',
    // la información a enviar
    data: { Id: ID },
    // especifica si será una petición POST o GET
    type: 'GET',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria
    success: function (productos) {
      if (productos.Productos.length == 1) {
        let producto = productos.Productos[0];
        $("#texto-error").text("");
        $("#h1Producto").text("E D I T A R")
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
        } else {
          $("#btnHabilitarProducto").show();
          $("#btnEliminarProducto").hide();
          $("#btnCrear").hide();
        }
        $("#ModalProducto").modal("show");
      }
    },
  })
}

// Función para eliminar un producto
function eliminarProducto() {
  let Id = $("#form-producto input[name='Productoid']").val();
  $.ajax({
    // la URL para la petición
    url: '../../Producto/EliminarProducto',
    // la información a enviar
    data: { Id: Id },
    // especifica si será una petición POST o GET
    type: 'POST',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria
    success: function (resultado) {
      if (resultado.nonError) {
        $("#ModalProducto").modal("hide");
        BuscarProductos();
      } else {
        $("#lbl-error").text(resultado.msjError);
      }
    },
    // código a ejecutar si la petición falla
    error: function (xhr, status) {
      alert('Disculpe, existió un problema');
      $("#ModalProducto").modal("hide");
      BuscarCategorias();
    }
  });
}

// Función para eliminar un producto (versión alternativa)
function RemoveProducto(id) {
  $.ajax({
    // la URL para la petición
    url: '../../Producto/RemoveProducto',
    // la información a enviar
    data: { ID: id },
    // especifica si será una petición POST o GET
    type: 'POST',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria
    success: function (resultado) {
      if (resultado.nonError) {
        alert(resultado.msjError)
        BuscarProductos();
      } else {
        alert(resultado.msjError)
      }
    },
    // código a ejecutar si la petición falla
    error: function (xhr, status) {
      alert('Disculpe, existió un problema');
      $("#ModalProducto").modal("hide");
      BuscarCategorias();
    }
  });
}

// Función para convertir a mayúsculas cuando se escribe en el campo de texto "textoInput"
$("#textoInput").on("input", function () {
  var input = $(this);
  var startPosition = input[0].selectionStart;  // Guardar la posición del cursor

  input.val(input.val().toUpperCase());  // Convertir texto a mayúsculas

  input[0].setSelectionRange(startPosition, startPosition);  // Restaurar la posición del cursor
});

// Función para manejar el cambio de imagen seleccionada en el campo "selectorImagen"
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
