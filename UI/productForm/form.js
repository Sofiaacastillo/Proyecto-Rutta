//todo Seleccionamos el formulario y los campos de entrada

const formProduct = document.querySelector("#formProducto");

const nombre = document.querySelector("#nombre");
const precio = document.querySelector("#precio");
const categoria = document.querySelector("#categoria");
const imagen = document.querySelector("#imagen");
const talla = document.querySelector("#talla");
const color = document.querySelector("#color");
const nivel = document.querySelector("#nivel");
const actividad = document.querySelector("#actividad");
const terreno = document.querySelector("#terreno");
const ideal = document.querySelector("#ideal");
const caracteristicas = document.querySelector("#caracteristicas");

const lista = document.querySelector("#listaProductos");

const btnSubmit = document.querySelector("#btnSubmit");

//todo Agregamos un evento al botón de envío del formulario
formProduct.addEventListener("submit", (e) => {
  //todo previenimos el comportamiento por defecto del formulario
  e.preventDefault();
  console.log(e);

  //todo convertimos los datos del formulario en un objeto
  const product = Object.fromEntries([...new FormData(formProduct)]);
  console.log(product);

  //TODO Validamos que todos los campos del formulario estén completos
  if (
    product.nombre === "" ||
    product.precio === "" ||
    product.categoria === "" ||
    product.imagen === "" ||
    product.talla === "" ||
    product.color === "" ||
    product.nivel === "" ||
    product.actividad === "" ||
    product.terreno === "" ||
    product.ideal === "" ||
    product.caracteristicas === ""
  ) {
    alert("Por favor, complete todos los campos del formulario.");
    return;
  } else if (!isNaN(product.nombre)) {
    alert("El nombre del producto no puede ser un número.");
    return;
  }

  lista.insertAdjacentHTML(
    "beforeend",
    `
            <tr>
              <td>0</td>
              <td>${product.nombre}</td>
              <td>${product.precio}</td>
              <td>${product.categoria}</td>
              <td><img src="${product.imagen}" alt="${product.nombre}" width="50" height="50"></td>
              <td>${product.talla}</td>
              <td>${product.color}</td>
              <td>${product.nivel}</td>
              <td>${product.actividad}</td>
              <td>${product.terreno}</td>
              <td>${product.ideal}</td>
              <td>${product.caracteristicas}</td>
            </tr>
     `,
  );
});
