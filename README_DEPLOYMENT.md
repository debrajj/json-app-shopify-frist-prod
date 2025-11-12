# Deployment Guide

## Vercel Deployment

This app is configured to deploy on Vercel with the following setup:

### Important Notes:
1. **Socket.io**: Real-time updates via Socket.io may not work on Vercel's serverless functions. The app is designed to work without it.
2. **Environment Variables**: Make sure to add all environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SHOPIFY_ACCESS_TOKEN`
   - `SHOPIFY_SHOP_DOMAIN`
   - `HOST`
   - `PORT` (optional, Vercel will use its own)

### Deployment Steps:
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Alternative: Deploy on Railway/Render
For full Socket.io support, consider deploying on:
- Railway.app
- Render.com
- Heroku

These platforms support long-running Node.js servers with WebSocket connections.

## Local Development
```bash
npm install
npm start
```

Server will run on http://localhost:3001
