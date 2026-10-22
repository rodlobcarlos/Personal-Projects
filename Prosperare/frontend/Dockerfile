# Prepare reflex image
FROM python:3.12-slim

# Set working directory
WORKDIR /frontend

# Install necessary tools for reflex
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy and intall dependences
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend source code in the container
COPY . .

# Reflex frontend and backend port
EXPOSE 3000

# Run reflex
CMD ["reflex", "run", "--env", "prod", "--backend-host", "0.0.0.0"]