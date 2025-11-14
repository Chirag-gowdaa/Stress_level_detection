# Deployment Guide

This guide explains how to deploy the Stress Level Predictor application with the backend on Render and frontend on Vercel.

## Backend Deployment (Render)

### Prerequisites
- GitHub repository with your code
- Render account

### Steps

1. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `stress-level-detection` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
   - **Root Directory**: `backend`

3. **Important Settings**
   - Make sure `model.pkl` and `scaler.pkl` are in the `backend` directory
   - The `Procfile` should be in the `backend` directory (already configured)
   - Render will automatically detect the `PORT` environment variable

4. **Environment Variables** (Optional)
   - No environment variables are required for basic deployment
   - The server will use port from Render's `PORT` environment variable

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note your backend URL (e.g., `https://stress-level-detection.onrender.com`)

### Health Check
After deployment, test the health endpoint:
```
GET https://your-backend-url.onrender.com/health
```

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository with your code
- Vercel account
- Backend URL from Render

### Steps

1. **Create a new Project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure the Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

3. **Environment Variables**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL`
   - Value: Your Render backend URL (e.g., `https://stress-level-detection.onrender.com`)
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your frontend will be live!

## Troubleshooting

### Backend Issues

1. **Model files not found**
   - Ensure `model.pkl` and `scaler.pkl` are in the `backend` directory
   - Check that they're committed to your repository

2. **CORS errors**
   - The backend is configured to allow all origins
   - If you want to restrict it, update `server.py` line 11:
     ```python
     CORS(app, resources={r"/*": {"origins": ["https://your-vercel-domain.vercel.app"]}})
     ```

3. **Server not starting**
   - Check Render logs for errors
   - Verify `gunicorn` is in `requirements.txt`
   - Ensure `Procfile` is correct: `web: gunicorn server:app`

### Frontend Issues

1. **API calls failing**
   - Verify `REACT_APP_API_URL` is set correctly in Vercel
   - Check browser console for CORS errors
   - Ensure backend is running and accessible

2. **Build failures**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Try clearing Vercel cache and redeploying

3. **Environment variable not working**
   - Environment variables must start with `REACT_APP_` in Create React App
   - Redeploy after adding/changing environment variables
   - Variables are injected at build time, not runtime

## Testing

### Local Testing

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python server.py
   ```
   Backend runs on `http://localhost:5000`

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   # Create .env file with: REACT_APP_API_URL=http://localhost:5000
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Production Testing

1. Test backend health endpoint:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. Test prediction endpoint:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/predict \
     -H "Content-Type: application/json" \
     -d '{"data": [8, 5, 7, 50, 0]}'
   ```

3. Visit your Vercel frontend URL and test the full flow

## Notes

- Render free tier services may spin down after inactivity (cold starts)
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on service
- Vercel has excellent free tier with no cold starts

