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
           
        },
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

function ProductosEnCarrito() {
    
}