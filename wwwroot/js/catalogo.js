// Cuando la ventana se carga, se llama a la función BuscarProductos
window.onload = BuscarProductos();

function BuscarProductos() {
  let CatalogoVista = $("#catalogo");
  CatalogoVista.empty();
  $.ajax({
    url: '../../Producto/BuscarProductos',
    data: {},
    type: 'GET',
    dataType: 'json',
    success: function (Catalogo) {
      let validacion = Catalogo[0].rol;
      $.each(Catalogo, (index, categoria) => {
        let ListaProductos = (``);
        let articulo = $(`<div class="Article"></div>`)
        $.each(categoria.productos, (index, producto) => {
          if (producto) {
              articulo.append(`
              <div class="card mx-auto">
                ${producto.imagen == null
                  ? `<img src="/img/productos/fotodefaullt.jpg" class="card-img-top" alt="Foto por defecto"/>`
                  : `<img src="data:${producto.tipoImagen};base64, ${producto.imagen}" class="card-img-top" alt="${producto.nombreCategoria} ${producto.nombre}"/>`
                }
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Precio: <b>$${producto.precio}</b></li>
                    <li class="list-group-item">${categoria.categoria}</li>
                    <li class="list-group-item text-center"><a onClick="AgregarAlPedido(${producto.productoid})" class="btn btn-marron"><i class="fa-solid fa-cart-plus"></i></a></li>
                </ul>
              </div>
              `);
          }
        })
        console.log(categoria.productos);
        if (categoria.productos) {
          if (categoria.productos.length <= 6) {
            ListaProductos = (`
              <article class="ArticuloCategoria">
                <header id="HeaderCategoria">
                    <h2>${categoria.categoria}</h2>
                </header>
                <main class="Cards">
                ${articulo.html()}
                </main>
                <footer>
                </footer>
              </article>
            `)
          }else{
            ListaProductos = (`
              <article class="ArticuloCategoria">
                <header id="HeaderCategoria">
                    <h2>${categoria.categoria}</h2>
                </header>
                <main class="Cards">
                ${articulo.html()}
                </main>
                <footer>
                    <p class="text-center">
                        Mas Productos <br>
                    <i class="fa-solid fa-angles-down"></i>
                    </p>
                </footer>
              </article>
            `)
          }
        }
        CatalogoVista.append(ListaProductos);
      });
    }
  })
}

