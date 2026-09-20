// 1. PREGUNTAS Y RESPUESTAS.
const preguntasFrecuentes = [
  {
    categoria: "sobre-rutta",
    pregunta: "¿Qué es Rutta?",
    respuesta: "Rutta es una tienda en línea de equipo para senderismo, trail y hiking. Reunimos productos y recomendaciones para ayudarte a preparar tus aventuras y acercarte a la naturaleza."
  },
  {
    categoria: "sobre-rutta",
    pregunta: "¿En qué destacamos?",
    respuesta: "Ayudamos a quienes dan sus primeros pasos en el trail y el hiking a encontrar el equipo adecuado. Nuestra propuesta combina orientación y recomendaciones según tus necesidades, buscando que el precio o la falta de experiencia no sean obstáculos para explorar la naturaleza."
  },
  {
    categoria: "sobre-rutta",
    pregunta: "¿De qué manera Rutta me ayuda a encontrar el equipo adecuado?",
    respuesta: "Las fichas de producto incluyen más que las características básicas: muestran el nivel de experiencia recomendado, la actividad y el terreno para los que resulta adecuado, además de sus beneficios. Así puedes comparar opciones y elegir el equipo que se ajuste a tu próxima salida."
  },
  {
    categoria: "compras",
    pregunta: "¿Cómo realizar una compra en Rutta?",
    respuesta: "Explora Equipamiento, consulta la ficha del producto y agrega al carrito lo que necesitas. Revisa las cantidades y el total de tu selección antes de continuar con las opciones de compra disponibles."
  },
  {
    categoria: "compras",
    pregunta: "¿Cómo solicitar un cambio o reembolso?",
    respuesta: "Utiliza el formulario de contacto e indica en el asunto si solicitas un cambio o reembolso. Incluye el número de compra, el producto y el motivo de tu solicitud. La revisión se realiza de acuerdo con las políticas de cambios y reembolsos aplicables."
  },
  {
    categoria: "compras",
    pregunta: "¿Cómo hacer válida una garantía?",
    respuesta: "Conserva tu ticket o comprobante de compra y, de ser posible, la caja o envoltura original. Comparte mediante el formulario el producto, el número de compra y una descripción del problema para revisar la cobertura y los requisitos de su garantía."
  },
  {
    categoria: "compras",
    pregunta: "¿Cómo solicitar la cancelación de una compra?",
    respuesta: "Escribe Cancelación en el asunto del formulario e incluye el número de compra y el motivo. La posibilidad de cancelar se revisa según el estado del pedido y las condiciones aplicables a la compra."
  },
  {
    categoria: "compras",
    pregunta: "¿Cómo puedo dar seguimiento a mi compra?",
    respuesta: "Ten a mano tu número de compra y el correo que registraste. Revisa las actualizaciones disponibles en la página web y los mensajes que recibas por correo electrónico. Si tienes una duda, incluye esos datos en el formulario para identificar tu compra."
  }
];

// 2. ACORDEONES DE BOOTSTRAP.
// Cada apartado tiene su propio contenedor y abre una respuesta a la vez.
function mostrarPreguntas() {
  document.querySelector("#faq-sobre-rutta").replaceChildren();
  document.querySelector("#faq-compras").replaceChildren();
  preguntasFrecuentes.forEach((dato, indice) => {
    const tarjeta = document.createElement("div");
    const abierta = indice === 0; // La primera respuesta aparece abierta.
    const idRespuesta = `faq-respuesta-${indice}`;
    tarjeta.className = "accordion-item mb-2";

    // Tarjeta de pregunta
    tarjeta.innerHTML = `
      <h3 class="accordion-header">
        <button class="accordion-button ${abierta ? "" : "collapsed"}" type="button"
          data-bs-toggle="collapse" data-bs-target="#${idRespuesta}"
          aria-expanded="${abierta}" aria-controls="${idRespuesta}"></button>
      </h3>
      <div id="${idRespuesta}" class="accordion-collapse collapse ${abierta ? "show" : ""}">
        <div class="accordion-body"></div>
      </div>`;
    // Inserta el contenido de cada pregunta y respuesta.
    tarjeta.querySelector("button").textContent = dato.pregunta;
    tarjeta.querySelector(".accordion-body").textContent = dato.respuesta;
    tarjeta.querySelector(".accordion-collapse").setAttribute("data-bs-parent", `#faq-${dato.categoria}`);
    document.querySelector(`#faq-${dato.categoria}`).append(tarjeta);
  });
}
mostrarPreguntas();

// 3. VARIABLES Y ALMACENAMIENTO.
const formEl = document.getElementById("formularioAyuda");
const mensajeEl = document.getElementById("faq-estado");

let consultas = [];
// Guarda en localStorage las consultas que se envían mediante el formulario. 
const setLocalStorage = (key, value) => {
  const texValue = JSON.stringify(value);
  localStorage.setItem(key, texValue);
};
// Recupera del localStorage las consultas guardadas.
const getLocalstorage = (key) => {
  const data = localStorage.getItem(key);

  if (data == null) return [];
  return JSON.parse(data);
};
// 4. ENVÍO DE FORMULARIO.
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(formEl);
  const dataArray = [...formData];
  const consulta = Object.fromEntries(dataArray);
  consulta.consentimiento = formData.has("consentimiento");
  consultas = getLocalstorage("rutta-consultas"); 
  consultas.push(consulta);
  setLocalStorage("rutta-consultas", consultas);
  formEl.reset();
  mensajeEl.textContent = "Tu consulta quedó guardada.";
});

//5. INTERACTIVIDAD DE WIDGET RUTILIO
//DOMContentLoaded espera que el documento HTML termine de cargar para ejecutar
document.addEventListener('DOMContentLoaded', function () {
  // Busca los elementos del widget y los guarda en variables
  const burbuja = document.querySelector('.burbuja-saludo');       // Burbuja de saludo
  const botonCerrar = document.querySelector('.cierre-boton');     // Botón X de la burbuja
  const verOpciones = document.querySelector('.ver-opciones');     // Botón "Ver opciones"
  const menuOpciones = document.querySelector('.menu-opciones');   // Panel de opciones
  const botonCerrarMenu = document.querySelector('.cierre-boton-dos'); // Botón X del menú
  const rutilio = document.querySelector(`.rutilio`);


  
  // setTimeout: ejecuta la función después de 1000ms (1 segundo)
  setTimeout(function () {
    burbuja.classList.add('visible');  // Agrega la clase "visible" → la burbuja aparece
  }, 1000);

  // Al hacer clic en la X de la burbuja, la oculta
  botonCerrar.addEventListener('click', function () {
    burbuja.classList.remove('visible');
    rutilio.classList.add(`mini`);
  });

  // Al hacer clic en "Ver opciones": oculta la burbuja y muestra el menú
  verOpciones.addEventListener('click', function () {
    burbuja.classList.remove('visible');   // Oculta la burbuja
    menuOpciones.classList.add('mostrar'); // Muestra el menú
    rutilio.classList.remove(`mini`);
  });

  // Al hacer clic en la X del menú: lo oculta y reaparece el saludo
  botonCerrarMenu.addEventListener('click', function () {
    menuOpciones.classList.remove('mostrar'); // Oculta el menú
    burbuja.classList.add('visible');         // Reaparece la burbuja
  });

  // querySelectorAll: devuelve UNA LISTA con todos los botones .opcion-menu
  const botonesMenu = document.querySelectorAll('.opcion-menu');

  // forEach: recorre la lista y ejecuta la función por cada botón
  botonesMenu.forEach(function (boton) {
    boton.addEventListener('click', function () {
      const destino = boton.getAttribute('data-destino'); // Lee el atributo data-destino
      window.location.href = destino;                     // Redirige a esa página
    });
  });
});
