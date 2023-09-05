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
            if (resultado.nonError) {
                ProductCart();
                alert("Producto agregado al carrito");
            } else {
                alert(resultado.msjError);
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

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
                    carritoDiv.append(`
                    <div class="producto">
                        <h3>${producto.nombre}</h3>
                        <img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/> <br> 
                                
                        <button class="delete-button-carrito" onclick="RemoveDetail(${producto.id})"><i class="fa-solid fa-trash"></i></button> <br>
                        <p class="cantidadcarrito" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p> 
                        <button class="delete-button-carrito" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button>
                        <button class="delete-button-carrito" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i> </button>
                    </div>
                    `);
                });
                $("#ModalCarrito").modal("show");
            } else {
                carritoDiv.empty();
                carritoDiv.append(`<h1 style="color: white;">${Carrito.resultado.msjError}</h1>`);
                btnGuardar.hide();
                $("#ModalCarrito").modal("show");
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
    } else {
        alert("Compra cancelada correctamente");
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