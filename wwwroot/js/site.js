function buscarRol() {
  $.ajax({
    url: '/Account/Rol',
        method: 'GET',
        success: function (rol) {
          $("#Rol").val(rol);
        },
        error: function (error) {
            console.log(error);
        }
  });
}
