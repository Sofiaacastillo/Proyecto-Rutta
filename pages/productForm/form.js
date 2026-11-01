// Importamos las funciones del CRUD desde los services
import {
  createProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
} from "../../services/product.service.js";
import {
  createDescription,
  updateDescriptionById,
} from "../../services/description.service.js";
import {
  getAllCategories,
  createCategory,
} from "../../services/category.service.js";
import { createColor } from "../../services/color.service.js";
import { createSize } from "../../services/size.service.js";

// Elementos del DOM
const formProduct = document.querySelector("#formProducto");
const lista = document.querySelector("#listaProductos");
const alerta = document.querySelector("#alertaProducto");
const btnSubmit = document.querySelector("#btnSubmit");
const btnCancelarEdicion = document.querySelector("#btnCancelarEdicion");
const tituloFormulario = document.querySelector("#tituloFormulario");
const selectCategory = document.querySelector("#categoryId");

const grupoTallas = document.querySelector("#grupoTallas");

const TALLAS_POR_CATEGORIA = {
  ropa: ["XS", "S", "M", "L", "XL", "XXL"],
  calzado: ["22", "22.5", "23", "23.5", "24", "24.5", "25", "25.5", "26", "26.5", "27", "27.5", "28", "29", "30"]
};

const actualizarTallas = () => {
  const categoriaSeleccionada = categoriasCache.find(
    categoria => String(categoria.id) === selectCategory.value
  );

  const nombreCategoria = categoriaSeleccionada?.categoryName?.toLowerCase();
  const tallas = TALLAS_POR_CATEGORIA[nombreCategoria] || [];

  grupoTallas.innerHTML = "";

  tallas.forEach((talla, index) => {
    const id = `talla${index}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "btn-check";
    input.name = "sizes";
    input.id = id;
    input.value = talla;
    input.autocomplete = "off";

    const label = document.createElement("label");
    label.className = "btn btn-rutta-chip";
    label.htmlFor = id;
    label.textContent = talla;

    grupoTallas.append(input, label);
  });
};

selectCategory.addEventListener("change", actualizarTallas);

// Categorías base predefinidas en el frontend (se aseguran en la BDD al iniciar)
const CATEGORIAS_BASE = ["Mochilas", "Equipo", "Ropa", "Calzado"];

// Guardamos en memoria la lista actual y el producto que se está editando
let productosCache = [];
let categoriasCache = [];
let productoEnEdicion = null;

// Guarda en localStorage qué colores y tallas se eligieron por cada producto para mostrarlos en la tabla
const obtenerExtrasProducto = (productId) => {
  const mapa = JSON.parse(localStorage.getItem("rutta-producto-extras") || "{}");
  return mapa[productId] || { colors: [], sizes: [] };
};

const guardarExtrasProducto = (productId, colors, sizes) => {
  const mapa = JSON.parse(localStorage.getItem("rutta-producto-extras") || "{}");
  mapa[productId] = { colors, sizes };
  localStorage.setItem("rutta-producto-extras", JSON.stringify(mapa));
};

// Muestra una alerta de Bootstrap (tipo: "success", "danger", "warning")
const mostrarAlerta = (mensaje, tipo) => {
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;
};

// Lee todos los checkboxes marcados de un grupo (colors o sizes) como arreglo de strings
const obtenerSeleccionMultiple = (nombreCampo) => {
  return [
    ...formProduct.querySelectorAll(`input[name="${nombreCampo}"]:checked`),
  ].map((checkbox) => checkbox.value);
};

// Marca los checkboxes según un arreglo de valores
const marcarSeleccionMultiple = (nombreCampo, valores = []) => {
  formProduct
    .querySelectorAll(`input[name="${nombreCampo}"]`)
    .forEach((checkbox) => {
      checkbox.checked = valores.includes(checkbox.value);
    });
};

// Carga las categorías desde /api/categories; si la BDD está vacía (por create-drop), crea las 4 base automáticamente
const cargarCategorias = async () => {
  let categorias = (await getAllCategories()) || [];

  // Aseguramos que las 4 categorías predefinidas existan en la base de datos
  for (const nombreBase of CATEGORIAS_BASE) {
    const existe = categorias.some(
      (c) => c.categoryName?.toLowerCase() === nombreBase.toLowerCase(),
    );
    if (!existe) {
      const creada = await createCategory({ categoryName: nombreBase });
      if (creada) categorias.push(creada);
    }
  }

  categoriasCache = categorias;
  selectCategory.innerHTML =
    '<option value="">Selecciona una categoría (opcional)...</option>';

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = categoria.categoryName;
    selectCategory.appendChild(option);
  });
};

// Sale del modo edición y limpia el formulario
const salirModoEdicion = () => {
  
  productoEnEdicion = null;
  formProduct.reset();
  actualizarTallas();
  marcarSeleccionMultiple("colors", []);
  marcarSeleccionMultiple("sizes", []);
  tituloFormulario.textContent = "Añadir Nuevo Producto";
  btnSubmit.innerHTML = `<i class="bi bi-check2-circle me-1"></i> Guardar producto`;
  btnCancelarEdicion.classList.add("d-none");
};

btnCancelarEdicion.addEventListener("click", salirModoEdicion);

// Pinta los badges de un arreglo de colores o tallas
const renderizarChips = (items = []) => {
  if (!items || items.length === 0) return "—";
  return items.map((item) => `<span class="badge-chip">${item}</span>`).join("");
};

// Pinta en la tabla los productos que llegan de la API
const pintarProductos = async () => {
  const productos = await getAllProducts();

  if (!productos) {
    mostrarAlerta("No se pudieron cargar los productos desde la API.", "danger");
    return;
  }

  productosCache = productos;
  lista.innerHTML = "";

  if (productos.length === 0) {
    lista.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-muted py-4">
          No hay productos registrados todavía.
        </td>
      </tr>
    `;
    return;
  }

  productos.forEach((product) => {
    const extras = obtenerExtrasProducto(product.id);
    const coloresBackend =
      product.colors?.length > 0
        ? product.colors.map((c) => c.colorName)
        : extras.colors;
    const tallasMostrar = extras.sizes;

    lista.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td class="fw-bold">#${product.id}</td>
          <td class="fw-semibold">${product.productName}</td>
          <td>$${Number(product.price).toFixed(2)}</td>
          <td>${product.category?.categoryName ?? "—"}</td>
          <td><span class="badge-nivel">${product.level ?? "—"}</span></td>
          <td>${product.activity ?? "—"}</td>
          <td>${renderizarChips(coloresMostrar(coloresBackend))}</td>
          <td>${renderizarChips(tallasMostrar)}</td>
          <td>${product.description?.descriptionText ?? "—"}</td>
          <td class="text-center text-nowrap">
            <button
              type="button"
              class="btn btn-sm btn-accion-editar me-1"
              data-accion="editar"
              data-id="${product.id}"
              title="Editar producto"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-accion-eliminar"
              data-accion="eliminar"
              data-id="${product.id}"
              title="Eliminar producto"
            >
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
      `,
    );
  });
};

function coloresMostrar(listaColores) {
  return Array.isArray(listaColores) ? listaColores : [];
}

// Eventos de los botones Editar (lapicito) y Eliminar (bote de basura) en la tabla
lista.addEventListener("click", async (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;
  const producto = productosCache.find((p) => p.id === id);
  if (!producto) return;

  // --- ACCIÓN: EDITAR (carga los datos en el formulario para hacer PUT) ---
  if (accion === "editar") {
    productoEnEdicion = producto;
    const extras = obtenerExtrasProducto(producto.id);

    formProduct.elements.productName.value = producto.productName ?? "";
    formProduct.elements.price.value = producto.price ?? "";
    formProduct.elements.level.value = producto.level ?? "";
    formProduct.elements.activity.value = producto.activity ?? "";
    formProduct.elements.categoryId.value = producto.category?.id ?? "";
    actualizarTallas();
    formProduct.elements.descriptionText.value =
      producto.description?.descriptionText ?? "";

    marcarSeleccionMultiple("colors", extras.colors);
    marcarSeleccionMultiple("sizes", extras.sizes);

    tituloFormulario.textContent = `Editando Producto #${producto.id}`;
    btnSubmit.innerHTML = `<i class="bi bi-pencil-square me-1"></i> Actualizar producto`;
    btnCancelarEdicion.classList.remove("d-none");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- ACCIÓN: ELIMINAR (hace DELETE /api/product/{id}) ---
  if (accion === "eliminar") {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar "${producto.productName}" (ID #${producto.id})?`,
    );
    if (!confirmar) return;

    await deleteProductById(id);

    if (productoEnEdicion?.id === id) {
      salirModoEdicion();
    }

    mostrarAlerta(`Producto "${producto.productName}" eliminado.`, "success");
    await pintarProductos();
  }
});

// Envío del formulario: hace POST si es nuevo o PUT si se está editando
formProduct.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = Object.fromEntries([...new FormData(formProduct)]);
  const coloresSeleccionados = obtenerSeleccionMultiple("colors");
  const tallasSeleccionadas = obtenerSeleccionMultiple("sizes");
  const textoDescripcion = product.descriptionText?.trim() || "";
  const textoIdeal = product.idealFor?.trim() || "";


  // Validaciones de los campos principales (Categoría, Colores, Tallas y Descripción son opcionales)
  if (
    product.productName.trim() === "" ||
    product.price === "" ||
    product.level === "" ||
    product.activity === ""
  ) {
    mostrarAlerta(
      "Por favor, completa Nombre, Precio, Nivel y Actividad.",
      "warning",
    );
    return;
  } else if (!isNaN(product.productName)) {
    mostrarAlerta("El nombre del producto no puede ser un número.", "warning");
    return;
  } else if (Number(product.price) <= 0) {
    mostrarAlerta("El precio debe ser mayor a 0.", "warning");
    return;
  } else if (textoDescripcion !== "" && textoDescripcion.length < 2) {
    mostrarAlerta(
      "Si escribes una descripción, debe tener entre 2 y 200 caracteres.",
      "warning",
    );
    return;
  }

  // Como ProductRequest tiene @NotNull en categoryId en el backend, si el usuario no eligió categoría
  // usamos automáticamente la primera categoría existente en la BDD para que el backend nunca falle.
  let categoriaIdEnviar = product.categoryId
    ? Number(product.categoryId)
    : categoriasCache[0]?.id;

  if (!categoriaIdEnviar) {
    await cargarCategorias();
    categoriaIdEnviar = categoriasCache[0]?.id;
  }

  // Objeto con los nombres exactos de ProductRequest { productName, price, activity, level, categoryId }
  const productRequest = {
    productName: product.productName.trim(),
    price: Number(product.price),
    activity: product.activity,
    level: product.level,
    categoryId: categoriaIdEnviar,
  };

  btnSubmit.disabled = true;

  // Guardamos en la BDD cada color seleccionado (POST /api/color -> { colorName })
  for (const colorName of coloresSeleccionados) {
    await createColor({ colorName });
  }

  // Guardamos en la BDD cada talla seleccionada (POST /api/size -> { sizeValue })
  for (const sizeValue of tallasSeleccionadas) {
    await createSize({ sizeValue });
  }

  // --- MODO EDICIÓN (PUT) ---
  if (productoEnEdicion) {
    const id = productoEnEdicion.id;
    const productoActualizado = await updateProductById(id, productRequest);

    if (!productoActualizado) {
      mostrarAlerta("Error al actualizar el producto.", "danger");
      btnSubmit.disabled = false;
      return;
    }

    if (textoDescripcion !== "") {
      if (productoEnEdicion.description?.id) {
        await updateDescriptionById(productoEnEdicion.description.id, {
          descriptionText: textoDescripcion,
          productId: id,
        });
      } else {
        await createDescription({
          descriptionText: textoDescripcion,
          productId: id,
        });
      }
    }

    guardarExtrasProducto(id, coloresSeleccionados, tallasSeleccionadas);

    mostrarAlerta(
      `Producto "${productoActualizado.productName}" (#${id}) actualizado correctamente.`,
      "success",
    );
    salirModoEdicion();
    btnSubmit.disabled = false;
    await pintarProductos();
    return;
  }

  // --- MODO CREACIÓN (POST) ---
  const productoCreado = await createProduct(productRequest);

  if (!productoCreado) {
    mostrarAlerta("Error al guardar el producto. Revisa la consola.", "danger");
    btnSubmit.disabled = false;
    return;
  }

  // Si el usuario escribió descripción, la guardamos en /api/description
  if (textoDescripcion !== "") {
    await createDescription({
      descriptionText: textoDescripcion,
      productId: productoCreado.id,
    });
  }

  guardarExtrasProducto(
    productoCreado.id,
    coloresSeleccionados,
    tallasSeleccionadas,
  );

  mostrarAlerta(
    `Producto "${productoCreado.productName}" guardado con id #${productoCreado.id}.`,
    "success",
  );

  
  formProduct.reset();
  actualizarTallas();
  marcarSeleccionMultiple("colors", []);
  marcarSeleccionMultiple("sizes", []);
  btnSubmit.disabled = false;
});

// Al abrir la página primero aseguramos/cargamos las categorías en la BDD y luego pintamos los productos

const inicializar = async () => {
  await cargarCategorias();
  actualizarTallas();
  await pintarProductos();
};

inicializar();