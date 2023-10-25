// Cuando la ventana se carga, se llama a la función BuscarProductos
window.onload = BuscarProductos();

// Esta función busca y muestra los productos disponibles en el catálogo
function BuscarProductos() {
  let ContainCards = $("#catalogo");
  ContainCards.empty();
  $.ajax({
    // URL para la petición AJAX que busca productos
    url: '../../Producto/BuscarProductos',
    // Datos a enviar (en este caso, no se envían datos)
    data: {},
    // Tipo de petición: GET en este caso
    type: 'GET',
    // Tipo de respuesta esperada: JSON
    dataType: 'json',
    // Función a ejecutar si la petición es exitosa
    success: function (productos) {
      let validacion = productos.Rol.validacion;
      // Iterar a través de los productos
      $.each(productos.Productos, function (index, producto) {
        if (!producto.eliminado) { // Si el producto no está eliminado
          if (producto.cantidad != 0) { // Si el producto tiene cantidad disponible
            ContainCards.append(`
            <div class="card mx-auto">
              ${producto.imagen == null
                ? `<img src="/img/productos/fotodefaullt.jpg" class="card-img-top" alt="Foto por defecto"/>`
                : `<img src="data:${producto.tipoImagen};base64, ${producto.imagenString}" class="card-img-top" alt="${producto.nombreCategoria} ${producto.nombre}"/>`
              }
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Precio: <b>$${producto.precio}</b></li>
                    <li class="list-group-item">${producto.nombreCategoria}</li>
                    ${
                      validacion ? 
                      `<li class="list-group-item text-center"><a onClick="AgregarAlPedido(${producto.id})" class="btn btn-marron"><i class="fa-solid fa-cart-plus"></i></a></li>` :
                      `<li class="list-group-item text-center"></li>`
                    }
                    
                </ul>
            </div>`)
          }
        }
      })
    }
  })
}