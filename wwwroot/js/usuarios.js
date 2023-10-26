window.onload = CompletarTabla();

function CompletarTabla() {
  var tabla = $("#tbody-usuarios");
  $.ajax({
    url: '../../Usuarios/CompletarTabla',
    type: 'GET',
    dataType: 'json',
    success: function (usuarios) {
      tabla.empty();
      $.each(usuarios, function (i, usuario) {
        if(i != "Roles"){
          if (usuario.Email != "admin@delacopa.com") {
            tabla.append(`
            <tr class="">
            <td> <a class="btn boton-none"  role="button">${usuario.Nombre}</a></td>
            <td> <a class="btn boton-none"  role="button">${usuario.Email}</a></td>
              <td class="tdRol">
                <input type="number" disabled id="idUsuario" placeholder="${usuario.Id}">
                <select class="select-element boton-yes">
                  ${usuarios.Roles.map((rol, index)=>(
                    rol.id == usuario.rolID ? `<option value='${rol.name}' selected>${rol.name}</option>` : `<option value='${rol.name}'>${rol.name}</option>`
                  ))}
                </select>
              </td>
            </tr>
            `)
          }
        }
      });
      const selectElements = $("#tbody-usuarios tr td.tdRol");
      // Agrega un controlador de eventos "change" a cada elemento select
      selectElements.map((indice, td) => {
          let idUsuario = td.children.idUsuario.placeholder;
          let select = td.children[1];
          select.addEventListener('change', function() {
            // Aquí puedes acceder al elemento select que ha cambiado
            let rolElegido = this.value;
            $.ajax({
              url: '../../Usuarios/CambiarRol',
              type: 'POST',
              data:{UsuarioID: idUsuario, RolName: rolElegido},
              dataType: 'json',
              success: function(resultado) {
                console.log(resultado);
                if (resultado.nonError) {
                  CompletarTabla();
                }
              }
            })
          });
      }) 
    }
  });
}

