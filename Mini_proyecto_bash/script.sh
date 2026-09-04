# Script en bash para obtener la información de estos valores: CPU, RAM, Disco, Servicios, Connectividad y Espacio disponibles.

echo "Información del sistema:"
powershell.exe -Command "Get-CimInstance Win32_Processor | Format-List *"
powershell.exe -Command "Get-CimInstance Win32_ComputerSystem | Format-List *"
#powershell.exe -Command "Get-CimInstance Win32_LogicalDisk | Where-Object {$_.DeviceID -eq 'C:'} | Format-List *"