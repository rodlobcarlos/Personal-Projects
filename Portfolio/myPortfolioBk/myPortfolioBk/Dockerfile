# ==========================================
# Etapa 1: Compilación
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

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

# ==========================================
# Etapa 2: Ejecución
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el JAR generado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]