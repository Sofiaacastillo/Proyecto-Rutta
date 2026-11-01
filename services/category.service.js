// Ruta CategoryController: @RequestMapping("/api") -> "categories"
const BASE_URL = "http://localhost:8080/api/categories";

// GET /api/categories -> devuelve la lista de categorías
export const getAllCategories = async function () {
  try {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw Error(`Error al obtener las categorias: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};

// POST /api/categories -> recibe CategoryRequest { categoryName }
export const createCategory = async function (categoryObject) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryObject),
    });
    if (!response.ok)
      throw Error(`Error al crear la categoria: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};