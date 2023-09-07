window.onload = BuscarCategorias();
function CrearNueva() {
    $("#Id").val(`0`)
    $("#ModalCategoria").modal("show");
    $("#h1Categoria").text("C A T E G O R I A");
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
                            <tr class="bg-danger">
                                <td> <a class=" btn btn-producto-cart" onClick="BuscarCategoria(${categoria.id})" role="button">${categoria.nombre}</a></td>
                                <td class="tdbasura"> 
                                <button class="delete-button btn btn-producto-cart" onClick="RemoveCategoria(${categoria.id})"> 
                                <i class="fa-solid fa-trash"></i>
                                </button>
                                </td>
                            </tr>`);
                } else {
                    TablaCategoria.append(`
                            <tr class="fondo-tabla">
                                <td> <a class="btn btn-producto-cart" onClick="BuscarCategoria(${categoria.id})" role="button">${categoria.nombre}</a></td>
                                <td class="tdbasura"> 
                                <button class="delete-button btn btn-producto-cart" onClick="RemoveCategoria(${categoria.id})"> 
                                <i class="fa-solid fa-trash"></i>
                                </button>
                                </td>
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
                $("#h1Categoria").text("E D I T A R");
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
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Categoria Creada',
                    showConfirmButton: false,
                    timer: 1500
                            })
                $("#ModalCategoria").modal("hide");
                BuscarCategorias();
            }
            else {
                // $("#lbl-error").text(resultado.msjError);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Es necesario rellenar todos los campos!',
                    showConfirmButton: false,
                    timer: 1500
                            })
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
                // $("#lbl-error").text(resultado.msjError);
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Primero deshabilite los productos relacionados!',
                    showConfirmButton: false,
                    timer: 1500
                            })
                
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
                // alert(resultado.msjError)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Categoria eliminada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                            })
                BuscarCategorias();
            }
            else {
                // alert(resultado.msjError);
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Esta categoría tiene productos relacionados',
                    showConfirmButton: false,
                    timer: 1500
                            })
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

