window.onload = ProductCart();

function MostrarPedido() {
    let carritoDiv = $("#Cart-Contain");
    let btnGuardar = $("#Guardarstock");
    let Total = $("#Total");
    let CarritoProductos = $("#CarritoProductos");
    let CarritoForm = $("#CarritoForm")
    let btnGuardarstock = $("#Guardarstock");
    let btnComprar = $("#GuardarCompra");
    $.ajax({
        url: '../../Pedido/AbrirCarrito',
        type: 'GET',
        dataType: 'json',
        success: function (Carrito) {
            console.log(Carrito);
            btnComprar.hide();
            if (Carrito.resultado.nonError) {
                btnGuardarstock.show();
                CarritoProductos.show();
                CarritoForm.hide();
                Total.show();
                btnGuardar.show();
                carritoDiv.empty();
                let totalPagar = 0;
                $.each(Carrito.productos, function (index, producto) {
                    carritoDiv.append(`
                    <div class="producto">
                        <h3>${producto.nombre}</h3>
                        ${
                            producto.imagen != null ?
                                `<img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/> <br>` :
                                `<img src="/img/productos/fotodefaullt.jpg" style="width: 100px;" alt="${producto.nombre}"/> <br>`
                            
                            
                        }
                        <button class="delete-button-carrito" onclick="RemoveDetail(${producto.id})"><i class="fa-solid fa-trash"></i></button> <br>
                        <h3 class="cantidadcarrito">Precio: $${producto.precioDeVenta}</h3>
                        <p class="cantidadcarrito" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p> 
                        <button class="delete-button-carrito" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button>
                        <button class="delete-button-carrito" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i></button>
                        <h2 class="cantidadcarrito">Subtotal: $${Carrito.detalleCompra[index].subtotal}</h2>
                    </div>
                    `)
                    totalPagar += Carrito.detalleCompra[index].subtotal;
                });
                Total.text("Total: $" + totalPagar);
                $("#ModalCarrito").modal("show");
            }
            else{
                CarritoProductos.show();
                CarritoForm.hide();
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
            else{
                NumberCart.text("")
            }
        }
    });
}
function SubtQuantity(ProductID, cantidad) {
    if (cantidad>1) {
        $.ajax({
            url: '../../Pedido/SubtQuantity',
            data: { ProductoID: ProductID },
            type: 'POST',
            success: function(resultado) {
                if (resultado.nonError) {
                    MostrarPedido();
                }else{
                    alert(resultado.msjError)
                }
            }
        });
    }
    else{
        RemoveDetail(ProductID);
    }
}

function PlusQuantity(ProductID) {
    $.ajax({
        url: '../../Pedido/PlusQuantity',
        data: { ProductoID: ProductID },
        type: 'POST',
        success: function(resultado) {
            if (resultado.nonError) {
                MostrarPedido();
            }else{
                alert(resultado.msjError)
            }
        }
    });
}

function RemoveDetail(ProductID) {
    let Eliminar = confirm("Desea eliminar este producto del carrito de stock?")
    if (Eliminar) {
        $.ajax({
            url: '../../Pedido/RemoveDetail',
            data: { ProductoID: ProductID },
            type: 'POST',
            success: function(resultado) {
                if (resultado.nonError) {
                    MostrarPedido();
                    ProductCart();
                }else{
                    alert(resultado.msjError)
                }
            }
        });
    }
}

function CompletePurchaseProduct() {
    let btnGuardarstock = $("#Guardarstock");
    let CarritoProductos = $("#CarritoProductos");
    let CarritoForm =$("#CarritoForm");
    let btnComprar = $("#GuardarCompra");
    let calle = $("#Calle");
    let numero = $("#Numero");
    let depto = $("#Depto");
    let caracteristica = $("#Caracteristica");
    let NumeroCel = $("#NumeroCelular");
    $.ajax({
        url: '../../Usuarios/BuscarNumeroUsuario',
        type: 'GET',
        success: function(Usuario){
            console.log(Usuario);
            if (Usuario.numero != null) {
                numero.val(Usuario.numero);
                calle.val(Usuario.calle);
                depto.val(Usuario.depto);
            }
            if (Usuario.numeroDeTelefono!= null) {
                let NumerocelJs = Usuario.numeroDeTelefono.split("");
                let caracteristicaJs = NumerocelJs.slice(0, -6).join("");
                NumerocelJs = NumerocelJs.slice(-6).join("");
                NumeroCel.val(NumerocelJs);
                caracteristica.val(caracteristicaJs);
            }
        }
    });
    calle.val("");
    numero.val("");
    depto.val("");
    btnGuardarstock.hide();
    CarritoProductos.hide();
    CarritoForm.show();
    btnComprar.show();
}
function CompletePurchase(){
    let calle = $("#Calle").val();
    let numero = $("#Numero").val();
    let depto = $("#Depto").val();
    let caracteristica = $("#Caracteristica").val();
    let NumeroCel = $("#NumeroCelular").val();
    let Gurdado = $("#SaveD")[0].checked;
    if (depto == "") {
        depto = "-1";
    }
    $.ajax({
        url: '../../Pedido/CompletePurchase',
        data: { Calle: calle, Numero: numero, Depto: depto, GuardarDatos: Gurdado, NumeroCelular: NumeroCel, Caracteristica: caracteristica},
        type: 'POST',
        success: function(resultado) {
            ProductCart();
            BuscarProductos();
            $("#ModalCarrito").modal("hide");
            alert(resultado.msjError);
        }
    });
}