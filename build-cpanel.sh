#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting cPanel Deployment Build..."

# 1. Frontend Build
echo "📦 Building Frontend (Single Domain Mode)..."
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm ci
fi
# Ensure build goes to backend/public
npm run build

# 2. Prepare Directory Structure
echo "📂 Preparing Deployment Directory..."
rm -rf cpanel_file
mkdir -p cpanel_file/backend_app

# 3. Copy Backend (which now contains frontend in public/)
echo "📦 Preparing Backend & Frontend Bundle..."
# Check if composer is available
if command -v composer &> /dev/null; then
    echo "   Running composer install (no-dev)..."
    cd backend
    composer install --no-dev --optimize-autoloader --ignore-platform-reqs
    cd ..
else
    echo "⚠️  Composer not found. Skipping composer install. You must run 'composer install' on the server or use a machine with Composer."
fi

# Copy everything from backend/
echo "   Copying application files..."
if command -v rsync &> /dev/null; then
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='.env' --exclude='storage/logs/*.log' backend/ cpanel_file/backend_app/
else
    # Improved copy to include hidden files
    cp -r backend/. cpanel_file/backend_app/
fi

# 4. Copy .env.cpanel as .env.example for the installer to use
if [ -f "backend/.env.cpanel" ]; then
    echo "   Copying .env.cpanel to .env.example..."
    cp backend/.env.cpanel cpanel_file/backend_app/.env.example
fi

# Create manual_backups directory
mkdir -p cpanel_file/backend_app/storage/app/manual_backups

# 5. Add Installer
echo "   Adding install.php..."
if [ -f "install.php" ]; then
    cp install.php cpanel_file/backend_app/public/
else
    echo "⚠️  install.php not found in root. Skipping."
fi

# 6. Create Zip
echo "🤐 Zipping cpanel_file.zip..."
cd cpanel_file/backend_app
zip -r ../../cpanel_file.zip .
cd ../..

echo "✅ Build Complete!"
echo "   File created: cpanel_file.zip"
echo "   1. Upload to cPanel."
echo "   2. Extract content."
echo "   3. Follow CPANEL_DEPLOY.md instructions."
