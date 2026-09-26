from PIL import Image
import os
import pillow_avif  # permite abrir archivos .avif

CARPETA_ORIGEN = "imagenes-sin-procesar"
CARPETA_DESTINO = "img/productos"
TAMANO_FINAL = (800, 800)
COLOR_FONDO = (255, 255, 255)  # blanco — cambia si tu UI usa otro fondo

os.makedirs(CARPETA_DESTINO, exist_ok=True)

def encajar_sin_deformar(img, tamano):
    """Redimensiona SIN deformar y agrega márgenes si hace falta."""
    ancho_obj, alto_obj = tamano
    img.thumbnail(tamano, Image.LANCZOS)  # nunca corta, solo achica

    lienzo = Image.new("RGB", tamano, COLOR_FONDO)
    x = (ancho_obj - img.width) // 2
    y = (alto_obj - img.height) // 2
    lienzo.paste(img, (x, y))
    return lienzo

for archivo in os.listdir(CARPETA_ORIGEN):
    ruta = os.path.join(CARPETA_ORIGEN, archivo)
    nombre_base = os.path.splitext(archivo)[0]
    try:
        img = Image.open(ruta).convert("RGB")
        img = encajar_sin_deformar(img, TAMANO_FINAL)
        salida = os.path.join(CARPETA_DESTINO, nombre_base + ".jpg")
        img.save(salida, "JPEG", quality=90)
        print(f"✅ {archivo} → {nombre_base}.jpg")
    except Exception as e:
        print(f"❌ {archivo}: {e}")