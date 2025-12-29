# Backend Quick Start

Deploy the Easy Healthcare 101 backend API to Coolify.

## Prerequisites

- Coolify instance
- PostgreSQL database (provision in Coolify)
- Domain: `api.yourdomain.com` (optional)

## Deployment Steps

### 1. Create Application

- **Name**: `easy-healthcare-backend`
- **Repository**: `amdevan/easy-healthcare-101`
- **Branch**: `main`
- **Build Pack**: Dockerfile
- **Dockerfile**: `backend/Dockerfile`
- **Base Directory**: `backend`

### 2. Environment Variables

```env
APP_NAME="Easy Healthcare 101"
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=easy-healthcare-db
DB_PORT=5432
DB_DATABASE=doctor
DB_USERNAME=postgres
DB_PASSWORD=your-password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

SEED_DATABASE=true
```

### 3. Generate APP_KEY

```bash
cd backend
php artisan key:generate --show
```

### 4. Deploy

Click **Deploy** and wait 3-5 minutes.

### 5. Verify

Visit: `https://api.yourdomain.com/api/health`

Expected:
```json
{"status":"healthy"}
```

## Troubleshooting

- **Database connection error**: Check `DB_HOST` and credentials
- **Build fails**: Check Dockerfile syntax and Composer dependencies
- **Health check fails**: View logs in Coolify

## Full Documentation

See [COOLIFY_DEPLOYMENT.md](../COOLIFY_DEPLOYMENT.md) for complete guide.
