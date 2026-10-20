# Prepare the python slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy and install dependences
COPY python requierements.txt .
RUN pip install -r requirements.txt

# Copy backend source code in the container
COPY app/ ./back/

# Fastapi port
EXPOSE 8000

# Run API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]