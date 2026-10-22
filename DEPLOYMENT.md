# TRUSTIQ Deployment Guide (Free Hosting Options)

This guide provides instructions for deploying **TRUSTIQ** completely free of charge.

The project is architected as a **unified full-stack application**: the FastAPI backend serves both the machine learning inference APIs (`/api/*`) and the built React Single-Page Application (`frontend/dist`), eliminating cross-origin CORS issues and requiring only a single free-tier cloud service.

---

## Where to Deploy for Free

| Platform | Recommended For | Free Specs | Cost | Sleep on Inactivity? |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hugging Face Spaces** *(Top Pick)* | ML apps & NLP tools | **16 GB RAM**, 2 vCPUs, 50 GB disk | **100% Free** | **No** (Stays online) |
| **2. Render.com** | Full-stack web apps | 512 MB RAM, 0.5 CPU | **Free Tier** | Yes (Spins down after 15m) |
| **3. Railway / Koyeb** | Fast Docker deployment | 512 MB RAM, 1 vCPU | **Free Trial / Starter** | Minimal |
| **4. Vercel + Render** | Split frontend/backend | Edge CDN + 512 MB Backend | **Free Tier** | Backend spins down |

---

## Option 1: Hugging Face Spaces (Recommended for ML)

Hugging Face Spaces provides **16 GB RAM** and **2 vCPUs** on its free tier, which is ideal for machine learning libraries like scikit-learn, SciPy, and pandas.

### Step-by-Step Instructions:
1. Create a free account at [huggingface.co](https://huggingface.co/) if you don't have one.
2. Click **New Space** ([huggingface.co/new-space](https://huggingface.co/new-space)).
3. Name your space (e.g., `trustiq` or `trust-iq`).
4. Select **Space SDK:** Choose **Docker** -> **Blank**.
5. Select **Space Hardware:** Choose **CPU basic • 2 vCPU • 16GB RAM • Free**.
6. Set privacy to **Public**.
7. Click **Create Space**.
8. In the repository settings, you can either:
   - Connect your GitHub repository (`https://github.com/Manindra-babu/Trust-IQ`) via GitHub Sync, **OR**
   - Push your code to the Hugging Face git remote:
     ```bash
     git remote add space https://huggingface.co/spaces/YOUR_USERNAME/trustiq
     git push space main
     ```
9. Hugging Face will automatically detect the provided [Dockerfile](file:///c:/Users/manin/OneDrive/Desktop/Projects/Fake_News/Dockerfile), build the React frontend, load all trained models, and launch the application on port 7860/8000.

---

## Option 2: Render.com (Full-Stack 1-Service Free Tier)

Render can build the entire application and host both the frontend and backend under one free HTTPS domain.

### Step-by-Step Instructions:
1. Sign up for a free account at [render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/Manindra-babu/Trust-IQ`.
4. Configure the service:
   - **Name:** `trustiq`
   - **Region:** Any (e.g., Oregon or Frankfurt)
   - **Branch:** `main` (or `master`)
   - **Runtime:** `Python` (or `Docker`)
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..
     ```
   - **Start Command:**
     ```bash
     uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type:** Choose **Free**.
5. Click **Create Web Service**.
6. Render will build the Vite assets, install dependencies, and provide a live URL such as `https://trustiq.onrender.com`.

*(Note: On the Render free tier, web services spin down after 15 minutes of inactivity and take ~30-50 seconds to wake up on the first visit.)*

---

## Option 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the React frontend on Vercel's global edge network:

### 1. Backend on Render:
- Follow Option 2, but set:
  - **Build Command:** `pip install -r requirements.txt`
  - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Copy your backend URL (e.g., `https://trustiq-api.onrender.com`).

### 2. Frontend on Vercel:
- Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
- Import `https://github.com/Manindra-babu/Trust-IQ`.
- Set **Root Directory** to `frontend`.
- In **Environment Variables**, add:
  - `VITE_API_BASE`: `https://trustiq-api.onrender.com/api`
- Click **Deploy**.

---

## Local Verification Before Pushing

To test the production build locally exactly as it will run on Render or Docker:

```bash
# 1. Build frontend bundle
cd frontend
npm run build
cd ..

# 2. Run backend (it will automatically serve the built frontend at /)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open `http://127.0.0.1:8000` in your browser to verify both the UI and the API work on the same port.
