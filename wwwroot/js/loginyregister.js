
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
btn_register.addEventListener("click", (e) => {
    e.preventDefault()
    let email = $("#register-form input[name='email']").val();
    let password = $("#register-form input[name='password']").val();
    let retryPassword = $("#register-form input[name='retryPassword']").val();
    let url = window.location.href
    $.ajax({
          // la URL para la petición
            url: '../../Identity/Account/Register/OnPostAsync',
          // la información a enviar
          // (también es posible utilizar una cadena de datos)
            data:{
            Email: email,
            Password: password,
            RetryPassword: retryPassword, 
            returnUrl: url,
        },
          // especifica si será una petición POST o GET
          type: 'POST',
          // el tipo de información que se espera de respuesta
          dataType: 'json',
          // código a ejecutar si la petición es satisfactoria;
          // la respuesta es pasada como argumento a la función
          success: function name(params) {
            
          },
          error:function (xhr, status){}
    })
});