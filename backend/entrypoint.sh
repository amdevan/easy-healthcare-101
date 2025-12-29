#!/bin/bash
set -e

echo "🚀 Starting Easy Healthcare Backend API..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
max_attempts=30
attempt=0

until php artisan db:show 2>/dev/null || [ $attempt -eq $max_attempts ]; do
    echo "Database is unavailable - attempt $((attempt+1))/$max_attempts"
    attempt=$((attempt+1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Failed to connect to database after $max_attempts attempts"
    exit 1
fi

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
php artisan migrate --force

# Seed database if needed (only on first deployment)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force
fi

# Create storage link
echo "🔗 Creating storage symlink..."
php artisan storage:link || true

# Clear and cache config
echo "⚙️  Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "✨ Backend API ready! Starting Apache..."

# Start Apache in foreground
apache2-foreground
