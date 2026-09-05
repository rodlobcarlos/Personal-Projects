# Script para automatizar la información de datos en un archivo bash

# Abrir el archivo bash y leer su contenido
import subprocess
from pathlib import Path

# Obtener la ruta del script bash
ruta_script_sh = Path(__file__).resolve().parent.parent / "Mini_proyecto_bash" / "script.sh"

# Convertir la ruta del script bash a la ruta de WSL
ruta_wsl = subprocess.check_output(
    ["wsl.exe", "wslpath", str(ruta_script_sh)],
    text=True
).strip()

# Ejecutar el script bash en WSL y capturar la salida
salida = subprocess.run(
    ["wsl.exe", "bash", ruta_wsl],
    check=True,
    capture_output=True,
    text=True
)

print(salida.stdout)