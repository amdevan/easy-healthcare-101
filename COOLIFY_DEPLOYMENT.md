# Coolify Deployment Guide - Separate Services

Deploy Easy Healthcare 101 as two independent services in Coolify: a Laravel backend API and a React frontend application.

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend   │────────▶│  PostgreSQL │
│   (Nginx)   │   API   │  (Laravel)  │   DB    │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
```

**Benefits:**
- ✅ Independent scaling
- ✅ Faster frontend serving (Nginx)
- ✅ Independent deployments
- ✅ Better resource management

## Prerequisites

- Coolify instance
- GitHub repository
- Domain names (optional but recommended):
  - `api.yourdomain.com` for backend
  - `yourdomain.com` for frontend

---

## Part 1: Deploy Backend API

### 1. Create Backend Application in Coolify

1. **New Resource** → **Application**
2. **Name**: `easy-healthcare-backend`
3. **Connect GitHub**: `amdevan/easy-healthcare-101`
4. **Branch**: `main`
5. **Build Pack**: **Dockerfile**
6. **Dockerfile Location**: `backend/Dockerfile`
7. **Base Directory**: `backend`

### 2. Provision PostgreSQL Database

1. **New Resource** → **Database** → **PostgreSQL 15**
2. **Name**: `easy-healthcare-db`
3. **Database**: `doctor`
4. Note the connection details

### 3. Configure Backend Environment Variables

In Coolify backend application settings, add:

```env
# Application
APP_NAME="Easy Healthcare 101"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Database (use Coolify's PostgreSQL internal connection)
DB_CONNECTION=pgsql
DB_HOST=easy-healthcare-db
DB_PORT=5432
DB_DATABASE=doctor
DB_USERNAME=postgres
DB_PASSWORD=your-db-password

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# CORS (important for frontend communication)
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=.yourdomain.com

# Optional: Seed database on first deployment
SEED_DATABASE=true
```

> [!IMPORTANT]
> **Generate APP_KEY**: Run `cd backend && php artisan key:generate --show` locally and copy the output

### 4. Configure Domain (Optional)

1. In backend application settings → **Domains**
2. Add: `api.yourdomain.com`
3. Coolify will provision SSL automatically

### 5. Deploy Backend

1. Click **Deploy**
2. Monitor build logs
3. Wait for deployment (3-5 minutes)
4. Verify: `https://api.yourdomain.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-29T...",
  "services": {
    "database": "healthy",
    "application": "healthy"
  }
}
```

---

## Part 2: Deploy Frontend

### 1. Create Frontend Application in Coolify

1. **New Resource** → **Application**
2. **Name**: `easy-healthcare-frontend`
3. **Connect GitHub**: `amdevan/easy-healthcare-101`
4. **Branch**: `main`
5. **Build Pack**: **Dockerfile**
6. **Dockerfile Location**: `Dockerfile.frontend`
7. **Docker Build Args**:
   - Use `.dockerignore.frontend` by renaming or configuring

### 2. Configure Frontend Environment Variables

```env
# API URL (point to your backend)
VITE_API_URL=https://api.yourdomain.com/api
```

> [!WARNING]
> Make sure `VITE_API_URL` points to your backend API URL (including `/api` path)

### 3. Configure Domain

1. In frontend application settings → **Domains**
2. Add: `yourdomain.com` (or `www.yourdomain.com`)
3. Coolify will provision SSL automatically

### 4. Deploy Frontend

1. Click **Deploy**
2. Monitor build logs
3. Wait for deployment (2-3 minutes)
4. Verify: `https://yourdomain.com`

---

## Part 3: Configure CORS (Backend)

To allow frontend to communicate with backend, update backend CORS configuration:

### Option 1: Update in Coolify Environment Variables

Already configured if you set `FRONTEND_URL` in backend environment variables.

### Option 2: Manual Configuration (if needed)

Edit `backend/config/cors.php`:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
],
```

---

## Verification Checklist

After deploying both services:

- [ ] Backend health check responds: `https://api.yourdomain.com/api/health`
- [ ] Frontend loads: `https://yourdomain.com`
- [ ] Frontend can fetch data from backend (check browser console for errors)
- [ ] No CORS errors in browser console
- [ ] Database migrations ran successfully
- [ ] SSL certificates are active on both domains

---

## Environment-Specific Configuration

### Production

**Backend:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Staging

**Backend:**
```env
APP_ENV=staging
APP_DEBUG=true
APP_URL=https://api-staging.yourdomain.com
FRONTEND_URL=https://staging.yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://api-staging.yourdomain.com/api
```

---

## Scaling

### Scale Backend

1. Go to backend application in Coolify
2. Adjust resources (CPU, Memory)
3. For horizontal scaling, use load balancer

### Scale Frontend

1. Frontend is stateless (Nginx serving static files)
2. Can easily scale horizontally
3. Add CDN for better performance (optional)

---

## Troubleshooting

### CORS Errors

**Issue**: Browser shows CORS policy errors

**Solution**:
1. Verify `FRONTEND_URL` in backend environment variables
2. Check `backend/config/cors.php` configuration
3. Ensure backend is accessible from frontend domain

### Frontend Can't Connect to Backend

**Issue**: API requests fail or timeout

**Solution**:
1. Verify `VITE_API_URL` in frontend environment variables
2. Check backend health endpoint is accessible
3. Verify network connectivity between services

### Database Connection Error

**Issue**: Backend can't connect to database

**Solution**:
1. Verify `DB_HOST` matches PostgreSQL service name in Coolify
2. Check database credentials
3. Ensure database service is running

### Build Fails

**Backend Build Fails**:
- Check `backend/Dockerfile` syntax
- Verify Composer dependencies
- Check build logs for specific errors

**Frontend Build Fails**:
- Check `Dockerfile.frontend` syntax
- Verify npm dependencies in `package.json`
- Ensure Node.js version compatibility

---

## Maintenance

### Update Backend

1. Push changes to GitHub
2. Coolify auto-deploys (if enabled) or click **Deploy**
3. Migrations run automatically via `entrypoint.sh`

### Update Frontend

1. Push changes to GitHub
2. Coolify rebuilds and deploys
3. No downtime (Nginx serves new build)

### Database Migrations

Migrations run automatically on backend deployment. To run manually:

```bash
# In Coolify backend terminal
php artisan migrate --force
```

### View Logs

**Backend Logs**:
1. Go to backend application in Coolify
2. Click **Logs** tab
3. View real-time Laravel logs

**Frontend Logs**:
1. Go to frontend application in Coolify
2. Click **Logs** tab
3. View Nginx access/error logs

---

## Cost Optimization

### Resource Allocation

**Backend** (API server):
- CPU: 1-2 cores
- Memory: 1-2 GB
- Storage: 10 GB

**Frontend** (Static files):
- CPU: 0.5-1 core
- Memory: 512 MB - 1 GB
- Storage: 5 GB

### Database

- PostgreSQL: 1-2 GB memory
- Storage: Based on data size

---

## Security Best Practices

- [ ] Use strong `APP_KEY` for backend
- [ ] Enable HTTPS on both services (Coolify handles this)
- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong database passwords
- [ ] Configure CORS properly (don't use `*`)
- [ ] Enable rate limiting on backend API
- [ ] Regular database backups (Coolify feature)

---

## Support

For deployment issues:
- **Coolify**: [Coolify Documentation](https://coolify.io/docs)
- **Backend**: Check `/api/health` endpoint and logs
- **Frontend**: Check browser console and Nginx logs
- **Database**: Verify connection in Coolify dashboard
