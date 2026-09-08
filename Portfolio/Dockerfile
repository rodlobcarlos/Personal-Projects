FROM node:20-alpine

# 1. Definimos el directorio de trabajo (crea la carpeta automáticamente)
WORKDIR /home/app

# 2. Copiamos los archivos de dependencias primero
COPY package*.json ./

# 3. Instalamos las dependencias dentro del contenedor
RUN npm install

# 4. Copiamos el resto del código del proyecto
COPY . .

# 5. Exponemos el puerto de Angular
EXPOSE 4200

# 6. Ejecutamos Angular asegurando que escuche conexiones externas
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]