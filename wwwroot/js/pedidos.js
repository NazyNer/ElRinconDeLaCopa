window.onload = ProductCart();
function MostrarPedido() {
    let carritoDiv = $("#Cart-Contain");
    let btnGuardar = $("#Guardarstock");
    let Total = $("#Total");
    $.ajax({
        url: '../../Pedido/AbrirCarrito',
        type: 'GET',
        dataType: 'json',
        success: function (Carrito) {
            if (Carrito.resultado.nonError) {
                Total.show()
                btnGuardar.show()
                carritoDiv.empty();
                let totalPagar = 0;
                $.each(Carrito.productos, function (index, producto) {
                    carritoDiv.append(`
                    <div class="producto">
                        <h3>${producto.nombre}</h3>
                        <img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/> <br> 
                        <button class="delete-button-carrito" onclick="RemoveDetail(${producto.id})"><i class="fa-solid fa-trash"></i></button> <br>
                        <p class="cantidadcarrito">Precio: $${producto.precio}</p>
                        <p class="cantidadcarrito" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p> 
                        <button class="delete-button-carrito" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button>
                        <button class="delete-button-carrito" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i></button>
                        <p class="cantidadcarrito">Subtotal: $${Carrito.detalleCompra[index].subtotal}</p>
                    </div>
                    `)
                    totalPagar += Carrito.detalleCompra[index].subtotal;
                });
                Total.text("Total: $" + totalPagar);
                $("#ModalCarrito").modal("show");
            }
            else{
                console.log(Carrito.resultado);
                Total.text("")
                Total.hide()
                carritoDiv.empty();
                carritoDiv.append(`<h1 style="color: white;">${Carrito.resultado.msjError}</h1>`)
                btnGuardar.hide()
                $("#ModalCarrito").modal("show");
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}
function AgregarAlPedido(Id){
    $.ajax({
        url: '../../Pedido/AgregarDetalle',
        data: { id: Id },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.nonError) {
                ProductCart();
                alert("Producto agregado al carrito");
            }else{
                alert(resultado.msjError);
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}
function ProductCart() {
    let NumberCart = $("#Cart");
    $.ajax({
        url: '../../Pedido/ProductCart',
        type: 'GET',
        dataType: 'json',
        success: function(resultado) {
            if (resultado != 0) {
                NumberCart.text(resultado)
            }
        }
    });
}
function CompletePurchase(){
    console.log("Compra completa");
}