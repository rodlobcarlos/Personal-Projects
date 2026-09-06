# Script para automatizar la información de datos en un archivo bash

# Abrir el archivo bash y leer su contenido
import subprocess
from pathlib import Path

# Obtener la ruta del script bash
ruta_script_sh = Path(__file__).resolve().parent.parent / "Mini_proyecto_bash" / "script.sh"

if not ruta_script_sh.exists():
    raise FileNotFoundError(f"No se encontró el archivo: {ruta_script_sh}")

# Convertir la ruta del script bash a la ruta de WSL
ruta_wsl = subprocess.check_output(
    ["wsl.exe", "wslpath", ruta_script_sh.as_posix()],
    text=True
).strip()

# Ejecutar el script bash en WSL y capturar la salida
salida = subprocess.run(
    ["wsl.exe", "bash", ruta_wsl],
    check=True,
    capture_output=True,
    text=True
)

# Imprimir la salida de error del script bash, si existe
print("Errores del script bash (si los hay):")
if salida.stderr.strip() == "": 
    print("No se encontraron errores.")
else:
    print(salida.stderr)

# Imprimir la salida del script bash
print("Salida del script bash:")
print(salida.stdout)