# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source
COPY src ./src
COPY public ./public

# Build frontend
RUN npm run build

# Stage 2: Backend Dependencies
FROM composer:2 AS backend-builder

WORKDIR /app

# Copy backend composer files
COPY backend/composer.json backend/composer.lock ./

# Install backend dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-progress

# Stage 3: Production Image
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    zip \
    && a2enmod rewrite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Apache document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/backend/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Copy backend application
COPY backend ./backend

# Copy vendor from builder
COPY --from=backend-builder /app/vendor ./backend/vendor

# Copy frontend build to Laravel public directory
COPY --from=frontend-builder /app/dist ./backend/public/dist
COPY --from=frontend-builder /app/dist/index.html ./backend/public/index.html

# Set permissions
RUN chown -R www-data:www-data \
    ./backend/storage \
    ./backend/bootstrap/cache \
    ./backend/public \
    && chmod -R 775 \
    ./backend/storage \
    ./backend/bootstrap/cache

# Copy entrypoint script
COPY .coolify/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
