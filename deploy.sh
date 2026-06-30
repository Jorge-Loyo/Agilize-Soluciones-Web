#!/bin/bash
# deploy.sh - Script de re-deploy para la VM
# Uso: ./deploy.sh

set -e

echo "🔄 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm ci

echo "🏗️  Building production..."
npm run build

echo "📁 Copying static files to standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "🔄 Restarting PM2..."
pm2 restart agilize-web

echo "✅ Deploy complete!"
pm2 status
