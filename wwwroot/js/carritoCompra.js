window.onload = ProuctCart();

function AgregarAlDetalle(Id) {
    console.log("hola")
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
    let btnGuardar = $("#Guardarstock");
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
            if (Carrito.resultado.nonError) {
                console.log(Carrito);
                btnGuardar.show()
                carritoDiv.empty();
                $.each(Carrito.productos, function (index, producto) {
                    console.log("producto: " + producto + " indice: " + index);
                    carritoDiv.append(
                        
                        `
                        <div class="form-row imagen-div-carrito">
                        <header><td class="thcat"> <a class="btn btn-producto-cart carritonombre">${producto.nombre}</a></td></header>
                        <tr>
                        <body>
                        <td><img class="radio-carrito" src="data:${producto.tipoImagen};base64, ${producto.imagen}" style="width: 80px;" alt="${producto.nombre}"/></td>
                        <td><p class="cantidadcarrito" id="${producto.nombre}">Cantidad: ${Carrito.detalleCompra[index].cantidad} </p></td>
                        </body>
                        <footer>
                        <td><button class="btn botones-modalss" onclick="SubtQuantity(${producto.id},${Carrito.detalleCompra[index].cantidad})"><i class="fa-solid fa-minus"></i></button></td>
                        <td><button class="btn botones-modalss" onclick="PlusQuantity(${producto.id})"><i class="fa-solid fa-plus"></i></button></td>
                        </footer>
                        </tr>
                        
                        
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
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cancelado correctamente',
            showConfirmButton: false,
            timer: 1500
                    });
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