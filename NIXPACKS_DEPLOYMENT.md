# Nixpacks Deployment Guide

Alternative deployment method using Nixpacks instead of Docker. Nixpacks is simpler and automatically detects dependencies.

## When to Use Nixpacks

**Advantages:**
- ✅ Simpler configuration
- ✅ Automatic dependency detection
- ✅ Faster builds (no Docker layers)
- ✅ Less configuration to maintain

**Use Nixpacks if:**
- You want simpler deployment
- You don't need custom Docker configurations
- You're okay with Coolify's defaults

**Use Docker if:**
- You need full control over the build process
- You have complex multi-stage builds
- You need specific system dependencies

---

## Backend Deployment (Nixpacks)

### 1. Configuration File

The backend uses `backend/nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ['php82', 'php82Packages.composer']

[phases.install]
cmds = ['composer install --no-dev --optimize-autoloader --no-interaction']

[phases.build]
cmds = [
  'php artisan config:cache',
  'php artisan route:cache',
  'php artisan view:cache'
]

[start]
cmd = 'bash -c "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"'
```

### 2. Deploy in Coolify

1. **Create Application**
   - Name: `easy-healthcare-backend`
   - Repository: `amdevan/easy-healthcare-101`
   - Branch: `main`
   - **Build Pack**: **Nixpacks**
   - **Base Directory**: `backend`

2. **Environment Variables** (same as Docker deployment)
   ```env
   APP_KEY=base64:...
   DB_CONNECTION=pgsql
   DB_HOST=easy-healthcare-db
   DB_DATABASE=doctor
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Deploy**

---

## Frontend Deployment (Nixpacks)

### 1. Configuration File

The frontend uses root `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ['nodejs-20_x']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npx serve -s dist -l ${PORT:-3000}'
```

### 2. Deploy in Coolify

1. **Create Application**
   - Name: `easy-healthcare-frontend`
   - Repository: `amdevan/easy-healthcare-101`
   - Branch: `main`
   - **Build Pack**: **Nixpacks**

2. **Environment Variables**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

3. **Deploy**

---

## Comparison: Docker vs Nixpacks

| Feature | Docker | Nixpacks |
|---------|--------|----------|
| **Configuration** | Dockerfile (complex) | nixpacks.toml (simple) |
| **Build Time** | Slower (layers) | Faster |
| **Customization** | Full control | Limited |
| **Nginx** | Custom config | Auto-configured |
| **Learning Curve** | Steeper | Easier |
| **Production Ready** | ✅ Yes | ✅ Yes |

---

## Troubleshooting

### Build Fails

**Issue**: Nixpacks can't detect dependencies

**Solution**: 
- Ensure `package.json` or `composer.json` exists
- Check `nixpacks.toml` syntax
- View build logs in Coolify

### Port Issues

**Issue**: Application not accessible

**Solution**:
- Nixpacks uses `PORT` environment variable
- Ensure start command uses `${PORT}`
- Check Coolify port mapping

### Frontend Serving

**Issue**: Static files not served correctly

**Solution**:
- Ensure `dist/` directory is created during build
- Verify `npm run build` completes successfully
- Check `serve` package is available

---

## Migration from Docker

If you're currently using Docker and want to switch to Nixpacks:

1. **Backup current configuration**
2. **Change Build Pack** in Coolify to "Nixpacks"
3. **Remove Dockerfile reference** (Coolify will use nixpacks.toml)
4. **Deploy and test**

To switch back to Docker:
1. Change Build Pack to "Dockerfile"
2. Specify Dockerfile location
3. Deploy

---

## Best Practices

- ✅ Use `nixpacks.toml` for custom configuration
- ✅ Keep environment variables in Coolify (not in nixpacks.toml)
- ✅ Test builds locally with Nixpacks CLI if needed
- ✅ Monitor build logs for issues
- ✅ Use Docker for complex requirements

---

## Files

**Backend:**
- `backend/nixpacks.toml` - Backend Nixpacks config

**Frontend:**
- `nixpacks.toml` - Frontend Nixpacks config (root)

**Note**: You can have both Docker and Nixpacks configurations. Coolify will use whichever Build Pack you select.
