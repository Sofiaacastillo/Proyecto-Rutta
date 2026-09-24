// ================================================================
// 1. INFORMACIÓN DE LOS PRODUCTOS
// Este arreglo funciona como una pequeña base de datos local.
// ================================================================






// ================================================================
// 2. REFERENCIAS A ELEMENTOS DEL DOCUMENTO
// querySelector permite encontrar elementos usando selectores de CSS.
// ================================================================

// Contenedor donde se insertarán las tarjetas de productos.
const listaProductos = document.querySelector("#listaProductos");

// Mensaje que se mostrará cuando el filtro no tenga resultados.
const estadoVacio = document.querySelector("#estadoVacio");

// Campo de texto contenido dentro del panel de búsqueda.
const campoBusqueda = document.querySelector("#campoBusqueda");

// Botón que ejecuta la búsqueda escrita por la persona usuaria.
const botonBuscar = document.querySelector("#botonBuscar");

// Elementos del modal que reciben la información del producto seleccionado.
const modalProductoTitulo = document.querySelector("#modalProductoTitulo");
const modalProductoCategoria = document.querySelector("#modalProductoCategoria");
const modalProductoContenido = document.querySelector("#modalProductoContenido");

// Elemento que contiene el mensaje temporal del carrito.
const mensajeToast = document.querySelector("#mensajeToast");

// Panel lateral donde se mostrará el contenido completo del carrito.
const carritoPanelElemento = document.querySelector("#carritoPanel");

// Contenedor en el que se insertan las filas de productos seleccionados.
const listaCarrito = document.querySelector("#listaCarrito");

// Mensaje visible únicamente cuando no existe ningún artículo agregado.
const carritoVacio = document.querySelector("#carritoVacio");

// Resumen que contiene el total y las acciones finales del carrito.
const carritoResumen = document.querySelector("#carritoResumen");

// Elemento de texto en el que se coloca el importe total de la compra.
const carritoTotal = document.querySelector("#carritoTotal");

// Botones para vaciar el carrito y representar el cierre de la compra.
const botonVaciarCarrito = document.querySelector("#botonVaciarCarrito");
const botonFinalizarCompra = document.querySelector("#botonFinalizarCompra");

// Crea las instancias de componentes interactivos proporcionadas por Bootstrap.
const modalProducto = new bootstrap.Modal(document.querySelector("#modalProducto"));
const buscadorPanel = new bootstrap.Offcanvas(document.querySelector("#buscadorPanel"));
const carritoPanel = new bootstrap.Offcanvas(carritoPanelElemento);
const toastCarrito = new bootstrap.Toast(document.querySelector("#toastCarrito"), {
  // Indica que la notificación se ocultará automáticamente.
  autohide: true,

  // Tiempo en milisegundos durante el que permanecerá visible.
  delay: 2600,
});

// Guarda los productos elegidos y la cantidad de cada uno durante la sesión.
const carrito = [];

// Recuerda el filtro de categoría actualmente seleccionado.
let filtroActual = "todos";

// ================================================================
// 3. FUNCIONES DE APOYO
// Una función agrupa instrucciones que pueden reutilizarse.
// ================================================================

/**
 * Convierte un número en un precio con formato mexicano.
 * @param {number} precio - Cantidad que se desea convertir.
 * @returns {string} Precio como “MXN $1,799”.
 */
function formatearPrecio(precio) {
  // Intl.NumberFormat aplica separadores y símbolo de moneda automáticamente.
  const precioFormateado = new Intl.NumberFormat("es-MX", {
    // Define que el valor representa dinero.
    style: "currency",

    // Especifica que la moneda es el peso mexicano.
    currency: "MXN",

    // Oculta centavos porque los precios de la referencia son cantidades enteras.
    maximumFractionDigits: 0,
  }).format(precio);

  // Devuelve el texto final antecedido por la abreviatura MXN.
  return `MXN ${precioFormateado}`;
}

/**
 * Busca un producto utilizando su identificador.
 * @param {number} id - Identificador numérico del producto.
 * @returns {object|undefined} Objeto encontrado o undefined si no existe.
 */
function obtenerProducto(id) {
  // find recorre el arreglo hasta localizar el objeto cuyo id coincida.
  return productos.find((producto) => producto.id === id);
}

/**
 * Genera los renglones de características para una tarjeta.
 * @param {string[]} caracteristicas - Lista de textos técnicos.
 * @returns {string} Fragmento HTML listo para insertarse.
 */
function crearCaracteristicas(caracteristicas) {
  // map transforma cada texto en un elemento <li> y join los une.
  return caracteristicas
    .map(
      (caracteristica) => `
        <li>
          <i class="bi bi-check2-circle" aria-hidden="true"></i>
          <span>${caracteristica}</span>
        </li>`,
    )
    .join("");
}

/**
 * Crea una tarjeta completa a partir de un objeto producto.
 * @param {object} producto - Información que se colocará en la tarjeta.
 * @returns {string} Columna Bootstrap con la tarjeta en formato HTML.
 */
function crearTarjetaProducto(producto) {
  // La plantilla permite combinar HTML con valores de JavaScript usando ${ }.
  return `
    <div class="col-md-6 col-xl-4">
      <article class="producto-card">
        <div class="producto-imagen">
          <!-- La imagen sale del objeto del producto, por eso cada tarjeta puede usar una diferente. -->
          <img src="${producto.imagen}" alt="${producto.nombre}" />

          <span class="producto-etiqueta">
            <i class="bi ${producto.iconoCategoria}" aria-hidden="true"></i>
            ${producto.recomendado ? "Recomendado" : producto.categoriaNombre}
          </span>

          <button
            class="boton-favorito"
            type="button"
            data-favorito="${producto.id}"
            aria-label="Agregar ${producto.nombre} a favoritos"
            aria-pressed="false"
          >
            <i class="bi bi-heart" aria-hidden="true"></i>
          </button>
        </div>

        <div class="producto-cuerpo">
          <h3>${producto.nombre}</h3>
          <p class="producto-resumen">${producto.resumen}</p>
          <p class="producto-precio">${formatearPrecio(producto.precio)}</p>

          <div class="producto-perfil">
            <h4><i class="bi bi-person-check" aria-hidden="true"></i> ¿Es para ti?</h4>

            <div class="dato-perfil">
              <strong><i class="bi bi-signpost-split"></i> Nivel recomendado</strong>
              <span>${producto.nivel}</span>
            </div>

            <div class="dato-perfil">
              <strong><i class="bi bi-person-walking"></i> Actividad ideal</strong>
              <span>${producto.actividad}</span>
            </div>

            <div class="dato-perfil">
              <strong><i class="bi bi-compass"></i> Clima / terreno</strong>
              <span>${producto.terreno}</span>
            </div>

            <div class="dato-perfil">
              <strong><i class="bi bi-stars"></i> Lo mejor para</strong>
              <span>${producto.ideal}</span>
            </div>
          </div>

          <ul class="producto-caracteristicas">
            ${crearCaracteristicas(producto.caracteristicas)}
          </ul>

          <div class="producto-acciones">
            <button class="boton-producto" type="button" data-ver-producto="${producto.id}">
              <i class="bi bi-eye" aria-hidden="true"></i> Ver producto
            </button>

            <button class="boton-agregar" type="button" data-agregar-carrito="${producto.id}" aria-label="Agregar ${producto.nombre} al carrito">
              <i class="bi bi-cart-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    </div>`;
}

// ================================================================
// 4. RENDERIZADO Y FILTRADO DEL CATÁLOGO
// ================================================================

/**
 * Muestra solamente los productos que coincidan con la categoría y búsqueda.
 * @param {string} categoria - Categoría activa o la palabra “todos”.
 * @param {string} busqueda - Texto opcional escrito en el buscador.
 */
function mostrarProductos(categoria = "todos", busqueda = "") {
  // Convierte la búsqueda a minúsculas y elimina espacios laterales.
  const textoBuscado = busqueda.toLowerCase().trim();

  // filter crea un nuevo arreglo únicamente con los productos que cumplen ambas reglas.
  const productosFiltrados = productos.filter((producto) => {
    // La categoría coincide cuando se seleccionó “todos” o la categoría exacta.
    const coincideCategoria = categoria === "todos" || producto.categoria === categoria;

    // Combina campos importantes para permitir una búsqueda más útil.
    const textoProducto = `${producto.nombre} ${producto.resumen} ${producto.actividad} ${producto.terreno}`.toLowerCase();

    // includes comprueba si el texto del producto contiene la búsqueda.
    const coincideBusqueda = textoProducto.includes(textoBuscado);

    // El producto se conserva solamente si cumple categoría y búsqueda.
    return coincideCategoria && coincideBusqueda;
  });

  // Convierte cada producto filtrado en tarjeta y coloca el resultado en el DOM.
  listaProductos.innerHTML = productosFiltrados.map(crearTarjetaProducto).join("");

  // Muestra u oculta el mensaje vacío dependiendo del número de resultados.
  estadoVacio.classList.toggle("d-none", productosFiltrados.length !== 0);
}

/**
 * Cambia visualmente el filtro seleccionado y actualiza el catálogo.
 * @param {string} categoria - Nombre interno del nuevo filtro.
 */
function aplicarFiltro(categoria) {
  // Actualiza la variable global con la selección actual.
  filtroActual = categoria;

  // Recorre todos los botones de filtro visibles.
  document.querySelectorAll(".filtro").forEach((boton) => {
    // Activa únicamente el botón cuyo data-filtro coincide con la categoría.
    boton.classList.toggle("activo", boton.dataset.filtro === categoria);
  });

  // Limpia búsquedas anteriores para mostrar la categoría completa.
  campoBusqueda.value = "";

  // Vuelve a generar las tarjetas con la selección indicada.
  mostrarProductos(categoria);

  // Desplaza suavemente la pantalla hasta el catálogo.
  document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
}

// ================================================================
// 5. MODAL DE DETALLE
// ================================================================

/**
 * Completa y muestra el modal del producto seleccionado.
 * @param {number} id - Identificador del producto que se quiere consultar.
 */
function abrirProducto(id) {
  // Obtiene el objeto relacionado con el botón presionado.
  const producto = obtenerProducto(id);

  // Si el producto no existe, termina la función para evitar errores.
  if (!producto) return;

  // Coloca la categoría en la sobrelínea del modal.
  modalProductoCategoria.textContent = producto.categoriaNombre;

  // Coloca el nombre como título principal del modal.
  modalProductoTitulo.textContent = producto.nombre;

  // Construye el contenido detallado con imagen, precio y características.
  modalProductoContenido.innerHTML = `
    <div class="detalle-grid">
      <div class="detalle-imagen">
        <!--El modal reutiliza exactamente la imagen del producto seleccionado. -->
        <img src="${producto.imagen}" alt="${producto.nombre}" />
      </div>

      <div>
        <p>${producto.resumen}</p>
        <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
        <p><strong>Nivel:</strong> ${producto.nivel}</p>
        <p><strong>Actividad:</strong> ${producto.actividad}</p>
        <p><strong>Clima o terreno:</strong> ${producto.terreno}</p>

        <ul class="detalle-lista">
          ${crearCaracteristicas(producto.caracteristicas)}
        </ul>

        <button class="btn boton-primario w-100" type="button" data-agregar-modal="${producto.id}">
          <i class="bi bi-cart-plus" aria-hidden="true"></i> Agregar al carrito
        </button>
      </div>
    </div>`;

  // Ordena a Bootstrap mostrar la ventana modal.
  modalProducto.show();
}

// ================================================================
// 6. CARRITO Y FAVORITOS
// ================================================================

/**
 * Calcula el número total de unidades guardadas en el carrito.
 * @returns {number} Suma de las cantidades de todos los productos.
 */
function obtenerCantidadCarrito() {
  // reduce acumula en un solo número la cantidad de cada elemento.
  return carrito.reduce((total, elemento) => total + elemento.cantidad, 0);
}

/**
 * Crea el HTML de una fila del panel del carrito.
 * @param {object} elemento - Contiene el id del producto y su cantidad.
 * @returns {string} Fila lista para insertarse en el panel lateral.
 */
function crearFilaCarrito(elemento) {
  // Recupera todos los datos comerciales a partir del identificador guardado.
  const producto = obtenerProducto(elemento.id);

  // Si el producto dejó de existir, evita construir una fila incorrecta.
  if (!producto) return "";

  // Calcula el subtotal correspondiente únicamente a esta fila.
  const subtotal = producto.precio * elemento.cantidad;

  // Devuelve la fotografía, información, selector de cantidad y botón para eliminar.
  return `
    <article class="carrito-item">
      <div class="carrito-miniatura">
        <!--? La miniatura usa la misma imagen independiente del producto. -->
        <img src="${producto.imagen}" alt="${producto.nombre}" />
      </div>

      <div class="carrito-item-info">
        <p class="carrito-item-categoria">${producto.categoriaNombre}</p>
        <h3>${producto.nombre}</h3>
        <p class="carrito-item-precio">${formatearPrecio(subtotal)}</p>

        <div class="carrito-item-acciones">
          <div class="control-cantidad" aria-label="Cantidad de ${producto.nombre}">
            <button
              type="button"
              data-restar-carrito="${producto.id}"
              aria-label="Restar una unidad de ${producto.nombre}"
            >−</button>
            <span aria-live="polite">${elemento.cantidad}</span>
            <button
              type="button"
              data-sumar-carrito="${producto.id}"
              aria-label="Agregar otra unidad de ${producto.nombre}"
            >+</button>
          </div>

          <button
            class="boton-eliminar"
            type="button"
            data-eliminar-carrito="${producto.id}"
            aria-label="Eliminar ${producto.nombre} del carrito"
          >
            <i class="bi bi-trash3" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </article>`;
}

/**
 * Actualiza filas, contador, estado vacío y total cada vez que cambia el carrito.
 */
function actualizarCarrito() {
  // Genera una fila por cada producto diferente almacenado.
  listaCarrito.innerHTML = carrito.map(crearFilaCarrito).join("");

  // Obtiene la cantidad total considerando que una fila puede tener varias unidades.
  const cantidadCarrito = obtenerCantidadCarrito();

  // Suma precio por cantidad para conocer el importe completo.
  const totalCarrito = carrito.reduce((total, elemento) => {
    // Busca la información de precio del producto actual.
    const producto = obtenerProducto(elemento.id);

    // Acumula el subtotal o cero si el identificador ya no existe.
    return total + (producto ? producto.precio * elemento.cantidad : 0);
  }, 0);

  // Actualiza el contador de la navegación en móvil y escritorio.
  document.querySelectorAll("[data-contador-carrito]").forEach((contador) => {
    contador.textContent = cantidadCarrito;
  });

  // Comprueba si existe al menos un producto para cambiar los estados visuales.
  const tieneProductos = carrito.length > 0;

  // Oculta el mensaje vacío cuando ya hay productos.
  carritoVacio.classList.toggle("d-none", tieneProductos);

  // Muestra el resumen y sus botones solamente cuando puede calcularse un total.
  carritoResumen.classList.toggle("d-none", !tieneProductos);

  // Presenta el total con el mismo formato monetario de las tarjetas.
  carritoTotal.textContent = formatearPrecio(totalCarrito);
}

/**
 * Modifica la cantidad de un producto ya almacenado.
 * @param {number} id - Identificador del producto que cambiará.
 * @param {number} cambio - Número positivo para sumar o negativo para restar.
 */
function cambiarCantidadCarrito(id, cambio) {
  // Localiza la fila cuyo producto coincide con el identificador recibido.
  const elemento = carrito.find((item) => item.id === id);

  // Detiene la función cuando el producto no está dentro del carrito.
  if (!elemento) return;

  // Aplica la suma o resta indicada por el botón presionado.
  elemento.cantidad += cambio;

  // Si la cantidad llegó a cero, elimina la fila completa.
  if (elemento.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  // Redibuja el panel para reflejar la nueva cantidad y el nuevo total.
  actualizarCarrito();
}

/**
 * Elimina completamente un producto del carrito.
 * @param {number} id - Identificador de la fila que se desea quitar.
 */
function eliminarDelCarrito(id) {
  // findIndex devuelve la posición exacta del elemento dentro del arreglo.
  const posicion = carrito.findIndex((item) => item.id === id);

  // splice elimina una posición solamente cuando fue encontrada.
  if (posicion !== -1) carrito.splice(posicion, 1);

  // Actualiza todos los elementos visuales después de eliminar.
  actualizarCarrito();
}

/**
 * Añade un producto al carrito y muestra una confirmación.
 * @param {number} id - Identificador del producto añadido.
 */
function agregarAlCarrito(id) {
  // Localiza el producto para poder mencionar su nombre.
  const producto = obtenerProducto(id);

  // Evita continuar si se recibió un id que no existe.
  if (!producto) return;

  // Comprueba si el mismo producto ya había sido añadido anteriormente.
  const elementoExistente = carrito.find((elemento) => elemento.id === id);

  // Si ya existe incrementa su cantidad; de lo contrario crea una nueva fila.
  if (elementoExistente) {
    elementoExistente.cantidad += 1;
  } else {
    carrito.push({ id, cantidad: 1 });
  }

  // Redibuja el carrito para actualizar contador, filas y total.
  actualizarCarrito();

  // Personaliza el mensaje con el nombre del producto.
  mensajeToast.textContent = `${producto.nombre} se agregó al carrito.`;

  // Muestra la notificación temporal.
  toastCarrito.show();
}

/**
 * Alterna el estado visual y accesible de un botón favorito.
 * @param {HTMLButtonElement} boton - Botón que fue presionado.
 */
function alternarFavorito(boton) {
  // toggle agrega la clase si no existe y la elimina si ya existe.
  const estaActivo = boton.classList.toggle("activo");

  // Cambia el atributo para lectores de pantalla.
  boton.setAttribute("aria-pressed", String(estaActivo));

  // Sustituye el ícono vacío por uno relleno cuando está activo.
  boton.innerHTML = `<i class="bi ${estaActivo ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>`;
}

// ================================================================
// 7. EVENTOS DE LA INTERFAZ
// addEventListener ejecuta funciones cuando ocurre una interacción.
// ================================================================

// Escucha clics dentro del catálogo usando delegación de eventos.
listaProductos.addEventListener("click", (evento) => {
  // closest localiza el botón de detalle más cercano al lugar del clic.
  const botonVer = evento.target.closest("[data-ver-producto]");

  // Localiza el botón rápido del carrito.
  const botonAgregar = evento.target.closest("[data-agregar-carrito]");

  // Localiza el botón de favorito.
  const botonFavorito = evento.target.closest("[data-favorito]");

  // Si se presionó “Ver producto”, abre el modal correspondiente.
  if (botonVer) abrirProducto(Number(botonVer.dataset.verProducto));

  // Si se presionó el carrito, agrega el producto correspondiente.
  if (botonAgregar) agregarAlCarrito(Number(botonAgregar.dataset.agregarCarrito));

  // Si se presionó el corazón, cambia su estado.
  if (botonFavorito) alternarFavorito(botonFavorito);
});

// Escucha el botón de carrito que se crea dentro del modal.
modalProductoContenido.addEventListener("click", (evento) => {
  // Localiza el botón mediante su atributo data personalizado.
  const botonAgregarModal = evento.target.closest("[data-agregar-modal]");

  // Agrega el producto solamente cuando el botón existe.
  if (botonAgregarModal) agregarAlCarrito(Number(botonAgregarModal.dataset.agregarModal));
});

// Recorre todos los botones que contienen un filtro de categoría.
document.querySelectorAll("[data-filtro]").forEach((boton) => {
  // Ejecuta aplicarFiltro utilizando el valor almacenado en data-filtro.
  boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro));
});

// Recorre los botones de búsqueda ubicados en móvil y escritorio.
document.querySelectorAll('[data-accion="buscar"]').forEach((boton) => {
  // Abre el panel superior al presionar cualquiera de ellos.
  boton.addEventListener("click", () => buscadorPanel.show());
});

// Recorre los dos botones de carrito de la navegación.
document.querySelectorAll('[data-accion="carrito"]').forEach((boton) => {
  // Abre el panel lateral para consultar productos, cantidades y total.
  boton.addEventListener("click", () => {
    // Garantiza que la información esté actualizada antes de abrir.
    actualizarCarrito();

    // Ordena a Bootstrap mostrar el carrito desde la derecha.
    carritoPanel.show();
  });
});

// Escucha los controles creados dinámicamente dentro del panel del carrito.
listaCarrito.addEventListener("click", (evento) => {
  // Busca si el clic ocurrió en el botón para sumar una unidad.
  const botonSumar = evento.target.closest("[data-sumar-carrito]");

  // Busca si el clic ocurrió en el botón para restar una unidad.
  const botonRestar = evento.target.closest("[data-restar-carrito]");

  // Busca si el clic ocurrió en el botón con forma de bote de basura.
  const botonEliminar = evento.target.closest("[data-eliminar-carrito]");

  // Incrementa una unidad utilizando el identificador guardado en data.
  if (botonSumar) cambiarCantidadCarrito(Number(botonSumar.dataset.sumarCarrito), 1);

  // Reduce una unidad y elimina el producto automáticamente si llega a cero.
  if (botonRestar) cambiarCantidadCarrito(Number(botonRestar.dataset.restarCarrito), -1);

  // Elimina toda la fila sin importar cuántas unidades contenga.
  if (botonEliminar) eliminarDelCarrito(Number(botonEliminar.dataset.eliminarCarrito));
});

// Vacía todas las posiciones del arreglo cuando se presiona “Vaciar carrito”.
botonVaciarCarrito.addEventListener("click", () => {
  // splice desde cero retira todos los elementos conservando el mismo arreglo.
  carrito.splice(0, carrito.length);

  // Regresa el panel a su estado inicial vacío.
  actualizarCarrito();
});

// Representa el paso final de compra dentro de este proyecto demostrativo.
botonFinalizarCompra.addEventListener("click", () => {
  // Informa que el flujo real de pago no forma parte de la práctica.
  mensajeToast.textContent = "Compra preparada. Pasando a Zona de Pago.";

  // Cierra el panel para permitir que la notificación sea visible.
  carritoPanel.hide();

  // Espera a que termine la animación de cierre antes de mostrar el toast.
  window.setTimeout(() => toastCarrito.show(), 260);
});

/**
 * Ejecuta la búsqueda escrita en el panel y desplaza al catálogo.
 */
function ejecutarBusqueda() {
  // Cambia el filtro a “todos” para buscar en las tres categorías.
  filtroActual = "todos";

  // Actualiza la apariencia de las píldoras de filtro.
  document.querySelectorAll(".filtro").forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.filtro === "todos");
  });

  // Filtra los productos utilizando el valor actual del campo.
  mostrarProductos("todos", campoBusqueda.value);

  // Cierra el panel de búsqueda para revelar los resultados.
  buscadorPanel.hide();

  // Espera a que termine el cierre antes de desplazar la pantalla.
  window.setTimeout(() => {
    document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
  }, 260);
}

// Ejecuta la búsqueda al presionar el botón verde.
botonBuscar.addEventListener("click", ejecutarBusqueda);

// También permite buscar con la tecla Enter.
campoBusqueda.addEventListener("keydown", (evento) => {
  // Comprueba si la tecla presionada fue Enter.
  if (evento.key === "Enter") ejecutarBusqueda();
});

// ================================================================
// 8. INICIALIZACIÓN DE LA PÁGINA
// Estas instrucciones se ejecutan cuando termina de cargar el archivo.
// ================================================================

// Inserta automáticamente el año actual en el pie de página.
document.querySelector("#anioActual").textContent = new Date().getFullYear();

// Genera por primera vez las tres tarjetas sin aplicar ningún filtro.
mostrarProductos(filtroActual);

// Dibuja el estado vacío inicial y coloca los contadores en cero.
actualizarCarrito();