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
                let carritoDiv = $("#Cart-Contain");
                carritoDiv.empty();
                $("#ModalCarrito").modal("show");
                $.each(Carrito.productos, function (index, producto) {
                    console.log("producto: " + producto + " indice: " + index);
                    carritoDiv.append(`
                    <div class="producto">
                        <button onclick="RemoveDetail(${producto.id})">🗑</button>
                        <img src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 100px;" alt="${producto.nombre}"/>
                        <h3>${producto.nombre}</h3>
                        <button onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})">-</button><p id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad}</p><button>+</button>
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
function RemoveDetail(ProductID) {
    let Eliminar = confirm("Desea eliminar este producto del carrito de stock?")
    if (Eliminar) {
        $.ajax({
            url: '../../Carrito/RemoveDetail',
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
}