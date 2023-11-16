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
      let validacion = Catalogo[1].rol;
      console.log(validacion);
      $.each(Catalogo, (index, categoria) => {
        let ListaProductos = (``);
        let articulo = $(`<div class="Article"></div>`)
        let count = 1;
        $.each(categoria.productos, (index, producto) => {
          if (producto) {
            if (count <= 6) {
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
                    <li class="list-group-item text-center">${validacion ? `<a onClick="AgregarAlPedido(${producto.productoid})" class="btn btn-marron"><i class="fa-solid fa-cart-plus"></i></a>` : ``}</li>
                </ul>
              </div>
              `);
            }
              count++
          }
        })
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
                <footer class="footerBtn" onClick="BuscarProductosCategoria(${categoria.categoriaId})">
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
function BuscarProductosCategoria(categoriaId) {
  console.log(categoriaId);
  let CatalogoVista = $("#catalogo");
  CatalogoVista.empty();
  $.ajax({
    url: '../../Producto/BuscarProductos',
    data: {CategoriaId: categoriaId},
    type: 'GET',
    dataType: 'json',
    success: function (Catalogo){
      console.log(Catalogo);
      let validacion = Catalogo[0].rol;
      console.log(validacion);
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
                    <li class="list-group-item text-center">${validacion ? `<a onClick="AgregarAlPedido(${producto.productoid})" class="btn btn-marron"><i class="fa-solid fa-cart-plus"></i></a>` : ``}</li>
                </ul>
              </div>
              `);
          }
        })
        if (categoria.productos) {
            ListaProductos = (`
              <article class="ArticuloCategoria">
                <header id="HeaderCategoria" class="d-flex justify-content-between align-items-center">
                    <h2>${categoria.categoria}</h2>
                    <a onClick="BuscarProductos()" class="btn btn-danger">Cerrar</a>
                </header>
                <main class="CardsCategoria">
                ${articulo.html()}
                </main>
                <footer>
                </footer>
              </article>
            `)
        }
        CatalogoVista.append(ListaProductos);
      });
    }
  })
}


