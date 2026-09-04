#!/bin/bash

# Script en bash para obtener la información de estos valores: CPU, RAM, Disco, Servicios, Connectividad y Espacio disponibles.
{
    echo "=== INFORMACION DE LA CPU ==="
    # Muestra el modelo de la CPU en el sistema
    grep -m 1 "model name" /proc/cpuinfo | cut -d: -f2 | xargs

    echo # Agrega una línea en blanco para separar la información
    echo "=== INFORMACION DE LA RAM ==="
    # Muestra la información de la memoria RAM disponible en el sistema
    cat /proc/meminfo | head -n 4

    echo
    echo "=== INFORMACION DEL DISCO ==="
    df -h

    echo
    echo "=== INFORMACION DE LOS SERVICIOS ==="
    # Muestra los primeros 10 servicios en ejecución en Windows usando PowerShell
    powershell.exe -Command "Get-Service | Where-Object {\$_.Status -eq 'Running'} | Select-Object -First 10 | Format-Table Name, DisplayName, Status" | tr -d '\r'

    echo "=== INFORMACION DE CONECTIVIDAD ==="
    # Muestra las conexiones TCP activas y los puertos que están escuchando (listening)
    netstat -ano | grep -E "LISTENING|ESTABLISHED" | head -n 15

    echo
    echo "=== INFORMACION DE ESPACIO DISPONIBLE ==="
    # Muestra la información de los discos físicos en el sistema usando PowerShell
    powershell.exe -Command "Get-PhysicalDisk | Select-Object DeviceId, Model, MediaType, @{Name='Size_GB';Expression={[Math]::Round(\$_.Size / 1GB, 2)}}" | tr -d '\r';
} > informe.txt