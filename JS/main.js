// Array para almacenar los usuarios registrados
let usuarios = [];  

// Referencia al contenedor de mensajes
let mensajes = document.getElementById("mensajes");

// Función para mostrar mensajes en pantalla (info, error, éxito)
function mostrarMensaje(texto, tipo="info"){
  mensajes.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
}

// Expresiones regulares para validar los campos
let regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/; // Solo letras y espacios
let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato de correo
let regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/; // Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
let regexCelular = /^[0-9]{7,12}$/; // Entre 7 y 12 dígitos

// 📌 Registro de usuario
document.getElementById("formregistro").addEventListener("submit", function(e){
  e.preventDefault();
  let nombre = document.getElementById("nombre").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let celular = document.getElementById("celular").value.trim();
  let contrasena = document.getElementById("contrasena").value;

  // Validaciones
  if(!regexNombre.test(nombre)){mostrarMensaje("Nombre invalido","error"); return;}
  if(!regexCorreo.test(correo)){mostrarMensaje("Correo invalido","error"); return;}
  if(!regexCelular.test(celular)){mostrarMensaje("Celular invalido","error"); return;}
  if(!regexContrasena.test(contrasena)){mostrarMensaje("Contraseña débil","error"); return;}

  // Verificar si el correo ya existe
  let existe = usuarios.find(u => u.correo === correo);
  if(existe){mostrarMensaje("Correo ya registrado","error"); return;}

  // Guardar usuario en el array
  usuarios.push({nombre, correo, celular, contrasena, intentos:0, bloqueado:false});
  document.getElementById("formregistro").reset();
  mostrarMensaje("Cuenta creada correctamente","exito");
});

// 📌 Inicio de sesión
document.getElementById("formlogin").addEventListener("submit", function(e){
  e.preventDefault();
  let correo = document.getElementById("logcorreo").value.trim();
  let contrasena = document.getElementById("logcontrasena").value;

  let usuario = usuarios.find(u => u.correo === correo);

  // Validaciones de login
  if(!usuario){mostrarMensaje("Usuario o contrasena incorrectos","error"); return;}
  if(usuario.bloqueado){mostrarMensaje("Cuenta bloqueada por demasiados intentos fallidos","error"); return;}

  // Contraseña correcta
  if(usuario.contrasena === contrasena){
    usuario.intentos = 0;
    mostrarMensaje(`Bienvenido al sistema, ${usuario.nombre}`,"exito");
    document.getElementById("login").classList.add("ocultar");
    document.getElementById("registro").classList.add("ocultar");
    document.getElementById("bienvenida").classList.remove("ocultar");
    document.getElementById("mensajebienvenida").textContent = `Bienvenido, ${usuario.nombre}`;
    window.usuarioActual = usuario;
  }else{
    // Contraseña incorrecta
    usuario.intentos++;
    if(usuario.intentos>=3){
      usuario.bloqueado=true;
      mostrarMensaje("Cuenta bloqueada demasiados intentos fallidos","error");
    }else{
      mostrarMensaje(`Contrasena incorrecta Te quedan ${3 - usuario.intentos} intentos.`,"error");
    }
  }
});

// 📌 Recuperar contraseña (mostrar formulario)
document.getElementById("recuperar").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("login").classList.add("ocultar");
  document.getElementById("registro").classList.add("ocultar");
  document.getElementById("recuperarcontrasena").classList.remove("ocultar");
});

// 📌 Volver al login desde recuperación
document.getElementById("volverlogin").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("recuperarcontrasena").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
});

// 📌 Procesar recuperación de contraseña
document.getElementById("formrecuperar").addEventListener("submit", function(e){
  e.preventDefault();
  let correo = document.getElementById("recorreo").value.trim();
  let contrasena = document.getElementById("reccontrasena").value;

  let usuario = usuarios.find(u => u.correo === correo);

  if(!usuario){mostrarMensaje("el correo no esta registrado","error"); return;}
  if(!regexContrasena.test(contrasena)){mostrarMensaje("Contraseña débil","error"); return;}

  // Actualizar contraseña y desbloquear
  usuario.contrasena = contrasena;
  usuario.bloqueado = false;
  usuario.intentos = 0;

  mostrarMensaje("Contraseña actualizada. vuelve a iniciar sesion","exito");
  document.getElementById("formrecuperar").reset();
  document.getElementById("recuperarcontrasena").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
});

// 📌 Mostrar/Ocultar contraseña en los inputs
let toggles = document.querySelectorAll(".mostrarcontraseña");
toggles.forEach(t=>{
  t.addEventListener("click", function(e){
    e.preventDefault();
    let campo = document.getElementById(t.getAttribute("data-target"));
    campo.type = campo.type==="password"?"text":"password";
  });
});

// 📌 Cerrar sesión
document.getElementById("salir").addEventListener("click", function(){
  document.getElementById("bienvenida").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
  window.usuarioActual = null;
  mostrarMensaje("Sesion cerrada","info");
});
