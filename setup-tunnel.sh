#!/bin/bash
# setup-tunnel.sh - Configurar Cloudflare Tunnel
# Ejecutar DESPUÉS de setup-vm.sh y el primer deploy exitoso
# 
# Prerequisitos:
# - cloudflared instalado
# - Dominio agilizesoluciones.uk en Cloudflare
# - El sitio corriendo en localhost:3000

set -e

TUNNEL_NAME="agilize-web"
DOMAIN="agilizesoluciones.uk"
CONFIG_DIR="$HOME/.cloudflared"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Setup: Cloudflare Tunnel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Login a Cloudflare ───────────────────────
echo ""
echo "🔑 Step 1: Login to Cloudflare"
echo "   Se abrirá un enlace — autorizá desde el navegador."
cloudflared tunnel login

# ── 2. Crear túnel ──────────────────────────────
echo ""
echo "🚇 Step 2: Creating tunnel '$TUNNEL_NAME'..."
TUNNEL_ID=$(cloudflared tunnel create "$TUNNEL_NAME" 2>&1 | grep -oP '[a-f0-9-]{36}')
echo "   Tunnel ID: $TUNNEL_ID"

# ── 3. Crear config.yml ────────────────────────
echo ""
echo "📝 Step 3: Creating config.yml..."
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_DIR/config.yml" << EOF
tunnel: $TUNNEL_ID
credentials-file: $CONFIG_DIR/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN
    service: http://127.0.0.1:3000
    originRequest:
      noTLSVerify: true
  - hostname: www.$DOMAIN
    service: http://127.0.0.1:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF

echo "   Config saved to $CONFIG_DIR/config.yml"

# ── 4. Configurar DNS ──────────────────────────
echo ""
echo "🌍 Step 4: Configuring DNS routes..."
cloudflared tunnel route dns "$TUNNEL_NAME" "$DOMAIN"
cloudflared tunnel route dns "$TUNNEL_NAME" "www.$DOMAIN"
echo "   DNS configured for $DOMAIN and www.$DOMAIN"

# ── 5. Instalar como servicio systemd ──────────
echo ""
echo "⚙️  Step 5: Installing as system service..."
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

# ── 6. Verificar ───────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tunnel configured!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Tu sitio estará disponible en:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📋 Comandos útiles:"
echo "   cloudflared tunnel info $TUNNEL_NAME"
echo "   sudo systemctl status cloudflared"
echo "   sudo systemctl restart cloudflared"
echo "   cloudflared tunnel list"
echo ""
echo "⚠️  Configurar en Cloudflare Dashboard:"
echo "   1. SSL/TLS → Full (strict)"
echo "   2. Speed → Brotli: ON"
echo "   3. Caching → Browser Cache TTL: 4 hours"
echo "   4. Security → Bot Fight Mode: ON"
