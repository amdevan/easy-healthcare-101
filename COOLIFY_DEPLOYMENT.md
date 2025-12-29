# Coolify Deployment Guide

Complete guide for deploying Easy Healthcare 101 on Coolify.

## Prerequisites

- Coolify instance (self-hosted or cloud)
- GitHub repository with your code
- PostgreSQL database (can be provisioned through Coolify)

## Quick Start

### 1. Prepare Your Repository

Ensure all configuration files are committed and pushed:

```bash
git add .
git commit -m "Add Coolify deployment configuration"
git push origin main
```

### 2. Create Application in Coolify

1. **Log in to Coolify Dashboard**
2. **Create New Resource** → **Application**
3. **Connect GitHub Repository**
   - Select your repository: `amdevan/easy-healthcare-101`
   - Branch: `main`
4. **Build Pack**: Choose **Dockerfile** (Coolify will use the root `Dockerfile`)

### 3. Provision PostgreSQL Database

1. In Coolify, go to **Resources** → **New Database**
2. Select **PostgreSQL 15**
3. Set database name: `doctor`
4. Note the connection details (host, port, username, password)

### 4. Configure Environment Variables

In your Coolify application settings, add these environment variables:

#### Required Variables

```env
# Application
APP_NAME="Easy Healthcare 101"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Database (use Coolify's PostgreSQL connection details)
DB_CONNECTION=pgsql
DB_HOST=postgres-service-name
DB_PORT=5432
DB_DATABASE=doctor
DB_USERNAME=postgres
DB_PASSWORD=your-db-password

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Optional: Seed database on first deployment
SEED_DATABASE=true
```

#### Generate APP_KEY

Run this locally to generate an application key:

```bash
cd backend
php artisan key:generate --show
```

Copy the output (including `base64:` prefix) to the `APP_KEY` environment variable.

### 5. Deploy

1. Click **Deploy** in Coolify
2. Monitor the build logs
3. Wait for deployment to complete (first deployment may take 3-5 minutes)

### 6. Verify Deployment

Once deployed, verify the application:

1. **Health Check**: Visit `https://your-domain.com/api/health`
   - Should return: `{"status":"healthy",...}`

2. **Frontend**: Visit `https://your-domain.com`
   - Should load the Easy Healthcare 101 homepage

3. **API**: Visit `https://your-domain.com/api/doctors`
   - Should return JSON response with doctors data

## Advanced Configuration

### Using Coolify's Managed PostgreSQL

If using Coolify's managed PostgreSQL service:

1. The database service will be on the same network
2. Use the internal service name as `DB_HOST`
3. Coolify automatically handles networking between services

### Custom Domain

1. In Coolify, go to your application settings
2. Add your custom domain
3. Coolify will automatically provision SSL certificate via Let's Encrypt

### Scaling

To scale your application:

1. Go to application settings in Coolify
2. Adjust resource limits (CPU, Memory)
3. For horizontal scaling, use Coolify's load balancer features

## Deployment Options

### Option 1: Dockerfile (Recommended)

Uses the root `Dockerfile` for multi-stage build:
- ✅ Full control over build process
- ✅ Optimized production image
- ✅ Frontend and backend in single container

### Option 2: Nixpacks

Uses `nixpacks.toml` configuration:
- ✅ Simpler configuration
- ✅ Automatic dependency detection
- ⚠️ May require additional configuration

To use Nixpacks, select **Nixpacks** as build pack in Coolify.

## Troubleshooting

### Build Fails

**Issue**: Docker build fails during frontend or backend build

**Solution**:
- Check build logs in Coolify
- Ensure all dependencies are in `package.json` and `composer.json`
- Verify Node.js and PHP versions match requirements

### Database Connection Error

**Issue**: Application can't connect to database

**Solution**:
- Verify `DB_HOST` matches PostgreSQL service name in Coolify
- Check database credentials in environment variables
- Ensure database service is running and healthy

### Health Check Fails

**Issue**: Health check endpoint returns 503 or times out

**Solution**:
- Check application logs in Coolify
- Verify database connection is working
- Ensure migrations have run successfully

### Frontend Not Loading

**Issue**: Frontend shows 404 or blank page

**Solution**:
- Verify frontend build completed successfully
- Check that `dist` files were copied to `backend/public/`
- Review Apache configuration in Dockerfile

## Maintenance

### Running Migrations

Migrations run automatically on deployment via `entrypoint.sh`. To run manually:

```bash
# In Coolify terminal
cd backend
php artisan migrate --force
```

### Clearing Cache

```bash
# In Coolify terminal
cd backend
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Viewing Logs

Access logs in Coolify:
1. Go to your application
2. Click **Logs** tab
3. View real-time application logs

## Environment-Specific Notes

### Production Checklist

- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] Strong `APP_KEY` generated
- [ ] Secure database password
- [ ] SSL certificate configured
- [ ] Custom domain configured
- [ ] Database backups enabled in Coolify

### Staging Environment

For a staging environment, create a separate application in Coolify with:
- Different domain (e.g., `staging.your-domain.com`)
- Separate database
- `APP_ENV=staging`
- `APP_DEBUG=true` (optional, for debugging)

## Support

For issues specific to:
- **Coolify**: Check [Coolify Documentation](https://coolify.io/docs)
- **Application**: Review application logs and health check endpoint
- **Database**: Verify PostgreSQL service status in Coolify
