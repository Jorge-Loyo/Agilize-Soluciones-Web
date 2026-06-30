#!/bin/bash
# deploy.sh - Script de re-deploy para la VM
# Uso: ./deploy.sh
# Requiere: Node.js 20+, PM2, git

set -e

APP_NAME="agilize-web"
APP_DIR="$HOME/Agilize-Soluciones-Web"

cd "$APP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Deploy: Agilize Soluciones Web"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Pull latest
echo ""
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Install deps
echo ""
echo "📦 Installing dependencies..."
npm ci --omit=dev

# 3. Build
echo ""
echo "🏗️  Building production..."
npm run build

# 4. Copy static assets to standalone
echo ""
echo "📁 Copying static files to standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 5. Create logs dir if not exists
mkdir -p logs

# 6. Restart or start PM2 process
echo ""
echo "🔄 Restarting PM2 process..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start ecosystem.config.js --env production
  pm2 save
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deploy complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
pm2 status
echo ""
echo "🌐 Site: https://agilizesoluciones.uk"
echo "📋 Logs: pm2 logs $APP_NAME"
