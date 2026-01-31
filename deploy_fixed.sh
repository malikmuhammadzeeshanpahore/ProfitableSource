#!/bin/bash
set -e

# -------------------------------
# CONFIGURATION (Change these)
# -------------------------------
REPO_URL="https://github.com/malikmuhammadzeeshanpahore/ProfitableSource.git"
APP_DIR="/var/www/ProfitableSource"
DOMAIN="profitablesource.com"

BACKEND_ENTRY="backend/index.js"
BACKEND_NAME="profitable-backend"
FRONTEND_DIR="frontend"
NODE_VERSION="20"

# -------------------------------
# INSTALL ESSENTIALS (once)
# -------------------------------
sudo apt update
sudo apt install -y git nginx curl ufw certbot python3-certbot-nginx build-essential

# Node.js setup (if not installed)
if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# PM2 install (global)
if ! command -v pm2 >/dev/null 2>&1; then
    sudo npm install -g pm2
fi

# -------------------------------
# STOP CURRENT APPS
# -------------------------------
pm2 stop $BACKEND_NAME || true
pm2 delete $BACKEND_NAME || true

# -------------------------------
# FETCH LATEST CODE
# -------------------------------
if [ ! -d "$APP_DIR" ]; then
    sudo git clone $REPO_URL $APP_DIR
else
    cd $APP_DIR
    git reset --hard
    git clean -fd
    git pull origin main
fi

cd $APP_DIR

# -------------------------------
# FRONTEND BUILD
# -------------------------------
cd $FRONTEND_DIR
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..

# -------------------------------
# BACKEND SETUP
# -------------------------------
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# -------------------------------
# START BACKEND
# -------------------------------
# Use NODE_ENV=production to avoid risky DB alterations
NODE_ENV=production pm2 start $BACKEND_ENTRY --name $BACKEND_NAME --update-env || pm2 restart $BACKEND_NAME --update-env
pm2 save
pm2 startup | tail -n 1 | bash

# -------------------------------
# NGINX CONFIG
# -------------------------------
sudo tee /etc/nginx/sites-available/profitablesource > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root $APP_DIR/frontend/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        # FIXED: Removed trailing slash to prevent path stripping
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

sudo ln -sf /etc/nginx/sites-available/profitablesource /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# -------------------------------
# FIREWALL (once)
# -------------------------------
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable || true

# -------------------------------
# SSL SETUP
# -------------------------------
if ! [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m your-email@example.com
else
    echo "SSL certificate already exists for $DOMAIN"
fi

echo "-------------------------------"
echo "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Frontend: http://$DOMAIN"
echo "Backend: http://$DOMAIN/api"
echo "-------------------------------"
