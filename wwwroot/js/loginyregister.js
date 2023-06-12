
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

// $(document).ready(function () {
//     $('#registerForm').submit(function (e) {
//         e.preventDefault(); // Evita el envío normal del formulario

//         // Serializa los datos del formulario en formato JSON
//         var formData = $(this).serialize();

//         // Realiza una solicitud Ajax al controlador de registro
//         $.ajax({
//             url: '/Account/Register',
//             type: 'POST',
//             data: formData,
//             success: function (response) {
//                 // Aquí puedes manejar la respuesta del servidor después de un registro exitoso
//                 console.log(response);
//             },
//             error: function (xhr, status, error) {
//                 // Aquí puedes manejar el error en caso de que ocurra
//                 console.error(error);
//             }
//         });
//     });
// });
     