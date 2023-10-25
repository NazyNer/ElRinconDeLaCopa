// Cuando la ventana se carga, se llama a la función ProductCart
window.onload = ProductCart();

// Esta función agrega un producto al detalle de compra
function AgregarAlDetalle(Id) {
    $.ajax({
        url: '../../Producto/AgregarDetalle',
        data: { Id: Id },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            console.log("godines")
            if (resultado.nonError) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Producto agregado al carrito!',
                    showConfirmButton: false,
                    timer: 1500
                            })
                ProuctCart();
            }else{
                alert(resultado.msjError);
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

// <img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/> <br> 
// Esta función abre el carrito de compras
function AbrirCarrito() {
    let carritoDiv = $("#Cart-Contain");
    let btnGuardar = $("#Guardarstock");
    $.ajax({
        url: '../../Carrito/AbrirCarrito',
        type: 'GET',
        dataType: 'json',
        success: function (Carrito) {
            if (Carrito.resultado.nonError) {
                btnGuardar.show();
                carritoDiv.empty();
                $.each(Carrito.productos, function (index, producto) {
                    carritoDiv.append(
                        
                        `
                        <div class="form-row imagen-div-carrito">
                        <header>
                        <td class="thcat"> <a class="btn btn-producto-cart carritonombre producto-name">${producto.nombre}</a></td>
                        </header>
                        <tr>
                        <body>

                        <td><img class="radio-carrito" src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 120px;" alt="${producto.nombre}"/></td>
                        <td><p class="cantidadcarrito carritonombre" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p></td>

                        </body>
                        </tr>
                        <footer>
                        <td><button class="btn botones-modals-carrito" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button></td>
                        <td><button class="btn botones-modals-carrito" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i></button></td>
                        </footer>
                        
                        
                        </div>
                        `
                    //(
                     //`  
                        //<tr>
                       // <td class="thcat back"> <a class="btn btn-producto-cart">${producto.nombre}</a></td>
                       // <td><img class="radio" src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 40px;" alt="${producto.nombre}"/></td>
                       // <td><p class="cantidadcarrito" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p></td>
                            //<td><button class="btn botones-modalss" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button></td>
                            //<td><button class="btn botones-modalss" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i></button></td>
                        //</tr>
                        
                        //`
                        
                        )
                    
                });
                $("#ModalCarrito").modal("show");
            }
            else{
                // console.log(Carrito.resultado);
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'No hay productos en el carrito',
                    showConfirmButton: false,
                    timer: 1500
                            })
                carritoDiv.empty();
                carritoDiv.append(`<h1 style="color: white;">${Carrito.resultado.msjError}</h1>`)
                btnGuardar.hide()
                // $("#ModalCarrito").modal("show");
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

// Esta función incrementa la cantidad de un producto en el carrito
function PlusQuantity(ProductID) {
    $.ajax({
        url: '../../Carrito/PlusQuantity',
        data: { IdProducto: ProductID },
        type: 'POST',
        success: function (resultado) {
            if (resultado.nonError) {
                AbrirCarrito();
            } else {
                alert(resultado.msjError);
            }
        }
    });
}

// Esta función reduce la cantidad de un producto en el carrito
function SubtQuantity(ProductID, cantidad) {
    if (cantidad > 1) {
        $.ajax({
            url: '../../Carrito/SubtQuantity',
            data: { IdProducto: ProductID },
            type: 'POST',
            success: function (resultado) {
                if (resultado.nonError) {
                    AbrirCarrito();
                } else {
                    alert(resultado.msjError);
                }
            }
        });
    } else {
        RemoveDetail(ProductID);
    }
}

// Esta función elimina un producto del carrito
function RemoveDetail(ProductID) {
    let Eliminar = confirm("¿Desea eliminar este producto del carrito de stock?");
    if (Eliminar) {
        $.ajax({
            url: '../../Carrito/RemoveDetail',
            data: { IdProducto: ProductID },
            type: 'POST',
            success: function (resultado) {
                if (resultado.nonError) {
                    ProductCart();
                    AbrirCarrito();
                } else {
                    alert(resultado.msjError);
                }
            }
        });
    }
}

// Esta función completa la compra
function CompletePurchase() {
    let verificacion = confirm("¿Seguro de completar esta compra (la cantidad de cada producto va a ser agregada al stock de cada uno correspondientemente)?");
    if (verificacion) {
        let carritoDiv = $("#Cart-Contain");
        $.ajax({
            url: '../../Carrito/CompletePurchase',
            type: 'GET',
            dataType: 'json',
            success: function (resultado) {
                if (resultado.nonError) {
                    ProductCart();
                    carritoDiv.empty();
                    $("#ModalCarrito").modal("hide");
                    alert(resultado.msjError);
                    BuscarProductos();
                } else {
                    alert(resultado.msjError);
                    BuscarProductos();
                }
            }
        });
    }else{
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cancelado correctamente',
            showConfirmButton: false,
            timer: 1500
                    });
    }
}

// Esta función muestra la cantidad de productos en el carrito
function ProductCart() {
    let NumberCart = $("#ProductCart");
    NumberCart.text("");
    $.ajax({
        url: '../../Carrito/ProductCart',
        type: 'GET',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != 0) {
                NumberCart.text(resultado);
            } else {
                NumberCart.text("");
            }
        }
    });
}