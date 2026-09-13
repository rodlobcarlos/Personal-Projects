<<<<<<< HEAD
# Angular construction and Nginx server Dockerfile

FROM node:20-alpine AS build 

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY myPortfolioWeb/package*.json ./

# Install the dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the source code to the working directory
COPY myPortfolioWeb/ ./

# Build the Angular application for production
RUN npx ng build --configuration=production

# Use a lightweight Nginx image for the final stage
FROM nginx:alpine

# Copy the compiled files from the previous stage to the Nginx public directory
# (Adjust the internal path of the dist folder if Angular generates a folder with your project's name)
COPY --from=build /app/dist/myPortfolioWeb /usr/share/nginx/html

# Expose port 4200 for the browser
EXPOSE 4200

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]
=======
# Angular construction and Nginx server Dockerfile

FROM node:20-alpine AS build 

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY myPortfolioWeb/package*.json ./

# Install the dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the source code to the working directory
COPY myPortfolioWeb/ ./

# Build the Angular application for production
RUN npx ng build --configuration=production

# Use a lightweight Nginx image for the final stage
FROM nginx:alpine

# Copy the compiled files from the previous stage to the Nginx public directory
# (Adjust the internal path of the dist folder if Angular generates a folder with your project's name)
COPY --from=build /app/dist/myPortfolioWeb /usr/share/nginx/html

# Expose port 4200 for the browser
EXPOSE 4200

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> e2c0f232a944fe84f870500c00514454e30644c3
