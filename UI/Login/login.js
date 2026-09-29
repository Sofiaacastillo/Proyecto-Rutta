// ================================================================
// LOGIN RUTTA
// ================================================================
(() => {
  "use strict"; // Detecta errores comunes y evita variables globales accidentales.

  // Selecciona solamente elementos de esta página,
  const formulario = document.querySelector("#formularioLogin");
  const dialogo = document.querySelector("#login-dialogo");
  const tituloDialogo = document.querySelector("#login-dialogo-titulo");
  const textoDialogo = document.querySelector("#login-dialogo-texto");
  if (!formulario) return; // Permite salir sin errores si se carga en otra página.

  // Intercepta el envío antes de habilitar los campos: evita mandarlos en la URL.
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Impide el envío y la recarga predeterminados.
    formulario.reset(); // Limpia los campos sin comprobar usuarios ni contraseñas.
    window.location.assign("../index.html"); // Abre la portada sin enviar datos en la URL.
  });

  // Habilita los campos después de controlar el envío para no exponerlos en la URL.
  formulario.querySelectorAll("input, button[type='submit']").forEach((campo) => {
    campo.disabled = false;
  });

  // Información breve para las ventanas de ayuda, sin repetir estructuras HTML.
  const avisos = {
    recuperar: ["Vuelve a tu ruta", "Puedes continuar desde el formulario de acceso con el nombre que prefieras. Tu selección de productos te espera en el carrito."],
    condiciones: ["Condiciones de Uso", "Explora el catálogo, revisa las características de cada producto y compara las opciones para tu próxima salida. Utiliza el contenido de Rutta de forma responsable."],
    privacidad: ["Política de Privacidad", "Lo que escribes en este acceso no se envía ni se guarda. Tu selección del carrito se conserva temporalmente en esta pestaña del navegador."],
    cookies: ["Política de Cookies", "Puedes revisar y administrar las cookies desde la configuración de tu navegador. Rutta conserva el carrito de forma temporal; las fuentes y algunos recursos visuales se cargan desde servicios externos."],
    preguntas: ["Preguntas Frecuentes", "¿Cómo encuentro un producto? Elige una categoría o usa la lupa. ¿Dónde veo mi selección? Pulsa el carrito. ¿Buscas consejos? Visita la sección de guías."],
    contacto: ["Conoce a Rutta", "Somos un equipo que une tecnología y aventura. Visita Sobre Rutta para conocer a las personas detrás del proyecto y nuestra forma de trabajar."],
    configuracion: ["Tu navegación, tus preferencias", "Para revisar las cookies, abre Configuración en tu navegador y busca Privacidad o Datos del sitio. Al borrar los datos de Rutta también puede eliminarse tu selección del carrito."],
  };

  // Reutiliza un solo diálogo para que las opciones no sean enlaces vacíos o maneja el registro en pantalla.
  document.querySelectorAll("[data-login-aviso]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const tipoAviso = boton.dataset.loginAviso;

      // NUEVA LÓGICA: Si es "registro", transformamos el formulario en lugar de abrir el modal
      if (tipoAviso === "registro") {
        const panelLogin = document.querySelector('.rutta-login-panel');
        const tituloLogin = document.getElementById('login-titulo');
        const parrafoRegistro = document.querySelector('.rutta-login-registro');

        // Cambiar título y ocultar el enlace de registro
        tituloLogin.textContent = 'Crear cuenta';
        parrafoRegistro.style.display = 'none';

        // Crear el nuevo formulario de Registro dinámicamente con estilos de Rutta
        const nuevoFormulario = document.createElement('form');
        nuevoFormulario.id = 'registroForm';
        nuevoFormulario.className = 'rutta-login-formulario';
        nuevoFormulario.autocomplete = 'off';

        // Campo: Nombre
        const divNombre = document.createElement('div');
        divNombre.className = 'rutta-login-campo';
        divNombre.innerHTML = `
          <label for="reg-nombre">Nombre de usuario</label>
          <input id="reg-nombre" name="nombre" type="text" required />
        `;

        // Campo: Email
        const divEmail = document.createElement('div');
        divEmail.className = 'rutta-login-campo';
        divEmail.innerHTML = `
          <label for="reg-correo">Correo electrónico</label>
          <input id="reg-correo" name="email" type="email" required />
        `;

        // Campo: Contraseña
        const divPassword = document.createElement('div');
        divPassword.className = 'rutta-login-campo';
        divPassword.innerHTML = `
          <label for="reg-contrasena">Contraseña</label>
          <input id="reg-contrasena" name="password" type="password" required />
        `;

        // Botón de Envío
        const botonSubmit = document.createElement('button');
        botonSubmit.className = 'rutta-login-enviar';
        botonSubmit.type = 'submit';
        botonSubmit.textContent = 'Registrarse';

        // Unir todo dentro del nuevo formulario
        nuevoFormulario.appendChild(divNombre);
        nuevoFormulario.appendChild(divEmail);
        nuevoFormulario.appendChild(divPassword);
        nuevoFormulario.appendChild(botonSubmit);

        // Reemplazar el viejo formulario por el nuevo
        formulario.replaceWith(nuevoFormulario);

        // Controlar el envío del nuevo formulario de registro
        nuevoFormulario.addEventListener('submit', (eventoSubmit) => {
          eventoSubmit.preventDefault();
          const datos = new FormData(nuevoFormulario);
          
          console.log('--- Datos de Registro ---');
          console.log('Nombre:', datos.get('nombre'));
          console.log('Email:', datos.get('email'));
          console.log('Contraseña:', datos.get('password'));
          
          nuevoFormulario.reset();
          // Redirige a la tienda tras "registrarse" igual que hacía tu login
          window.location.assign("../index.html"); 
        });

      } else {
        // Mantiene el comportamiento original de abrir el modal para el resto de botones (Privacidad, Ayuda, etc.)
        const aviso = avisos[tipoAviso]; 
        tituloDialogo.textContent = aviso[0]; 
        textoDialogo.textContent = aviso[1];
        dialogo.showModal(); 
      }
    });
  });

  // Lee SOLAMENTE cantidades del carrito para conservar el contador entre páginas.
  try {
    const guardado = JSON.parse(sessionStorage.getItem("rutta-carrito-tab") || "[]");
    const filas = Array.isArray(guardado) ? guardado : [];
    const vistos = new Set(); // Evita sumar entradas duplicadas o inválidas.
    const cantidad = filas.reduce((total, item) => {
      if (!item || ![1, 2, 3].includes(item.id) || vistos.has(item.id) || !Number.isSafeInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 999) return total;
      vistos.add(item.id);
      return total + item.cantidad;
    }, 0);
    document.querySelectorAll("[data-contador-carrito]").forEach((contador) => {
      contador.textContent = cantidad;
    });
  } catch {
  }
})();
