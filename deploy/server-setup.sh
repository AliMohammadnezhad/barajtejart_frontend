#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# One-time provisioning for a fresh Ubuntu server (run as root).
#
#   Usage:  sudo bash server-setup.sh
#
# Reads one env var (optional):
#   DEPLOY_PUBKEY  — SSH public key to authorize for the deploy user
#
# What it does (numbered to match the deployment plan):
#   1. system update            5. node.js 20 LTS
#   2. deploy user + SSH key    6. pm2 (+ boot persistence)
#   3. UFW firewall 22/80/443   7. clone + build + start app
#   4. nginx + site config     (8. SSH password-login hardening — MANUAL, see end)
# ════════════════════════════════════════════════════════════════
set -euo pipefail

REPO_URL="https://github.com/AliMohammadnezhad/barajtejart_frontend.git"
APP_DIR="/var/www/barajtejarat"
DEPLOY_USER="deploy"

echo "══ [1/7] System update ══"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git ufw nginx

echo "══ [2/7] Create '${DEPLOY_USER}' user ══"
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
if [ -n "${DEPLOY_PUBKEY:-}" ]; then
  grep -qF "$DEPLOY_PUBKEY" /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null \
    || echo "$DEPLOY_PUBKEY" >> /home/$DEPLOY_USER/.ssh/authorized_keys
  chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
fi
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

echo "══ [3/7] UFW firewall (22, 80, 443 only) ══"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose

echo "══ [4/7] Nginx site ══"
# expects nginx-barajtejarat.conf to sit next to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/nginx-barajtejarat.conf" /etc/nginx/sites-available/barajtejarat
ln -sf /etc/nginx/sites-available/barajtejarat /etc/nginx/sites-enabled/barajtejarat
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "══ [5/7] Node.js 20 LTS ══"
if ! command -v node >/dev/null || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v && npm -v

echo "══ [6/7] PM2 ══"
npm install -g pm2
# boot persistence for the deploy user
env PATH=$PATH:/usr/bin pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER

echo "══ [7/7] Clone, build, start ══"
mkdir -p "$APP_DIR"
chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"
sudo -u $DEPLOY_USER bash -c "
  set -e
  if [ ! -d '$APP_DIR/.git' ]; then
    git clone '$REPO_URL' '$APP_DIR'
  fi
  cd '$APP_DIR'
  mkdir -p logs
  npm ci
  npm run build
  pm2 startOrReload ecosystem.config.js
  pm2 save
"

echo
echo "════════════════════════════════════════════════════════════"
echo " DONE. App:  curl -I http://127.0.0.1:3000"
echo " Site:      http://\$(hostname -I | awk '{print \$1}')"
echo
echo " [8] MANUAL — only after you confirm key login works"
echo "     (ssh ${DEPLOY_USER}@<ip> from your machine), disable"
echo "     password login:"
echo "       sed -i 's/^#\\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config"
echo "       systemctl restart ssh"
echo "════════════════════════════════════════════════════════════"
