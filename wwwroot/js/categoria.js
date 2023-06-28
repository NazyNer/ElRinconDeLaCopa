let btnCrear = $("#btn-crear");
btnCrear.click(function (e) {
    e.preventDefault();
    console.log("aqui estoy")
    let nombre = $("#form-categoria input[name='Nombre']").val().toUpperCase();
    console.log("Capte el nombre ", nombre);
    $.ajax({
        url: '../../Categoria/Create',
        method: 'POST',
        data: {Nombre: nombre},
        success: function (data) {
            if (data.success) {
                // El inicio de sesión fue exitoso
                alert('Se cargo la categoria exitosamente');
                // Aquí puedes redirigir al usuario a otra página si lo deseas
            } else {
                // Hubo errores durante el inicio de sesión
                alert('Error al cargar categoria: ' + data.error);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});