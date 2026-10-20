# Prepare reflex image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy and intall dependences
COPY python requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend source code in the container
COPY rxconfig.py .
COPY frontend/ ./frontend/

# Reflex frontend and backend port
EXPOSE 3000 3001

# Run reflex
CMD ["reflex", "run", "--env", "prod", "--frontend-only", "--backend-host", "0.0.0.0"]