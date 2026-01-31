#!/bin/bash
cd /var/www/ProfitableSource
git stash
git pull origin main

# Frontend Build
cd /var/www/ProfitableSource/frontend
npm install
npm run build

# Backend Setup
cd /var/www/ProfitableSource/backend
npm install
# Prevent production DB alterations here too if manually running
export NODE_ENV=production 

# Restart Backend
pm2 restart profitable-backend
