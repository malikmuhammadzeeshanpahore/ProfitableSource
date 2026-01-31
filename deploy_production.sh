#!/bin/bash
set -e

# Configuration
APP_DIR="/var/www/ProfitableSource"
BACKEND_NAME="profitable-backend"

# Deployment
cd $APP_DIR
git stash
git pull origin main

# Frontend Build
echo "Building Frontend..."
cd $APP_DIR/frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build

# Backend Setup
echo "Updating Backend..."
cd $APP_DIR/backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Ensure Env is Production (Prevents DB Alterations that crash SQLite)
export NODE_ENV=production

# Restart
echo "Restarting Service..."
pm2 restart $BACKEND_NAME --update-env || pm2 start index.js --name $BACKEND_NAME

echo "Deployment Done!"
