window.onload = BuscarProductos();

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
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.cantidad}</a></td>
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
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarProducto(${producto.id})" role="button">${producto.cantidad}</a></td>
                            <td>
                            <img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" style="width: 0px;"/>
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
      if (resultado) {
        $("#ModalProducto").modal("hide");
        BuscarProductos();
      }
      else {
        $("#texto-error").text("Existe una Categoría con la misma descripción.");
      }
    },
    cache: false,
    contentType: false,
    processData: false
  });
}
function BuscarProducto(ID){
  console.log(ID)
  $.ajax({
    // la URL para la petición
    url: '../../Producto/BuscarProductos',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {Id: ID},
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
        $("#h1Producto").text("Editar producto")
        $("#ID").val(producto.id);
        $("#btnCrear").text("Editar");
      }
    },
  })

}