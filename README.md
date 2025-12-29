# Easy Healthcare 101

A comprehensive healthcare management system with Laravel backend and React frontend.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   cd backend && composer install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   cd backend && cp .env.example .env
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && php artisan serve
   ```

### Coolify Deployment

For production deployment on Coolify, see **[COOLIFY_DEPLOYMENT.md](./COOLIFY_DEPLOYMENT.md)** for complete instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Create new application in Coolify
3. Connect to repository
4. Configure environment variables
5. Deploy!

## 📁 Project Structure

```
.
├── src/                    # React frontend source
├── backend/                # Laravel backend
├── .coolify/              # Coolify deployment scripts
├── Dockerfile             # Production Docker configuration
├── docker-compose.yml     # Docker Compose for local/production
├── nixpacks.toml         # Alternative Nixpacks configuration
└── COOLIFY_DEPLOYMENT.md # Deployment guide
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, React Router
- **Backend**: Laravel 11, PHP 8.2
- **Database**: PostgreSQL 15
- **Deployment**: Coolify, Docker

## 📚 Documentation

- [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🔧 Configuration Files

- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Service orchestration
- `nixpacks.toml` - Alternative build configuration
- `.coolify/entrypoint.sh` - Container startup script
- `.coolify/build.sh` - Build script

## 📝 License

All rights reserved.