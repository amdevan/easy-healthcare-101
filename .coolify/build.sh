#!/bin/bash
set -e

echo "🏗️  Building Easy Healthcare 101..."

# Build frontend
echo "📦 Installing frontend dependencies..."
npm ci

echo "🎨 Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader --no-interaction

echo "✅ Build complete!"
