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
          tabla.append(`
          <tr class="">
            <td>${usuario.Nombre}</td>
            <td>${usuario.Email}</td>
            <td class="tdRol">
              <input type="number" disabled id="idUsuario" placeholder="${usuario.Id}">
              <select class="select-element">
                ${usuarios.Roles.map((rol, index)=>(
                  rol.id == usuario.rolID ? `<option value='${rol.name}' selected>${rol.name}</option>` : `<option value='${rol.name}'>${rol.name}</option>`
                ))}
              </select>
            </td>
          </tr>
          `)
        }
      });
      const selectElements = $("#tbody-usuarios tr td.tdRol");
      // Agrega un controlador de eventos "change" a cada elemento select
      selectElements.map((indice, td) => {
        console.log(td.children);
          let idUsuario = td.children.idUsuario.placeholder;
          let select = td.children[1];
          select.addEventListener('change', function() {
            // Aquí puedes acceder al elemento select que ha cambiado
            console.log('El select que ha cambiado es:', select);
          });
      }) 
    }
  });
  // const selectElements = $("#tbody-usuarios");
  // // Agrega un controlador de eventos "change" a cada elemento select
  // console.log(selectElements);
  // selectElements.forEach(function(select) {
  //   console.log(select);
  //     select.addEventListener('change', function() {
  //         // Aquí puedes acceder al elemento select que ha cambiado
  //         console.log('El select que ha cambiado es:', select);
  //     });
  // });
}

