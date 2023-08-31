window.onload = ProuctCart();

function AgregarAlDetalle(Id) {
    //llamar al controlador
    $.ajax({
        // la URL para la petición
        url: '../../Producto/AgregarDetalle',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { Id: Id },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (resultado) {
            if (resultado.nonError) {
                ProuctCart()
                alert("Producto agregado al carrito");
            }else{
                alert(resultado.msjError);
            }
        },
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

function AbrirCarrito(){
    let carritoDiv = $("#Cart-Contain");
    $.ajax({
        // la URL para la petición
        url: '../../Carrito/AbrirCarrito',
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (Carrito) {
            if (Carrito.resultado) {
                console.log(Carrito);
                carritoDiv.empty();
                $("#ModalCarrito").modal("show");
                $.each(Carrito.productos, function (index, producto) {
                    console.log("producto: " + producto + " indice: " + index);
                    carritoDiv.append(`
                    <div class="producto">
                        <button onclick="RemoveDetail(${producto.id})">🗑</button>
                        <img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/>
                        <h3>${producto.nombre}</h3>
                        <button onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})">-</button><p id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad}</p><button onclick="PlusQuantity(${producto.id})">+</button>
                    </div>
                    `)
                });
            }
        },
        // código a ejecutar si la petición falla;
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

//Funcion para sumar 1 a la cantidad del producto
function PlusQuantity(ProductID){
    $.ajax({
        url: '../../Carrito/PlusQuantity',
        data: { IdProducto: ProductID },
        type: 'POST',
        success: function(resultado) {
            if (resultado.nonError) {
                AbrirCarrito();
            }else{
                alert(resultado.msjError)
            }
        }
    });
}

//Funcion para restar 1 a la cantidad del producto
function SubtQuantity(ProductID, cantidad){
    if (cantidad>1) {
        $.ajax({
            url: '../../Carrito/SubtQuantity',
            data: { IdProducto: ProductID },
            type: 'POST',
            success: function(resultado) {
                if (resultado.nonError) {
                    AbrirCarrito();
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

//funcion para eliminar el producto del carrito
function RemoveDetail(ProductID) {
    let Eliminar = confirm("Desea eliminar este producto del carrito de stock?")
    if (Eliminar) {
        $.ajax({
            url: '../../Carrito/RemoveDetail',
            data: { IdProducto: ProductID },
            type: 'POST',
            success: function(resultado) {
                if (resultado.nonError) {
                    ProuctCart();
                    AbrirCarrito();
                }else{
                    alert(resultado.msjError)
                }
            }
        });
    }
}

//Funcion para completar la compra
function CompletePurchase(){
    let verificacion = confirm("Seguro de completar esta compra(la cantidad de cada producto va ser agregada al stock de cada uno correspondientemente)");
    if (verificacion) {
        let carritoDiv = $("#Cart-Contain");
        $.ajax({
            url: '../../Carrito/CompletePurchase',
            type: 'GET',
            dataType: 'json',
            success: function(resultado) {
                if (resultado.nonError) {
                    ProuctCart();
                    carritoDiv.empty();
                    $("#ModalCarrito").modal("hide");
                    alert(resultado.msjError)
                }else{
                    alert(resultado.msjError)
                }
            }
        });
    }else{
        alert("Cancelado correctamente");
    }
}

function ProuctCart() {
    let NumberCart = $("#ProductCart");
    NumberCart.text("")
    $.ajax({
        url: '../../Carrito/ProuctCart',
        type: 'GET',
        dataType: 'json',
        success: function(resultado) {
            if (resultado != 0) {
                NumberCart.text(resultado)
            }
        }
    });
}