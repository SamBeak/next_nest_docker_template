# Next.js + NestJS + Docker Template

A full-stack TypeScript template with Next.js frontend, NestJS backend, PostgreSQL, Redis, and Nginx, all containerized with Docker.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd next_nest_docker_template

# Copy environment variables
cp .env.example .env

# Start development environment
docker compose up -d

# View logs
docker compose logs -f
```

Your application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Nginx Proxy**: http://localhost:80

## 📁 Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/                 # Source code
│   ├── Dockerfile           # Development Dockerfile
│   └── .env.local.example   # Frontend environment variables
├── backend/                 # NestJS application
│   ├── src/                 # Source code
│   ├── Dockerfile           # Development Dockerfile
│   └── .env.example         # Backend environment variables
├── nginx/                   # Nginx configuration
│   ├── nginx.conf          # Proxy configuration
│   └── ssl/                # SSL certificates directory
├── .env                    # Main environment variables
├── .env.example            # Environment template
├── .env.production         # Production environment template
├── docker-compose.yml      # Development containers
└── docker-compose.prod.yml # Production containers
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.5.3** - React framework with Turbopack
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **NestJS 11** - Node.js framework
- **TypeScript** - Type safety
- **Express** - HTTP server

### Database & Cache
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching and sessions

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and load balancer

## 🔧 Environment Configuration

### Development Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your variables in `.env`:
```env
# Database
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=mydb

# Security
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=4000
```

### Production Setup

1. Copy the production template:
```bash
cp .env.production .env
```

2. Update with your production values:
```env
# Use strong passwords in production
POSTGRES_PASSWORD=STRONG_PRODUCTION_PASSWORD
JWT_SECRET=SUPER_SECURE_JWT_SECRET_AT_LEAST_32_CHARACTERS_LONG

# Use your domain
NEXT_PUBLIC_API_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker compose up -d

# Rebuild and start
docker compose up -d --build

# View logs
docker compose logs -f [service-name]

# Stop services
docker compose down

# Remove volumes (⚠️ deletes data)
docker compose down -v
```

### Production
```bash
# Start production environment
docker compose -f docker-compose.prod.yml up -d

# Build and deploy
docker compose -f docker-compose.prod.yml up -d --build
```

## 🔍 Service Details

### Frontend (Next.js)
- **Port**: 3000 (configurable via `FRONTEND_PORT`)
- **Development**: Hot reload enabled
- **Build**: Optimized production build with Turbopack

### Backend (NestJS)
- **Port**: 4000 (configurable via `BACKEND_PORT`)
- **Development**: Watch mode enabled
- **Features**: JWT auth, CORS, rate limiting

### Database (PostgreSQL)
- **Port**: 5432 (configurable via `POSTGRES_PORT`)
- **Volume**: `postgres_data` for persistence
- **Health Check**: Built-in readiness check

### Cache (Redis)
- **Port**: 6379 (configurable via `REDIS_PORT`)
- **Volume**: `redis_data` for persistence
- **Health Check**: Ping command

### Proxy (Nginx)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Features**: Load balancing, SSL termination
- **Configuration**: `nginx/nginx.conf`

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **CORS Configuration** - Cross-origin request control
- **Rate Limiting** - API abuse prevention
- **Environment Variables** - Secure configuration management
- **SSL Support** - HTTPS encryption ready

## 🚦 Health Checks

All services include health checks:
- **Frontend**: HTTP GET to `/`
- **Backend**: HTTP GET to `/`
- **PostgreSQL**: `pg_isready` command
- **Redis**: `redis-cli ping` command

## 📝 Development Workflow

1. **Setup Environment**:
```bash
cp .env.example .env
# Edit .env with your settings
```

2. **Start Development**:
```bash
docker compose up -d
```

3. **Develop**:
   - Frontend: Edit files in `frontend/src/`
   - Backend: Edit files in `backend/src/`
   - Changes are automatically reflected due to volume mounts

4. **View Logs**:
```bash
docker compose logs -f frontend
docker compose logs -f backend
```

5. **Database Access**:
```bash
docker exec -it postgres-db psql -U user -d mydb
```

6. **Redis Access**:
```bash
docker exec -it redis-cache redis-cli
```

## 🔧 Customization

### Adding New Services
1. Add service to `docker-compose.yml`
2. Update environment variables
3. Configure networking and dependencies

### SSL Configuration
1. Place certificates in `nginx/ssl/`
2. Update `nginx.conf` for HTTPS
3. Update environment variables for HTTPS URLs

### Environment Variables
All configurable values use environment variables with sensible defaults:
- See `.env.example` for full list
- Override any value in your `.env` file
- Production values in `.env.production`

## 🐛 Troubleshooting

### Common Issues

**Port Conflicts**:
```bash
# Change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=4001
```

**Permission Issues**:
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Database Connection**:
```bash
# Check database logs
docker compose logs postgres
```

**Container Not Starting**:
```bash
# Check specific service logs
docker compose logs [service-name]
```

### Reset Everything
```bash
# Stop and remove everything
docker compose down -v
docker system prune -f

# Start fresh
docker compose up -d --build
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy coding!** 🎉