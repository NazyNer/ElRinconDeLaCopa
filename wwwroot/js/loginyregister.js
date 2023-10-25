// Algoritmos de Animación

// Evento para mostrar el formulario de inicio de sesión al hacer clic en el botón
document.getElementById("btn__iniciar-sesion").addEventListener("click", login);

// Evento para mostrar el formulario de registro al hacer clic en el botón
document.getElementById("btn__registrarse").addEventListener("click", register);

// Evento que se dispara cuando la ventana cambia de tamaño para ajustar la interfaz
window.addEventListener("resize", anchopagina);

// Declaración de Variables
var contenedor_login_register = document.querySelector(".contenedor__login-register");
var formulario_login = document.querySelector(".formulario__login");
var formulario_register = document.querySelector(".formulario__register");
var caja_trasera_login = document.querySelector(".caja__trasera-login");
var caja_trasera_register = document.querySelector(".caja__trasera-register");

// Función que ajusta la interfaz en función del tamaño de la ventana
function anchopagina() {
    if (window.innerWidth > 850) {
        caja_trasera_login.style.display = "block";
        caja_trasera_register.style.display = "block";
    } else {
        caja_trasera_register.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "0px";
    }
}

anchopagina();

// Función para mostrar el formulario de inicio de sesión
function login() {
    if (window.innerWidth > 850) {
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "10px";
        formulario_login.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
    } else {
        formulario_register.style.display = "none";
        contenedor_login_register.style.left = "0px";
        formulario_login.style.display = "block";
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
    }
}

// Función para mostrar el formulario de registro
function register() {
    if (window.innerWidth > 850) {
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "410px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
    } else {
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
    }
}

// /Algoritmos de Animación

// Función para registrarse en la página
let btn_register = $("#btn-register");
btn_register.click(function (e) {
    e.preventDefault();

    let email = $("#register-form input[name='email']").val();
    let password = $("#register-form input[name='password']").val();
    let retryPassword = $("#register-form input[name='retryPassword']").val();

    if (password === retryPassword) {
        var formData = {
            email: email,
            password: password
        }
        var nav = $("#navbar");
        var modalDato = $("#ModalUsuario");
        $.ajax({
            url: '/Account/Register',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: formData,
            success: function (data) {
                if (data.success) {
                    // El usuario se registró correctamente
                    nav.attr("hidden",true);
                    modalDato.modal("show");
                } else {
                    // Hubo errores durante el registro
                    alert('Error durante el registro: ' + data.errors.join(', '));
                }
            },
            error: function (error) {
                // Manejar errores de la solicitud
                console.log(error);
            }
        })
    }
});

// Función para iniciar sesión en la página
let btn_login = $("#btn-login");
btn_login.click(function (e) {
    e.preventDefault();

    let email = $("#login-form input[name='email']").val();
    let password = $("#login-form input[name='password']").val();

    var formData = {
        email: email,
        password: password
    }
    var nav = $("#navbar");
    var modalDato = $("#ModalUsuario");
    $.ajax({
        url: '/Account/Login',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (data) {
            if (data.success) {
                console.log(data);
                if (data.nombre) {
                    window.location.href = "/";
                }else{
                    nav.attr("hidden",true);
                    modalDato.modal("show");
                }
            } else {
                // Hubo errores durante el inicio de sesión
                alert('Error durante el inicio de sesión: ' + data.error);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
})
