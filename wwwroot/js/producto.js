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
      console.log(productos);
      TablaProducto.empty();
      $.each(productos, function (index, producto) {
        console.log(producto.eliminado);
        if (producto.eliminado) {
          console.log(producto)
          TablaProducto.append(`
                        <tr class="">
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
                            <td><b>${producto.cantidad}</b></td>
                            <td>
                            <img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 40px;"/>
                            </td> 
                        </tr>`);
        } else {
          TablaProducto.append(`
                        <tr class="">
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.precio}</a></td>
                            <td><b>${producto.cantidad}</b></td>
                            <td>
                            <img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 50px;"/>
                            </td>
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
  console.log(form);
  console.log(formData);
  $.ajax({
    url: '../../Producto/GuardarProducto',
    type: 'POST',
    data: formData,
    async: false,
    success: function (resultado) {
      console.log(resultado);
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
  console.log(ID)
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
      console.log(productos);
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
        if(!producto.eliminado){
            $("#btnEliminarProducto").show();
            $("#btnHabilitarProducto").hide();
            $("#btnCrear").show();
            $("#btnCrear").text("Editar");
        }
        else{
          $("#btnHabilitarProducto").show();
          $("#btnEliminarProducto").hide();
          $("#btnCrear").hide();
        }
        $("#ModalProducto").modal("show");
      }
    },
  })

}
//BUSCAR CATEGORIA EDITTAR
function BuscarCategoria(Id) {
  console.log(Id)
  $.ajax({
      // la URL para la petición
      url: '../../Categoria/BuscarCategorias',
      // la información a enviar
      // (también es posible utilizar una cadena de datos)
      data: { Id: Id },
      // especifica si será una petición POST o GET
      type: 'GET',
      // el tipo de información que se espera de respuesta
      dataType: 'json',
      success: function (Categoria) {
          console.log(Categoria)
          if (Categoria.length == 1) {
              let categoria = Categoria[0];
              $("#lbl-error").text("");
              $("#h1Categoria").text("Editar Categoria");
              $("#Id").val(`${Categoria[0].id}`);
              $("#form-categoria input[name='Nombre']").val(`${categoria.nombre}`);
              if (!categoria.eliminado) {
                  $("#btnEliminar").show();
                  $("#btnHabilitar").hide();
              }
          else{
              $("#btnEliminar").hide();
              $("#btnHabilitar").show();
          }

          $("#ModalCategoria").modal("show");
      }
      },
      error: function (xhr, status) {
          alert('Error al cargar categorias');
      },

      // código a ejecutar sin importar si la petición falló o no
      complete: function (xhr, status) {
          //alert('Petición realizada');
      }
  })
}
//BUSCAR CATEGORIA EDITTAR






function eliminarProducto() {

  //JAVASCRIPT
  let Id = $("#form-producto input[name='Productoid']").val();
  console.log(Id)
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

function EditarNombre(id) {
  // EditarNombre(${producto.id})
}