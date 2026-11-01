// Ruta DescriptionController: @RequestMapping("/api/description")
const BASE_URL = "http://localhost:8080/api/description";

// POST /api/description -> recibe DescriptionRequest { descriptionText, productId }
export const createDescription = async function (descriptionObject) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(descriptionObject),
    });
    if (!response.ok)
      throw Error(`Error al crear la descripcion: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};

// PUT /api/description/{descriptionId} -> actualiza una descripción existente
export const updateDescriptionById = async function (descriptionId, descriptionObject) {
  try {
    const response = await fetch(`${BASE_URL}/${descriptionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(descriptionObject),
    });
    if (!response.ok)
      throw Error(`Error al actualizar la descripcion: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};