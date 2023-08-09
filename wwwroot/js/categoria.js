window.onload = BuscarCategorias();
function CrearNueva() {
    $("#Id").val(`0`)
    $("#ModalCategoria").modal("show");
    $("#h1Categoria").text("Crear Categoria");
    $("#form-categoria input[name='Nombre']").val("")
    $("#lbl-error").text("");
    $("#btnEliminar").hide();
    $("#btnHabilitar").hide();
    $("#btn-crear").show();
    $("#btn-crear").text("Crear");
}
function BuscarCategorias() {
    $("#btnEliminar").hide();
    let TablaCategoria = $("#tbody-categorias");
    TablaCategoria.empty();
    $.ajax({
        // la URL para la petición
        url: '../../Categoria/BuscarCategorias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (categorias) {
            TablaCategoria.empty();
            $.each(categorias, function (index, categoria) {

                if (categoria.eliminado) {
                    TablaCategoria.append(`
                            <tr class="">
                                <td> <a class="btn btn-warning btn-sm" onClick="BuscarCategoria(${categoria.id})" role="button">${categoria.nombre}</a></td>
                                <td> <button onClick="RemoveCategoria(${categoria.id})"><i class="fa-regular fa-trash-can" style="color: #be540e;"></i></button></td>
                            </tr>`);
                } else {
                    TablaCategoria.append(`
                            <tr class="">
                                <td> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${categoria.id})" role="button">${categoria.nombre}</a></td>
                                <td> <button onClick="RemoveCategoria(${categoria.id})"><i class="fa-regular fa-trash-can" style="color: #be540e;"></i></button></td>
                            </tr>`);
                }
            })

        },
    })
}
function BuscarCategoria(Id) {
    $("#lbl-error").text("");
    $.ajax({
        // la URL para la petición
        url: '../../Categoria/BuscarCategorias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { Id: Id },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        success: function (Categoria) {
            if (Categoria.length == 1) {
                let categoria = Categoria[0];
                $("#lbl-error").text("");
                $("#h1Categoria").text("Editar Categoria");
                $("#Id").val(`${Categoria[0].id}`);
                $("#form-categoria input[name='Nombre']").val(`${categoria.nombre}`);
                if (!categoria.eliminado) {
                    $("#btnEliminar").show();
                    $("#btnHabilitar").hide();
                    $("#btn-crear").show();
                    $("#btn-crear").text("Editar");
                }
                else {
                    $("#btnEliminar").hide();
                    $("#btnHabilitar").show();
                    $("#btn-crear").hide();
                }

                $("#ModalCategoria").modal("show");
            }
        },
        error: function (xhr, status) {
            alert('Error al cargar categorias');
        },

        // código a ejecutar sin importar si la petición falló o no
        complete: function (xhr, status) {
            //alert('Petición realizada');
        }
    })
}
function GuardarCategoria() {
    let Id = $("#Id").val();
    let Nombre = $("#form-categoria input[name='Nombre']").val().toUpperCase();
    $.ajax({
        // la URL para la petición
        url: '../../Categoria/GuardarCategoria',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { id: Id, nombre: Nombre },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (resultado) {
            if (resultado.nonError) {
                $("#ModalCategoria").modal("hide");
                BuscarCategorias();
            }
            else {
                $("#lbl-error").text(resultado.msjError);
            }
        },
        error: function (xhr, status) {
            alert('Error al cargar categorias');
        },

        // código a ejecutar sin importar si la petición falló o no
        complete: function (xhr, status) {
            //alert('Petición realizada');
        }
    });
}

function eliminarCategoria() {
    //JAVASCRIPT
    let Id = $("#Id").val();
    $.ajax({
        // la URL para la petición
        url: '../../Categoria/eliminarCategoria',
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
                $("#ModalCategoria").modal("hide");
                BuscarCategorias();
            }
            else {
                $("#lbl-error").text(resultado.msjError);
            }
        },
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
            $("#ModalCategoria").modal("hide");
            BuscarCategorias();
        }
    });
}

function RemoveCategoria(Id) {
    $.ajax({
        // la URL para la petición
        url: '../../Categoria/removeCategoria',
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
                alert(resultado.msjError)
                BuscarCategorias();
            }
            else {
                alert(resultado.msjError);
            }
        },
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
            $("#ModalCategoria").modal("hide");
            BuscarCategorias();
        }
    });
};
$("#textoInput").on("input", function () {
    var input = $(this);
    var startPosition = input[0].selectionStart;  // Guardar la posición del cursor

    input.val(input.val().toUpperCase());  // Convertir texto a mayúsculas

    input[0].setSelectionRange(startPosition, startPosition);  // Restaurar la posición del cursor
});