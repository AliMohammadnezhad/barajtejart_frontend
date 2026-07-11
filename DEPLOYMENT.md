# Deployment Guide — baraj-tejarat

Production target: Ubuntu server `5.102.37.36` · Nginx → PM2 → Next.js (port 3000)
Repo: `https://github.com/AliMohammadnezhad/barajtejart_frontend.git` (branch `master`)

## Architecture

```
push to master ─▶ GitHub Actions
                  ├─ job 1: npm ci + next build   (CI gate)
                  └─ job 2: SSH → server:
                       git reset --hard origin/master
                       npm ci → npm run build
                       pm2 startOrReload (cluster ⇒ zero-downtime)

Internet ─▶ Nginx :80 (gzip, cache headers, security headers)
              └─▶ 127.0.0.1:3000  Next.js under PM2 (user: deploy)
```

## GitHub secrets (Settings → Secrets and variables → Actions)

| Secret | Value |
| --- | --- |
| `SSH_HOST` | `5.102.37.36` |
| `SSH_USER` | `deploy` |
| `SSH_PORT` | `22` |
| `SSH_PRIVATE_KEY` | full contents of the deploy user's **private** key (PEM, incl. BEGIN/END lines) |

## One-time server provisioning

Copy `deploy/server-setup.sh` + `deploy/nginx-barajtejarat.conf` to the server, then:

```bash
sudo DEPLOY_PUBKEY="ssh-ed25519 AAAA... deploy@ci" bash server-setup.sh
```

The script is numbered [1/7]–[7/7]: update, deploy user, UFW, Nginx, Node 20, PM2 (+ systemd boot persistence), clone/build/start. Step [8] (disable SSH password login) is deliberately manual — run it **only after** confirming `ssh deploy@5.102.37.36` works with your key.

## Key files

- `.github/workflows/deploy.yml` — CI/CD pipeline
- `ecosystem.config.js` — PM2 app definition (cluster mode, logs in `logs/`)
- `deploy/nginx-barajtejarat.conf` — Nginx site (SSL placeholder for certbot)
- `deploy/server-setup.sh` — one-time provisioning script

## SSL (when you have a domain)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Then set `server_name yourdomain.com www.yourdomain.com;` if certbot didn't.

## Troubleshooting checklist

1. **Site unreachable** — `sudo systemctl status nginx`, `sudo nginx -t`, `sudo ufw status` (80/443 open?).
2. **502 Bad Gateway** — app is down: `pm2 status`, `pm2 logs baraj-tejarat --lines 50`, `curl -I http://127.0.0.1:3000`.
3. **Action fails at SSH step** — check the 4 secrets; key must be the *private* key matching `~deploy/.ssh/authorized_keys`; try `ssh -i key deploy@5.102.37.36` locally.
4. **`git reset` fails on server** — repo perms: `ls -ld /var/www/barajtejarat` must be owned by `deploy`.
5. **Build fails on server, works locally** — Node version (`node -v` must be 20.x), disk space (`df -h`), memory (`free -m`; add swap if build OOMs: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`).
6. **App doesn't survive reboot** — `pm2 save` after any change; verify `systemctl status pm2-deploy`.
7. **Stale page after deploy** — hard refresh (Ctrl+F5); `/_next/static` is immutable-cached, HTML is not.
8. **Images 404 in production** — files in `public/images/` are case-sensitive on Linux; match paths in `data/site.js` exactly.
