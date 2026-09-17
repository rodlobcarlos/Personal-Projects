# Java construction and JRE server Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and the pom.xml file to the working directory
COPY . .

# Make the Maven wrapper executable and build the application, skipping tests
RUN chmod +x mvnw

# Build the application using Maven, skipping tests
RUN ./mvnw clean package -DskipTests

# Use a lightweight JRE image for the final stage
# Copiamos solo los archivos de configuración de Maven para aprovechar la caché
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Descargamos las dependencias (falla menos si el código fuente cambia)
RUN ./mvnw dependency:go-offline -B

# Copiamos el resto del código fuente
COPY src ./src

# Compilamos saltando los tests
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the build stage to the final image
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the application will run on
EXPOSE 8080

# Start the application using the Java command
ENTRYPOINT ["java", "-jar", "app.jar"]

# Copiamos el JAR generado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
