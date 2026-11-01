// Ruta ColorController: @RequestMapping("/api/color")
const BASE_URL = "http://localhost:8080/api/color";

// GET /api/color -> devuelve la lista de colores
export const getAllColors = async function () {
  try {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw Error(`Error al obtener los colores: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};

// POST /api/color -> recibe ColorRequest { colorName }
export const createColor = async function (colorObject) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colorObject),
    });
    if (!response.ok)
      throw Error(`Error al crear el color: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};