// ================================================================
// LÓGICA DE LA PÁGINA SOBRE NOSOTROS
// Contenido:
// 1. Año automático del footer
// 2. Contador del carrito en la navbar
// 3. Botones de búsqueda, carrito y filtros de la navbar
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
  // ---------------- 1. AÑO DEL FOOTER ----------------
  // Escribe el año actual dentro del elemento #anioActual del footer.
  const anio = document.querySelector("#anioActual");
  if (anio) anio.textContent = new Date().getFullYear();

  // ---------------- 2. CONTADOR DEL CARRITO ----------------
  // Lee las cantidades guardadas en sessionStorage y las muestra en los
  // contadores de la navbar (móvil y escritorio).
  try {
    const guardado = JSON.parse(
      sessionStorage.getItem("rutta-carrito-tab") || "[]",
    );
    const filas = Array.isArray(guardado) ? guardado : [];
    const vistos = new Set(); // Evita sumar productos duplicados.
    const cantidad = filas.reduce((total, item) => {
      if (
        !item ||
        vistos.has(item.id) ||
        !Number.isSafeInteger(item.cantidad) ||
        item.cantidad < 1 ||
        item.cantidad > 999
      )
        return total;
      vistos.add(item.id);
      return total + item.cantidad;
    }, 0);
    document.querySelectorAll("[data-contador-carrito]").forEach((contador) => {
      contador.textContent = cantidad;
    });
  } catch {
    // Si sessionStorage no está disponible, el contador se queda en 0.
  }

  // ---------------- 3. BOTONES DE LA NAVBAR ----------------
  // Los botones de buscar, carrito y los filtros de categoría
  // (Mochilas, Ropa, Calzado) llevan al catálogo en la página de inicio.
  const irAlCatalogo = () => window.location.assign("/UI/index.html#productos");
  document
    .querySelectorAll(
      '[data-accion="buscar"], [data-accion="carrito"], [data-filtro]:not([data-filtro="todos"])',
    )
    .forEach((boton) => boton.addEventListener("click", irAlCatalogo));
});
