#!/bin/sh
set -e

echo "🚀 Starting Easy Healthcare Frontend..."

# Inject runtime environment variables into the built JavaScript
# This allows changing API URL without rebuilding the image
if [ -n "$VITE_API_URL" ]; then
    echo "⚙️  Configuring API URL: $VITE_API_URL"
    
    # Find all JS files in the build and replace the placeholder
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
        "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} \;
fi

echo "✨ Frontend ready!"

# Execute the CMD
exec "$@"
