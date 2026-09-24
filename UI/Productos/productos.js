// ================================================================
// 1. INFORMACIÓN DE LOS PRODUCTOS
// Este arreglo funciona como una pequeña base de datos local.
// ================================================================
const productos = [
    // Primer objeto: representa la mochila mostrada en la referencia.
    {
        id: 1,
        categoria: "mochilas",
        categoriaNombre: "Mochilas",
        iconoCategoria: "bi-backpack4",
        imagen: "/",
        nombre: "Mochila Trek 45L",
        precio: 1799,
        resumen: "...",
        nivel: "Básico",
        actividad: "Senderismo de 1 a 3 días",
        terreno: "Clima templado / senderos",
        ideal: "Capacidad y organización",
        capacidad: "45 L",
        caracteristicas: [
            "Tejido resistente al agua y a la abrasión",
            "Espalda acolchada y transpirable",
        ],
        recomendado: true,
    },
    // Segundo objeto: representa la chamarra verde y dorada.
    {
        id: 2,
        categoria: "ropa",
        categoriaNombre: "Ropa",
        iconoCategoria: "bi-person-standing-dress",
        imagen: "/img/productos/chamarra-trail-shell.svg",
        nombre: "Chamarra Trail Shell",
        precio: 1499,
        resumen: "Capa ligera e impermeable que te protege del viento y la lluvia sin limitar tu movimiento.",
        nivel: "Principiante",
        actividad: "Rutas frescas o con viento",
        terreno: "Clima cambiante / montañoso",
        ideal: "Protección ligera e impermeable",
        tallas: ["CH", "M", "G", "XG"],
        caracteristicas: [
            "Impermeable y corta-viento",
            "Ligera, compacta y fácil de empacar",
            "Transpirable para mantenerte seco",
        ],
        recomendado: false,
    },
    // Tercer objeto: representa las botas de senderismo.
    {
        id: 3,
        categoria: "calzado",
        categoriaNombre: "Calzado",
        iconoCategoria: "bi-boot",
        imagen: "/img/productos/botas-sendero-pro.svg",
        nombre: "Botas Sendero Pro",
        precio: 2199,
        resumen: "Botas de senderismo resistentes y cómodas para terrenos exigentes y largas caminatas.",
        nivel: "Intermedio",
        actividad: "Rutas rocosas o largas",
        terreno: "Terreno mixto / rocoso",
        ideal: "Agarre y estabilidad",
        tallas: [22, 23, 24, 25, 26, 27],
        caracteristicas: [
            "Suela Vibram® con excelente agarre",
            "Puntera y talón reforzados",
            "Soporte de tobillo y plantilla anatómica",
        ],
        recomendado: false,
    },
]





// ================================================================
// 2. REFERENCIAS A ELEMENTOS DEL DOCUMENTO
// querySelector permite encontrar elementos usando selectores de CSS.
// ================================================================