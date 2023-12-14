// Asignar la función BuscarProductos al evento onload de la ventana
window.onload = BuscarProductos();
var ArregloEnteroProductos = [];
var sinfiltro = []
var CantidadDeDatos = 5;
var ultimaPagina = 1;
// Función para crear un nuevo producto
function CrearNuevo() {
  // Configurar los campos del formulario y mostrar el modal
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
  $("#form-producto input[name='PrecioXPack']").val(``);
  $("#selectorImagen").val("");
  $("#nombreImagen").text("Imagen por defecto");
  $("#imagenSeleccionada").attr("src", "/img/productos/fotodefaullt.jpg");
}




function BuscarProductoPorNombre(){
  let Buscador = $("#NombreCategoria").val();
  if (Buscador.length >= 2) {
    ArregloEnteroProductos = ArregloEnteroProductos.filter(producto => producto.nombre.includes(Buscador.toUpperCase()));
    var filtradoNombreCategoria = sinfiltro.filter(producto => producto.nombreCategoria.includes(Buscador.toUpperCase()));
    for (let i = 0; i < filtradoNombreCategoria.length; i++) {
      ArregloEnteroProductos.push(filtradoNombreCategoria[i])
    }
      ultimaPagina = Math.ceil(ArregloEnteroProductos.length / CantidadDeDatos);
      Paginacion(1, ultimaPagina)
  }else{
      ultimaPagina = Math.ceil(ArregloEnteroProductos.length / CantidadDeDatos);
      Paginacion(1, ultimaPagina)
  }
  BuscarProductos(1, ultimaPagina)
}
function Paginacion(pagina, UltimaPagina = ultimaPagina) {
  let PaginaActiva = $("#PaginaActiva");
  let btnAnterior = $("#PaginaAnterior");
  let btnSiguiente = $("#PaginaSiguiente");
  PaginaActiva.text(pagina), ultimaPagina;
  if (pagina == 1) {
      btnAnterior.attr("disabled", true);
      btnSiguiente.attr("disabled", false);
      if (pagina >= UltimaPagina) {
          btnSiguiente.attr("disabled", true);
      }
      btnSiguiente.attr("onclick", `BuscarProductos(${pagina + 1})`);
  }else{
      btnAnterior.attr("disabled", false);
      btnSiguiente.attr("disabled", false);
      btnAnterior.attr("onclick", `BuscarProductos(${pagina - 1})`);
      btnSiguiente.attr("onclick", `BuscarProductos(${pagina + 1})`);
      if (pagina >= UltimaPagina) {
          btnSiguiente.attr("disabled", true);
      }
  }
}

// Función para buscar productos
function BuscarProductos(pagina = 1, UltimaPagina = ultimaPagina) {
  let Buscador = $("#NombreCategoria").val();
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
      ArregloEnteroProductos = productos;
      sinfiltro = productos
            if (Buscador.length >= 2) {
              ArregloEnteroProductos = ArregloEnteroProductos.filter(producto => producto.nombre.includes(Buscador.toUpperCase()));
              var filtradoNombreCategoria = sinfiltro.filter(producto => producto.nombreCategoria.includes(Buscador.toUpperCase()));
              for (let i = 0; i < filtradoNombreCategoria.length; i++) {
                ArregloEnteroProductos.push(filtradoNombreCategoria[i])
              }
                ultimaPagina = Math.ceil(ArregloEnteroProductos.length / CantidadDeDatos);
            }else{
                ultimaPagina = Math.ceil(ArregloEnteroProductos.length / CantidadDeDatos);
            }
            Paginacion(pagina, ultimaPagina)
            var InicioDeTabla = (pagina - 1) * CantidadDeDatos;
            var FinDeLaTabla = InicioDeTabla + CantidadDeDatos;
            ultimaPagina = Math.ceil(ArregloEnteroProductos.length / CantidadDeDatos);
      
      $.each(ArregloEnteroProductos.slice(InicioDeTabla, FinDeLaTabla), function (index, producto) {
        if (producto.eliminado || producto.cantidadXPack == 0) {
          // Agregar fila para productos eliminados
          TablaProducto.append(`
                        <tr class="tabla-eliminada">
                            <td class="thcat"> <a class="btn botones-modalss-none altura" role="button">${producto.nombreCategoria}</a></td>

                            <td>
                            ${producto.imagen == null
              ? `<img  class="imagen-producto" src="/img/productos/fotodefaullt.jpg" style="width: 70px;"/>`
              : `<img class="imagen-producto" src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 70px;"/>`
            }
            <a class="btn botones-modalss-none" role="button">${producto.nombre}</a>
                            </td> 

                            <td> <a class="btn botones-modalss-none altura"  role="button">${producto.precioDeVenta}</a></td>

                            <td> <a class="btn botones-modalss-none altura"  role="button">${producto.cantidad}</a></td>
                            <td><a class="btn botones-modalss-none altura"  role="button">${producto.cantidadXPack}</a></td>
                            <td> <button class="btn botones-modalss altura" onClick="RemoveProducto(${producto.id})"><i class="fa-solid fa-trash"></i></button></td>
                            
                            <td> <button class="btn botones-modalss altura" onClick="BuscarProducto(${producto.id})"><i class="fa-solid fa-gear"></i></button></td>
                            
                            
                        </tr>`);
        } else {
          // Agregar fila para productos no eliminados (disponibles)
          TablaProducto.append(`
                        <tr>
                            <td class="thcat"> <a class="btn botones-modalss-none altura" role="button">${producto.nombreCategoria}</a></td>
                            <td>
                            ${producto.imagen == null
                              ? `<img class="imagen-producto" src="/img/productos/fotodefaullt.jpg" style="width: 70px;"/>`
                              : `<img class="imagen-producto" src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 70px;"/>`
                            } 
                            <a class=" btn botones-modalss-none" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn botones-modalss-none altura"  role="button">${producto.precioDeVenta}</a></td>
                            <td> <a class="btn botones-modalss-none altura" role="button">${producto.cantidad}</a></td>
                            <td><a class="btn botones-modalss-none altura"  role="button">${producto.cantidadXPack}</a> <button class="btn botones-modalss altura" onClick="AgregarAlDetalle(${producto.id})"><i class="fa-solid fa-cart-plus"></i></button></td>

                            <td> <button class="btn botones-modalss altura" onClick="RemoveProducto(${producto.id})"><i class="fa-solid fa-trash"></i></button></td>
                            <td> <button class="btn botones-modalss altura" onClick="BuscarProducto(${producto.id})"><i class="fa-solid fa-gear"></i></button></td>
                        </tr>
                        `);
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
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Producto creado correctamente',
          showConfirmButton: false,
          timer: 1500
                  })
        $("#ModalProducto").modal("hide");
        BuscarProductos();
      }
      else {
        //  $("#texto-error").text(resultado.msjError);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Es necesario rellenar todos los campos!',
          showConfirmButton: false,
          timer: 1500
                  })
      }
    },
    cache: false,
    contentType: false,
    processData: false
  });
}

// Función para buscar un producto por ID
function BuscarProducto(ID) {
  console.log(ID);
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
      if (productos.length == 1) {
        let producto = productos[0];
        $("#texto-error").text("");
        $("#h1Producto").text("Editar Producto")
        $("#form-producto input[name='Productoid']").val(producto.id);
        $("#btnCrear").show();
        $("#form-producto input[name='Nombre']").val(producto.nombre);
        $(`#CategoriaID`).val(producto.idCategoria);
        $("#form-producto input[name='PrecioXPack']").val(producto.precioDeCompra);
        $("#form-producto input[name='Precio']").val(producto.precioDeVenta);
        $("#form-producto input[name='Cantidad']").val(producto.cantidadXPack);
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
        // alert(resultado.msjError)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Producto eliminado correctamente ',
          showConfirmButton: false,
          timer: 1500
                  })
        BuscarProductos();
      }
      else {
        // alert(resultado.msjError)
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Para eliminar este producto, primero eliminelo de su carrito. ',
          showConfirmButton: false,
          timer: 1500
                  })

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
