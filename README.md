# Easy Healthcare 101

A comprehensive healthcare management system with Laravel backend API and React frontend.

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/amdevan/easy-healthcare-101.git
cd easy-healthcare-101

# 2. Install dependencies
npm install
cd backend && composer install && cd ..

# 3. Configure environment
cp .env.example .env
cd backend && cp .env.example .env && cd ..

# 4. Start development servers
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && php artisan serve
```

Frontend: http://localhost:3000  
Backend API: http://localhost:8000/api

---

## 🌐 Coolify Deployment

Deploy as **two separate services** for better scalability and performance.

### Quick Deploy

1. **Backend**: Deploy `backend/` directory with `backend/Dockerfile`
2. **Frontend**: Deploy root directory with `Dockerfile.frontend`
3. Configure environment variables for both
4. Connect to PostgreSQL database

**📖 Full Guide**: [COOLIFY_DEPLOYMENT.md](./COOLIFY_DEPLOYMENT.md)

---

## 📁 Project Structure

```
.
├── src/                      # React frontend source
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   └── config/             # Configuration (API, etc.)
├── backend/                 # Laravel backend API
│   ├── app/                # Application code
│   ├── routes/             # API routes
│   ├── database/           # Migrations & seeders
│   ├── Dockerfile          # Backend Docker config
│   └── entrypoint.sh       # Backend startup script
├── Dockerfile.frontend      # Frontend Docker config
├── nginx.conf              # Nginx configuration
└── docker-entrypoint.sh    # Frontend startup script
```

---

## 🛠️ Technology Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router
- Nginx (production)

**Backend:**
- Laravel 11
- PHP 8.2
- PostgreSQL 15

**Deployment:**
- Coolify
- Docker
- Nginx

---

## 📚 Documentation

- **[Coolify Deployment](./COOLIFY_DEPLOYMENT.md)** - Deploy to Coolify (separate services)
- **[API Documentation](./API_DOCUMENTATION.md)** - Backend API reference
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - General deployment info

---

## 🔧 Configuration Files

### Backend
- `backend/Dockerfile` - Backend production build
- `backend/entrypoint.sh` - Backend startup script
- `backend/.dockerignore` - Backend build optimization

### Frontend
- `Dockerfile.frontend` - Frontend production build
- `nginx.conf` - Nginx web server config
- `docker-entrypoint.sh` - Frontend startup script
- `.dockerignore.frontend` - Frontend build optimization

### Shared
- `docker-compose.yml` - Local development orchestration
- `.env.example` - Environment variable template

---

## 🌟 Features

- **Patient Management** - Appointments, profiles, medical records
- **Doctor Profiles** - Specialties, availability, booking
- **Telemedicine** - Virtual consultations
- **Lab Tests** - Test booking and results
- **Community Health** - Health programs and resources
- **NEMT Services** - Non-emergency medical transportation
- **Membership** - Healthcare membership plans

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (backend/.env)
```env
APP_KEY=base64:...
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_DATABASE=doctor
DB_USERNAME=postgres
DB_PASSWORD=
FRONTEND_URL=http://localhost:3000
```

---

## 📝 License

All rights reserved.