window.onload = BuscarProductos();

function BuscarProductos() {
  let ContainCards = $("#catalogo");
  ContainCards.empty();
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
      $.each(productos, function (index, producto) {
        console.log(producto);
        if (!producto.eliminado) {
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
                  <li class="list-group-item text-center"><a class="btn btn-marron"><i class="fa-solid fa-cart-plus"></i></a></li>
              </ul>
          </div>`)
        }
      })
    }
  })
}