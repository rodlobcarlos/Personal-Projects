# Script para automatizar la información de datos en un archivo bash

# Abrir el archivo bash y leer su contenido
import subprocess
from pathlib import Path # Importar la clase Path del módulo pathlib para manejar rutas de archivos

# Definir la ruta del script bash
ruta_script_sh = Path(__file__).resolve().parent.parent / "Mini_proyecto_bash" / "script.sh"

# Ejecutar el script bash y capturar su salida
salida = subprocess.run(['bash', str(ruta_script_sh)], 
                        check=True,
                        stdout=subprocess.PIPE, # Capturar la salida estándar
                        stderr=subprocess.PIPE) # Capturar la salida estándar y el error estándar

print(salida.stdout.decode('utf-8')) # Imprimir la salida del script bash