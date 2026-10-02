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

        // *1. MOSTRAR EL FORMULARIO DE REGISTRO.
        // Cambia el título y oculta el enlace que abre el registro.
        const tituloLogin = document.getElementById("login-titulo");
        const parrafoRegistro = document.querySelector(".rutta-login-registro");

        tituloLogin.textContent = "Crear cuenta";
        parrafoRegistro.style.display = "none";

        // Crea el formulario conservando los estilos de Rutta.
        const nuevoFormulario = document.createElement("form");
        nuevoFormulario.id = "registroForm";
        nuevoFormulario.className = "rutta-login-formulario";

        // Permite mostrar las validaciones con nuestras alertas de Bootstrap.
        nuevoFormulario.noValidate = true;

        // Agrega los campos y el espacio para mostrar errores o confirmaciones.
        nuevoFormulario.innerHTML = `
          <div class="rutta-login-campo">
            <label for="reg-nombre">Nombre completo</label>
            <input
              id="reg-nombre"
              name="nombre"
              type="text"
              autocomplete="name"
              required
            />
          </div>

          <div class="rutta-login-campo">
            <label for="reg-telefono">Número de teléfono</label>
            <input
              id="reg-telefono"
              name="telefono"
              type="tel"
              inputmode="tel"
              autocomplete="tel-national"
              placeholder="10 dígitos"
              required
            />
          </div>

          <div class="rutta-login-campo">
            <label for="reg-correo">Email (nombre de usuario)</label>
            <input
              id="reg-correo"
              name="email"
              type="email"
              autocomplete="username"
              required
            />
          </div>

          <div class="rutta-login-campo">
            <label for="reg-contrasena">Contraseña</label>
            <input
              id="reg-contrasena"
              name="password"
              type="password"
              autocomplete="new-password"
              minlength="8"
              aria-describedby="reg-contrasena-ayuda"
              required
            />
            <small id="reg-contrasena-ayuda">
              Usa al menos 8 caracteres.
            </small>
          </div>

          <div class="rutta-login-campo">
            <label for="reg-confirmar">Confirmar contraseña</label>
            <input
              id="reg-confirmar"
              name="confirmarPassword"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>

          <div
            id="registro-alerta"
            class="alert d-none"
            role="alert"
            tabindex="-1"
          ></div>

          <button class="rutta-login-enviar" type="submit">
            Registrarse
          </button>
        `;
        // Sustituye el formulario de inicio de sesión por el de registro.
        formulario.replaceWith(nuevoFormulario);

        const alerta = document.getElementById("registro-alerta");

        //* 2. MOSTRAR MENSAJES.
        // Usa "danger" para errores y "success" para una validación correcta.
        function mostrarAlerta(mensaje, tipo) {
          alerta.className = `alert alert-${tipo}`;
          alerta.textContent = mensaje;
          alerta.focus();
        }

        // * 3. VALIDAR LOS DATOS.
        // Devuelve una lista con los errores encontrados en el formulario.
        function validarRegistro(usuario, confirmarPassword) {
          const errores = [];

          // Comprueba que el nombre no esté vacío ni contenga solo espacios.
          if (usuario.nombre.length < 2) {
            errores.push("Escribe tu nombre completo.");
          }

          // Acepta teléfonos nacionales de México con exactamente 10 dígitos.
          if (!/^[0-9]{10}$/.test(usuario.telefono)) {
            errores.push("El teléfono debe contener 10 dígitos.");
          }

          // Revisa que el correo tenga usuario, arroba, dominio y extensión.
          const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const campoCorreo = document.getElementById("reg-correo");

          if (
            !formatoCorreo.test(usuario.email) ||
            !campoCorreo.validity.valid
          ) {
            errores.push("Escribe un correo electrónico válido.");
          }

          // Comprueba la longitud y evita una contraseña de puros espacios.
          if (
            usuario.password.length < 8 ||
            usuario.password.trim() === ""
          ) {
            errores.push("La contraseña debe tener al menos 8 caracteres.");
          }

          // Comprueba que se haya escrito la confirmación y que sea idéntica.
          if (confirmarPassword === "") {
            errores.push("Confirma tu contraseña.");
          } else if (usuario.password !== confirmarPassword) {
            errores.push("Las contraseñas no coinciden.");
          }

          return errores;
        }

        // * 4. CONTROLAR EL ENVÍO.
        // Recoge la información, valida los campos y genera el JSON.
        nuevoFormulario.addEventListener("submit", (eventoSubmit) => {
          eventoSubmit.preventDefault();

          const datos = new FormData(nuevoFormulario);

          // Construye el objeto con los cuatro campos solicitados.
          const usuario = {
            nombre: datos.get("nombre").trim(),
            telefono: datos.get("telefono").trim(),
            email: datos.get("email").trim(),
            password: datos.get("password"),
          };

          // La confirmación solo sirve para validar; no forma parte del usuario.
          const confirmarPassword = datos.get("confirmarPassword");

          // Usa el correo sin espacios exteriores para su validación HTML.
          document.getElementById("reg-correo").value = usuario.email;

          const errores = validarRegistro(usuario, confirmarPassword);

          // Si hay errores, los muestra y detiene el registro.
          if (errores.length > 0) {
            mostrarAlerta(errores.join(" "), "danger");
            return;
          }

          // Convierte el objeto validado en texto con formato JSON.
          const usuarioJSON = JSON.stringify(usuario);

  
          console.log(usuario);



          mostrarAlerta(
            "Los datos de registro se validaron correctamente.",
            "success"
          );

          nuevoFormulario.reset();
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
