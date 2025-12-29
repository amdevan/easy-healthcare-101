#!/bin/bash
set -e

echo "🚀 Starting Easy Healthcare 101 application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php backend/artisan db:show 2>/dev/null; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "✅ Database is ready!"

# Navigate to backend directory
cd backend

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

# Navigate back to root
cd ..

echo "✨ Application ready! Starting Apache..."

# Start Apache in foreground
apache2-foreground
