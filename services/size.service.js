// Ruta SizeController: @RequestMapping("/api/size")
const BASE_URL = "http://localhost:8080/api/size";

// GET /api/size -> devuelve la lista de tallas
export const getAllSizes = async function () {
  try {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw Error(`Error al obtener las tallas: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};

// POST /api/size -> recibe SizeRequest { sizeValue }
export const createSize = async function (sizeObject) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sizeObject),
    });
    if (!response.ok)
      throw Error(`Error al crear la talla: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};