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
          TablaProducto.append(`
                        <tr class="">
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.precio}</a></td>
                            <td> <a class="btn btn-warning btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.cantidad}</a></td>
                            <td>
                            <img src="data:${producto.tipoImagen};base64, ${producto.ImagenString}" style="width: 40px;"/>
                            </td>
                        </tr>`);
        } else {
          TablaProducto.append(`
                        <tr class="">
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.nombreCategoria}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.nombre}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.precio}</a></td>
                            <td> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${producto.id})" role="button">${producto.cantidad}</a></td>
                            <td>
                            <img src="data:${producto.tipoImagen};base64, ${producto.ImagenString}" style="width: 40px;"/>
                            </td>
                        </tr>`);
        }
      })
    },
  })
}

function GuardarProducto(){
  $("#lbl-error").text("");
  let nombre = $("#form-producto input[name='Nombre']" ).val().toUpperCase();
  let precio = $("#form-producto input[name='Precio']").val();
  let cantidad = $("#form-producto input[name='Cantidad']").val();
  let categoriaId = $("#form-producto #Categoria").val();
  let imagen = $("#form-producto input[name='Imagen']").val();
  let formData = {
    Nombre: nombre,
    precio: precio,
    Cantidad: cantidad,
    CategoriaId: categoriaId,
    Imagen: imagen
  }
  console.log(formData);
}