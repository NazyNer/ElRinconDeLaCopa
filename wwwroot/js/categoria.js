// Esta función se ejecuta cuando la ventana se carga por completo
window.onload = BuscarCategorias();
var ArregloEnteroCategorias = [];
var CantidadDeDatos = 5;
var ultimaPagina = 1;
// Esta función se llama cuando se quiere crear una nueva categoría
function CrearNueva() {
    // Establecer valores iniciales en el formulario de categoría
    $("#Id").val(`0`);
    $("#ModalCategoria").modal("show");
    $("#h1Categoria").text("Crear Categoría");
    $("#form-categoria input[name='Nombre']").val("")
    $("#lbl-error").text("");
    $("#btnEliminar").hide();
    $("#btnHabilitar").hide();
    $("#btn-crear").show();
    $("#btn-crear").text("Crear");
}

function BuscarCategoriaPorNombre(){
    let Buscador = $("#NombreCategoria").val();
    if (Buscador.length >= 2) {
        ArregloEnteroCategorias = ArregloEnteroCategorias.filter(categoria => categoria.nombre.includes(Buscador.toUpperCase()));
        ultimaPagina = Math.ceil(ArregloEnteroCategorias.length / CantidadDeDatos);
        console.log(ultimaPagina);
        Paginacion(1, ultimaPagina)
    }else{
        ultimaPagina = Math.ceil(ArregloEnteroCategorias.length / CantidadDeDatos);
        Paginacion(1, ultimaPagina)
    }
    BuscarCategorias(1, ultimaPagina)
}
function Paginacion(pagina, UltimaPagina = ultimaPagina) {
    let PaginaActiva = $("#PaginaActiva");
    let btnAnterior = $("#PaginaAnterior");
    let btnSiguiente = $("#PaginaSiguiente");
    PaginaActiva.text(pagina), ultimaPagina;
    if (pagina == 1) {
        btnAnterior.attr("disabled", true);
        btnSiguiente.attr("disabled", false);
        if (pagina >= UltimaPagina) {
            btnSiguiente.attr("disabled", true);
        }
        btnSiguiente.attr("onclick", `BuscarCategorias(${pagina + 1})`);
    }else{
        btnAnterior.attr("disabled", false);
        btnSiguiente.attr("disabled", false);
        btnAnterior.attr("onclick", `BuscarCategorias(${pagina - 1})`);
        btnSiguiente.attr("onclick", `BuscarCategorias(${pagina + 1})`);
        if (pagina >= UltimaPagina) {
            btnSiguiente.attr("disabled", true);
        }
    }
}
// Esta función busca y muestra todas las categorías
function BuscarCategorias(pagina = 1, UltimaPagina = ultimaPagina) {
    let Buscador = $("#NombreCategoria").val();
    
    $("#btnEliminar").hide();
    let TablaCategoria = $("#tbody-categorias");
    TablaCategoria.empty();
    // Realizar una solicitud AJAX para obtener las categorías
    $.ajax({
        url: '../../Categoria/BuscarCategorias',
        data: {},
        type: 'GET',
        dataType: 'json',
        success: function (categorias) {
            ArregloEnteroCategorias = categorias;
            TablaCategoria.empty();
            if (Buscador.length >= 2) {
                ArregloEnteroCategorias = ArregloEnteroCategorias.filter(categoria => categoria.nombre.includes(Buscador.toUpperCase()));
                ultimaPagina = Math.ceil(ArregloEnteroCategorias.length / CantidadDeDatos);
            }else{
                ultimaPagina = Math.ceil(ArregloEnteroCategorias.length / CantidadDeDatos);
            }
            Paginacion(pagina, ultimaPagina)
            var InicioDeTabla = (pagina - 1) * CantidadDeDatos;
            var FinDeLaTabla = InicioDeTabla + CantidadDeDatos;
            ultimaPagina = Math.ceil(ArregloEnteroCategorias.length / CantidadDeDatos);
            // Iterar a través de las categorías y mostrarlas en una tabla
            $.each(ArregloEnteroCategorias.slice(InicioDeTabla, FinDeLaTabla), function (index, categoria) {
                if (categoria.eliminado) {
                    // Mostrar categorías eliminadas de manera diferente
                    TablaCategoria.append(`
                    <tr class="tabla-eliminada">
                    <td> <a class="btn btn-cat" role="button">${categoria.nombre}</a></td>
                    <td class="Botones-max-width"> 
                    <button class="botones-modals" onClick="RemoveCategoria(${categoria.id})"> 
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    <button  class="botones-modals" onClick="BuscarCategoria(${categoria.id})"> 
                    <i class="fa-solid fa-gear"></i>
                    </button>
                    </td>
                </tr>`);
                } else {
                    TablaCategoria.append(`
                            <tr class="fondo-tabla">
                                <td> <a class="btn btn-cat" role="button">${categoria.nombre}</a></td>
                                <td class="Botones-max-width"> 
                                <button class="botones-modals" onClick="RemoveCategoria(${categoria.id})"> 
                                <i class="fa-solid fa-trash"></i>
                                </button>
                                <button  class="botones-modals" onClick="BuscarCategoria(${categoria.id})"> 
                                <i class="fa-solid fa-gear"></i>
                                </button>
                                </td>
                            </tr>`);
                }
            })
        },
    })
}

// Esta función busca una categoría específica por ID
function BuscarCategoria(Id) {
    $("#lbl-error").text("");

    // Realizar una solicitud AJAX para obtener la categoría por ID
    $.ajax({
        url: '../../Categoria/BuscarCategorias',
        data: { Id: Id },
        type: 'GET',
        dataType: 'json',
        success: function (Categoria) {
            if (Categoria.length == 1) {
                let categoria = Categoria[0];
                $("#lbl-error").text("");
                $("#h1Categoria").text("Editar Categoría");
                $("#Id").val(`${Categoria[0].id}`);
                $("#form-categoria input[name='Nombre']").val(`${categoria.nombre}`);
                if (!categoria.eliminado) {
                    $("#btnEliminar").show();
                    $("#btnHabilitar").hide();
                    $("#btn-crear").show();
                    $("#btn-crear").text("Editar");
                } else {
                    $("#btnEliminar").hide();
                    $("#btnHabilitar").show();
                    $("#btn-crear").hide();
                }
                $("#ModalCategoria").modal("show");
            }
        },
        error: function (xhr, status) {
            alert('Error al cargar categorías');
        },
    })
}

// Esta función guarda una nueva categoría o actualiza una existente
function GuardarCategoria() {
    let Id = $("#Id").val();
    let Nombre = $("#textoInput").val().toUpperCase();
    if (Nombre === "") {
        // alert("El campo de nombre está vacío. Por favor, ingrese un nombre válido.");
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'El campo de nombre está vacío. Por favor, ingrese un nombre válido.',
            showConfirmButton: false,
            timer: 1500
                    })
        return; // Detener la función si el campo está vacío
    }
    $.ajax({
        url: '../../Categoria/GuardarCategoria',
        data: { id: Id, nombre: Nombre},
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if(Id == 0){
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
                    else{
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Ya existe una categoría con ese nombre',
                            showConfirmButton: false,
                            timer: 1500
                                    })
                    }
            }
            else
            {
                if(resultado.nonError){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Categoria Editada',
                        showConfirmButton: false,
                        timer: 1500
                                })
                    $("#ModalCategoria").modal("hide");
                    BuscarCategorias();
                }
                else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ha sido imposible editar, ya que ya existe una categoría con ese nombre',
                        showConfirmButton: false,
                        timer: 1500
                                })
                }

            }
            
        },
        error: function (xhr, status) {
            alert('Error al cargar categorías');
        },
    });
}

// Esta función elimina una categoría
function eliminarCategoria() {
    let Id = $("#Id").val();

    // Realizar una solicitud AJAX para eliminar la categoría
    $.ajax({
        url: '../../Categoria/eliminarCategoria',
        data: { Id: Id },
        type: 'POST',
        dataType: 'json',
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
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
            $("#ModalCategoria").modal("hide");
            BuscarCategorias();
        }
    });
}

// Esta función remueve una categoría
function RemoveCategoria(Id) {
    // Realizar una solicitud AJAX para remover la categoría
    $.ajax({
        url: '../../Categoria/removeCategoria',
        data: { Id: Id },
        type: 'POST',
        dataType: 'json',
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
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
            $("#ModalCategoria").modal("hide");
            BuscarCategorias();
        }
    });
}

// Esta función convierte el texto de entrada en mayúsculas mientras se escribe
$("#textoInput").on("input", function () {
    var input = $(this);
    var startPosition = input[0].selectionStart;
    input.val(input.val().toUpperCase());
    input[0].setSelectionRange(startPosition, startPosition);
});
