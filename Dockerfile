# ==============================================================================
# TRUSTIQ Unified Full-Stack Dockerfile
# Serves both the React Vite frontend and FastAPI ML backend on a single port.
# Compatible with: Hugging Face Spaces (free), Render (free), Railway, Fly.io
# ==============================================================================

# Stage 1: Build React Vite Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend with Trained ML Models
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    TRUSTIQ_HOST=0.0.0.0

# Install minimal build utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python ML dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and trained classical ML models
COPY backend/ ./backend/
COPY data/ ./data/
COPY models/ ./models/

# Copy built frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

# Start Uvicorn serving both API and static SPA
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
