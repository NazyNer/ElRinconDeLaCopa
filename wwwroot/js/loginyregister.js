
// Algoritmos de Animacion
document.getElementById("btn__iniciar-sesion").addEventListener("click", login);
document.getElementById("btn__registrarse").addEventListener("click", register);
window.addEventListener("resize" , anchopagina);
//Declaracion de Variables
var contenedor_login_register = document.querySelector(".contenedor__login-register");
var formulario_login = document.querySelector(".formulario__login");
var formulario_register = document.querySelector(".formulario__register");
var caja_trasera_login = document.querySelector(".caja__trasera-login");
var caja_trasera_register = document.querySelector(".caja__trasera-register");


function anchopagina(){     
    if(window.innerWidth > 850){
        caja_trasera_login.style.display = "block";
        caja_trasera_register.style.display = "block";
    }else{
        caja_trasera_register.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        formulario_register.style.display = "none"
        contenedor_login_register.style.left = "0px";
    }
}

anchopagina()


function login () {
    if(window.innerWidth > 850){
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "10px"
        formulario_login.style.display = "block"
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
    }else{
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "0px"
        formulario_login.style.display = "block"
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
    }
}

function register () {
    if(window.innerWidth > 850){
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "410px"
        formulario_login.style.display = "none"
        caja_trasera_register.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
    }else{
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "0px"
        formulario_login.style.display = "none"
        caja_trasera_register.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
    }
}
// /Algoritmos de Animacion

// funcion para registrarse en la pagina...
let btn_register = $("#btn-register");
btn_register.click(function(e) {
    e.preventDefault()
    console.log("Entre en la funcion");
    let email = $("#register-form input[name='email']").val();
    let password = $("#register-form input[name='password']").val();
    let retryPassword = $("#register-form input[name='retryPassword']").val();
    console.log("tome los valores ", email, password, retryPassword );
    if (password === retryPassword) {
        console.log("Adentro del if");
        var formData = {
            email: email,
            password: password
        }
        console.log("parceamos la data ", formData);
        console.log(JSON.stringify(formData))
        $.ajax({
              // la URL para la petición
                url: '/Account/Register',
              // la información a enviar
              // (también es posible utilizar una cadena de datos)
              contentType: 'application/x-www-form-urlencoded',
              // especifica si será una petición POST o GET
              method: 'POST',
              data: formData,
              // código a ejecutar si la petición es satisfactoria;
              // la respuesta es pasada como argumento a la función
              success: function(data) {
                if (data.success) {
                    // El usuario se registró correctamente
                    alert('Registro exitoso');
                    // Aquí puedes redirigir al usuario a otra página si lo deseas
                } else {
                    // Hubo errores durante el registro
                    alert('Error durante el registro: ' + data.errors.join(', '));
                }
              },
            //   error:function (xhr, status){}
            error: function(error) {
                // Manejar errores de la solicitud
                console.log(error);
            }
        })
    }
});