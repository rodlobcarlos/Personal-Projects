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
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the build stage to the final image
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the application will run on
EXPOSE 8080

# Start the application using the Java command
ENTRYPOINT ["java", "-jar", "app.jar"]
