#!/bin/bash
# Deploy Frontend to Production Server
# This script copies the built frontend files to the production server

set -e  # Exit on error

echo "=== DEPLOYING FRONTEND TO PRODUCTION ==="
echo ""

# Configuration
PROD_SERVER="root@profitablesource.com"
PROD_PATH="/var/www/ProfitableSource/frontend/dist"
LOCAL_DIST="./dist"

# Check if dist folder exists
if [ ! -d "$LOCAL_DIST" ]; then
    echo "❌ Error: dist folder not found!"
    echo "Run 'npm run build' first"
    exit 1
fi

echo "✅ Found dist folder"
echo ""

# Backup current production files
echo "📦 Creating backup on production server..."
ssh $PROD_SERVER "cd /var/www/ProfitableSource/frontend && tar -czf dist-backup-\$(date +%Y%m%d-%H%M%S).tar.gz dist/ 2>/dev/null || true"
echo "✅ Backup created"
echo ""

# Deploy new files
echo "🚀 Deploying new files..."
rsync -avz --delete $LOCAL_DIST/ $PROD_SERVER:$PROD_PATH/
echo "✅ Files deployed"
echo ""

# Reload nginx
echo "🔄 Reloading nginx..."
ssh $PROD_SERVER "sudo nginx -t && sudo systemctl reload nginx"
echo "✅ Nginx reloaded"
echo ""

echo "=== DEPLOYMENT COMPLETE ==="
echo ""
echo "🎉 Frontend deployed successfully!"
echo "🌐 Visit: https://profitablesource.com/admin"
echo "📸 Screenshots should now work!"
echo ""
echo "To verify:"
echo "1. Go to admin panel"
echo "2. Check Deposits tab"
echo "3. Verify screenshots display correctly"
