#!/bin/bash
# setup-vm.sh - Setup inicial de la VM (ejecutar UNA sola vez)
# Uso: chmod +x setup-vm.sh && ./setup-vm.sh
# Prerequisitos: Ubuntu/Debian con acceso root/sudo

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Setup: Agilize Soluciones VM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Node.js 20 LTS ──────────────────────────
echo ""
echo "📦 Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "   Node.js already installed: $(node -v)"
fi

# ── 2. PM2 ──────────────────────────────────────
echo ""
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
  pm2 startup systemd -u $USER --hp $HOME
else
  echo "   PM2 already installed: $(pm2 -v)"
fi

# ── 3. Cloudflare Tunnel (cloudflared) ──────────
echo ""
echo "📦 Installing cloudflared..."
if ! command -v cloudflared &> /dev/null; then
  curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
  sudo dpkg -i /tmp/cloudflared.deb
  rm /tmp/cloudflared.deb
else
  echo "   cloudflared already installed: $(cloudflared --version)"
fi

# ── 4. Clonar repo ─────────────────────────────
echo ""
APP_DIR="/home/$USER/agilize-soluciones-web"
if [ ! -d "$APP_DIR" ]; then
  echo "📂 Cloning repository..."
  echo "   ⚠️  Configura tu repo primero:"
  echo "   git clone git@github.com:TU_USUARIO/agilize-soluciones-web.git $APP_DIR"
else
  echo "   Repo already exists at $APP_DIR"
fi

# ── 5. Firewall ─────────────────────────────────
echo ""
echo "🔒 Configuring firewall..."
if command -v ufw &> /dev/null; then
  sudo ufw allow ssh
  sudo ufw --force enable
  # NO abrimos puerto 3000 — solo el túnel accede
  echo "   UFW enabled. Port 3000 NOT exposed (tunnel only)."
fi

# ── 6. Info ─────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Crear repo en GitHub y push:"
echo "   git remote add origin git@github.com:TU_USUARIO/agilize-soluciones-web.git"
echo "   git push -u origin main"
echo ""
echo "2. Clonar en la VM:"
echo "   git clone git@github.com:TU_USUARIO/agilize-soluciones-web.git $APP_DIR"
echo ""
echo "3. Configurar .env.production:"
echo "   cp $APP_DIR/frontend/.env.example $APP_DIR/frontend/.env.local"
echo "   nano $APP_DIR/frontend/.env.local"
echo ""
echo "4. Primer deploy:"
echo "   cd $APP_DIR/frontend && chmod +x deploy.sh && ./deploy.sh"
echo ""
echo "5. Configurar Cloudflare Tunnel:"
echo "   cloudflared tunnel login"
echo "   cloudflared tunnel create agilize-web"
echo "   # Luego configurar config.yml (ver setup-tunnel.sh)"
echo ""
echo "6. Verificar:"
echo "   curl http://127.0.0.1:3000"
echo "   pm2 logs agilize-web"
