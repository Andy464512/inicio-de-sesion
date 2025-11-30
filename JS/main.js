let usuarios = []; 

let mensajes = document.getElementById("mensajes");
function mostrarMensaje(texto, tipo="info"){
  mensajes.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
}

let regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
let regexCelular = /^[0-9]{7,12}$/;

document.getElementById("formregistro").addEventListener("submit", function(e){
  e.preventDefault();
  let nombre = document.getElementById("nombre").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let celular = document.getElementById("celular").value.trim();
  let contrasena = document.getElementById("contrasena").value;

  if(!regexNombre.test(nombre)){mostrarMensaje("Nombre invalido","error"); return;}
  if(!regexCorreo.test(correo)){mostrarMensaje("Correo invalido","error"); return;}
  if(!regexCelular.test(celular)){mostrarMensaje("Celular invalido","error"); return;}
  if(!regexContrasena.test(contrasena)){mostrarMensaje("Contraseña débil","error"); return;}

  let existe = usuarios.find(u => u.correo === correo);
  if(existe){mostrarMensaje("Correo ya registrado","error"); return;}

  usuarios.push({nombre, correo, celular, contrasena, intentos:0, bloqueado:false});
  document.getElementById("formregistro").reset();
  mostrarMensaje("Cuenta creada correctamente","exito");
});

document.getElementById("formlogin").addEventListener("submit", function(e){
  e.preventDefault();
  let correo = document.getElementById("logcorreo").value.trim();
  let contrasena = document.getElementById("logcontrasena").value;

  let usuario = usuarios.find(u => u.correo === correo);
  if(!usuario){mostrarMensaje("Usuario o contrasena incorrectos","error"); return;}
  if(usuario.bloqueado){mostrarMensaje("Cuenta bloqueada por demasiados intentos fallidos","error"); return;}

  if(usuario.contrasena === contrasena){
    usuario.intentos = 0;
    mostrarMensaje(`Bienvenido al sistema, ${usuario.nombre}`,"exito");
    document.getElementById("login").classList.add("ocultar");
    document.getElementById("registro").classList.add("ocultar");
    document.getElementById("bienvenida").classList.remove("ocultar");
    document.getElementById("mensajebienvenida").textContent = `Bienvenido, ${usuario.nombre}`;
    window.usuarioActual = usuario;
  }else{
    usuario.intentos++;
    if(usuario.intentos>=3){
      usuario.bloqueado=true;
      mostrarMensaje("Cuenta bloqueada demasiados intentos fallidos","error");
    }else{
      mostrarMensaje(`Contrasena incorrecta Te quedan ${3 - usuario.intentos} intentos.`,"error");
    }
  }
});

document.getElementById("recuperar").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("login").classList.add("ocultar");
  document.getElementById("registro").classList.add("ocultar");
  document.getElementById("recuperarcontrasena").classList.remove("ocultar");
});

document.getElementById("volverlogin").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("recuperarcontrasena").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
});

document.getElementById("formrecuperar").addEventListener("submit", function(e){
  e.preventDefault();
  let correo = document.getElementById("recorreo").value.trim();
  let contrasena = document.getElementById("reccontrasena").value;

  let usuario = usuarios.find(u => u.correo === correo);
  if(!usuario){mostrarMensaje("el correo no esta registrado","error"); return;}
  if(!regexContrasena.test(contrasena)){mostrarMensaje("Contraseña débil","error"); return;}

  usuario.contrasena = contrasena;
  usuario.bloqueado = false;
  usuario.intentos = 0;

  mostrarMensaje("Contraseña actualizada. vuelve a iniciar sesion","exito");
  document.getElementById("formrecuperar").reset();
  document.getElementById("recuperarcontrasena").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
});

let toggles = document.querySelectorAll(".mostrarcontraseña");
toggles.forEach(t=>{
  t.addEventListener("click", function(e){
    e.preventDefault();
    let campo = document.getElementById(t.getAttribute("data-target"));
    campo.type = campo.type==="password"?"text":"password";
  });
});

document.getElementById("salir").addEventListener("click", function(){
  document.getElementById("bienvenida").classList.add("ocultar");
  document.getElementById("login").classList.remove("ocultar");
  document.getElementById("registro").classList.remove("ocultar");
  window.usuarioActual = null;
  mostrarMensaje("Sesion cerrada","info");
});
