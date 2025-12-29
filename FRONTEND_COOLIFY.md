# Frontend Quick Start

Deploy the Easy Healthcare 101 frontend to Coolify.

## Prerequisites

- Coolify instance
- Backend API deployed and accessible
- Domain: `yourdomain.com` (optional)

## Deployment Steps

### 1. Create Application

- **Name**: `easy-healthcare-frontend`
- **Repository**: `amdevan/easy-healthcare-101`
- **Branch**: `main`
- **Build Pack**: Dockerfile
- **Dockerfile**: `Dockerfile.frontend`

### 2. Environment Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

> **Important**: Point to your backend API URL

### 3. Deploy

Click **Deploy** and wait 2-3 minutes.

### 4. Verify

Visit: `https://yourdomain.com`

The frontend should load and communicate with the backend.

## Troubleshooting

- **CORS errors**: Check backend `FRONTEND_URL` environment variable
- **API connection fails**: Verify `VITE_API_URL` is correct
- **Build fails**: Check Node.js version and npm dependencies

## Configuration

### API URL

The frontend uses `src/config/api.ts` to determine the API URL:

- **Production**: Uses `VITE_API_URL` environment variable
- **Development**: Defaults to `http://localhost:8000/api`

### Nginx

Static files are served by Nginx with:
- Gzip compression
- Security headers
- SPA routing support
- Static asset caching

## Full Documentation

See [COOLIFY_DEPLOYMENT.md](./COOLIFY_DEPLOYMENT.md) for complete guide.
