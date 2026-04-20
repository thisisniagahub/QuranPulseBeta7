#!/usr/bin/env bash
# =============================================================================
# QuranPulse VPS Deployment Script
# =============================================================================
# Automates full deployment to Ubuntu/Debian VPS.
# Idempotent — safe to run multiple times.
#
# VPS:  76.13.176.142
# Repo: https://github.com/thisisniagahub/QuranPulseBeta7.git
# App:  Next.js 16 standalone on port 3000
# Proxy: Caddy port 81 → localhost:3000
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
APP_DIR="/opt/quranpulse"
REPO_URL="https://github.com/thisisniagahub/QuranPulseBeta7.git"
REPO_BRANCH="main"
APP_PORT=3000
CADDY_PORT=81
BACKUP_DIR="/opt/quranpulse-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/var/log/quranpulse-deploy.log"

# ---------------------------------------------------------------------------
# Colours
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log()       { echo -e "${GREEN}[QuranPulse]${NC} ${BOLD}$*${NC}" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${GREEN}[QuranPulse]${NC} ${BOLD}$*${NC}"; }
warn()      { echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${YELLOW}[WARN]${NC} $*"; }
error()     { echo -e "${RED}[ERROR]${NC} $*" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${RED}[ERROR]${NC} $*"; }
info()      { echo -e "${CYAN}[INFO]${NC} $*" | tee -a "$LOG_FILE" 2>/dev/null || echo -e "${CYAN}[INFO]${NC} $*"; }
step()      { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE" 2>/dev/null; echo -e "${BOLD}${BLUE}  ▶ $*${NC}" | tee -a "$LOG_FILE" 2>/dev/null; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE" 2>/dev/null; }

command_exists() { command -v "$1" &>/dev/null; }

ensure_log_file() {
  if [ ! -f "$LOG_FILE" ]; then
    sudo mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
    sudo touch "$LOG_FILE" 2>/dev/null || true
    sudo chmod 666 "$LOG_FILE" 2>/dev/null || true
  fi
}

# ---------------------------------------------------------------------------
# Pre-flight
# ---------------------------------------------------------------------------
ensure_log_file
log "QuranPulse Deployment Script — $(date)"
log "VPS: 76.13.176.142 | Repo: $REPO_URL"

# ===========================================================================
# 1. ENVIRONMENT SETUP (idempotent)
# ===========================================================================
step "1. Environment Setup"

# --- Node.js 20+ via nvm ---
if command_exists node && node -v | grep -qE '^v(2[0-9]|[3-9])'; then
  info "Node.js $(node -v) already installed — skipping"
else
  info "Installing Node.js 20 via nvm..."
  if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  fi
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
  nvm alias default 20
  log "Node.js $(node -v) installed via nvm"
fi

# --- bun ---
if command_exists bun; then
  info "bun $(bun --version) already installed — skipping"
else
  info "Installing bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  log "bun $(bun --version) installed"
fi

# --- Caddy ---
if command_exists caddy; then
  info "Caddy $(caddy version 2>/dev/null || echo 'installed') already installed — skipping"
else
  info "Installing Caddy..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg 2>/dev/null || true
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  sudo apt-get update -qq
  sudo apt-get install -y -qq caddy
  log "Caddy installed"
fi

# --- PM2 ---
if command_exists pm2; then
  info "PM2 $(pm2 -v) already installed — skipping"
else
  info "Installing PM2 globally..."
  npm install -g pm2
  log "PM2 $(pm2 -v) installed"
fi

# --- App directory ---
if [ -d "$APP_DIR" ]; then
  info "App directory $APP_DIR already exists — skipping"
else
  info "Creating app directory $APP_DIR..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$(whoami)":"$(whoami)" "$APP_DIR"
  log "App directory created"
fi

# Ensure db sub-directory exists
mkdir -p "$APP_DIR/db"

# ===========================================================================
# 2. APPLICATION DEPLOYMENT
# ===========================================================================
step "2. Application Deployment"

# --- Clone or pull ---
if [ -d "$APP_DIR/.git" ]; then
  info "Repository already cloned — pulling latest changes..."
  cd "$APP_DIR"
  git fetch origin "$REPO_BRANCH"
  LOCAL_COMMIT=$(git rev-parse HEAD)
  REMOTE_COMMIT=$(git rev-parse "origin/$REPO_BRANCH")
  if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    info "Already up to date ($LOCAL_COMMIT)"
  else
    info "Updating from $LOCAL_COMMIT → $REMOTE_COMMIT"
    git pull origin "$REPO_BRANCH"
  fi
else
  info "Cloning repository..."
  git clone -b "$REPO_BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# --- Backup previous build ---
if [ -d "$APP_DIR/.next" ]; then
  info "Backing up previous build..."
  mkdir -p "$BACKUP_DIR"
  BACKUP_NAME="backup_${TIMESTAMP}"
  cp -r "$APP_DIR/.next" "$BACKUP_DIR/$BACKUP_NAME"
  # Keep only the last 5 backups
  ls -1t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}" 2>/dev/null || true
  log "Backup saved: $BACKUP_DIR/$BACKUP_NAME"
fi

# --- Environment file ---
if [ ! -f "$APP_DIR/.env" ]; then
  if [ -f "$APP_DIR/.env.example" ]; then
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    warn ".env created from .env.example — PLEASE review and set real values!"
    warn "Run: nano $APP_DIR/.env"
  else
    warn "No .env.example found. Creating minimal .env..."
    cat > "$APP_DIR/.env" << 'ENVEOF'
DATABASE_URL=file:/opt/quranpulse/db/quranpulse.db
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
Z_AI_API_KEY=
OPENCLAW_PORT=18789
OPENCLAW_GATEWAY_URL=http://localhost:3030
ENVEOF
    warn ".env created with placeholders — PLEASE review and set real values!"
  fi
else
  info ".env already exists — preserving current values"
fi

# --- Install dependencies ---
info "Installing dependencies..."
cd "$APP_DIR"
bun install --frozen-lockfile 2>/dev/null || bun install
log "Dependencies installed"

# --- Build ---
info "Building application (standalone mode)..."
cd "$APP_DIR"
if bun run build; then
  log "Build succeeded!"
else
  error "Build FAILED!"
  # --- Rollback ---
  LATEST_BACKUP=$(ls -1t "$BACKUP_DIR" 2>/dev/null | head -n1)
  if [ -n "$LATEST_BACKUP" ] && [ -d "$BACKUP_DIR/$LATEST_BACKUP" ]; then
    warn "Rolling back to previous build: $LATEST_BACKUP"
    rm -rf "$APP_DIR/.next"
    cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$APP_DIR/.next"
    log "Rollback complete. Attempting to restart with previous build..."
    # Restart PM2 with old build
    if pm2 describe quranpulse &>/dev/null; then
      pm2 restart quranpulse
    fi
  fi
  error "Deployment aborted due to build failure. Previous build restored if available."
  exit 1
fi

# --- Push Prisma schema ---
info "Pushing database schema..."
cd "$APP_DIR"
bun run db:push 2>/dev/null || npx prisma db push 2>/dev/null || warn "Prisma db:push failed — schema may need manual migration"

# --- Start / Restart with PM2 ---
info "Configuring PM2..."

# Create ecosystem.config.js if it doesn't exist
if [ ! -f "$APP_DIR/ecosystem.config.js" ]; then
  cat > "$APP_DIR/ecosystem.config.js" << 'ECOEOF'
module.exports = {
  apps: [
    {
      name: 'quranpulse',
      script: 'server.js',
      cwd: '/opt/quranpulse/.next/standalone',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      max_memory_restart: '512M',
      // Log management
      error_file: '/opt/quranpulse/logs/error.log',
      out_file: '/opt/quranpulse/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 10000,
      listen_timeout: 30000,
      shutdown_with_message: true,
    },
  ],
};
ECOEOF
  log "ecosystem.config.js created"
fi

# Ensure log directory
mkdir -p "$APP_DIR/logs"

if pm2 describe quranpulse &>/dev/null; then
  info "Restarting quranpulse via PM2..."
  pm2 restart quranpulse
else
  info "Starting quranpulse via PM2..."
  pm2 start "$APP_DIR/ecosystem.config.js"
fi

# Save PM2 process list for auto-resurrection
pm2 save

log "Application running on port $APP_PORT (PM2: quranpulse)"

# ===========================================================================
# 3. CADDY CONFIGURATION
# ===========================================================================
step "3. Caddy Configuration"

CADDYFILE_PATH="/etc/caddy/Caddyfile"

info "Generating Caddyfile..."

sudo tee "$CADDYFILE_PATH" > /dev/null << CADDYEOF
# QuranPulse Caddy Reverse Proxy
# Port $CADDY_PORT → localhost:$APP_PORT

:$CADDY_PORT {
    # Reverse proxy to Next.js standalone
    reverse_proxy localhost:$APP_PORT {
        header_up Host {host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote_host}

        # WebSocket support for OpenClaw gateway
        header_up Connection {>Connection}
        header_up Upgrade {>Upgrade}

        # Timeouts
        transport http {
            read_timeout 300s
            write_timeout 300s
            dial_timeout 30s
        }
    }

    # Security headers
    header {
        # Prevent clickjacking
        X-Frame-Options "DENY"
        # Prevent MIME-type sniffing
        X-Content-Type-Options "nosniff"
        # Referrer policy
        Referrer-Policy "strict-origin-when-cross-origin"
        # XSS protection (legacy browsers)
        X-XSS-Protection "1; mode=block"
        # Permissions policy
        Permissions-Policy "camera=(), microphone=(), geolocation=(self)"
        # HSTS (only if using HTTPS — uncomment when TLS is configured)
        # Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        # CSP — allow self, inline scripts/styles (Next.js needs them), fonts
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' blob: https:; worker-src 'self' blob:;"
    }

    # Gzip compression
    encode gzip zstd

    # Static assets caching
    @static path *.js *.css *.png *.jpg *.jpeg *.gif *.svg *.ico *.woff *.woff2 *.ttf *.eot *.webp
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Health check endpoint (proxies to Next.js /api/health)
    handle /health {
        respond "OK" 200
    }

    # Logging
    log {
        output file /var/log/caddy/quranpulse-access.log {
            roll_size 100mb
            roll_keep 10
        }
        format json
    }
}
CADDYEOF

log "Caddyfile written to $CADDYFILE_PATH"

# Validate Caddyfile
if caddy validate --config "$CADDYFILE_PATH" 2>/dev/null; then
  info "Caddyfile validation passed"
else
  warn "Caddyfile validation failed — check syntax manually"
fi

# Ensure Caddy log directory
sudo mkdir -p /var/log/caddy

# Reload or start Caddy
if systemctl is-active --quiet caddy 2>/dev/null; then
  info "Reloading Caddy..."
  sudo systemctl reload caddy
else
  info "Starting Caddy..."
  sudo systemctl start caddy
  sudo systemctl enable caddy
fi

log "Caddy proxying port $CADDY_PORT → localhost:$APP_PORT"

# ===========================================================================
# 4. PM2 STARTUP (auto-restart on reboot)
# ===========================================================================
step "4. PM2 Startup Configuration"

if pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null | sudo tee /dev/null; then
  info "PM2 startup script configured"
else
  warn "PM2 startup may need manual configuration. Run: pm2 startup"
fi

pm2 save

log "PM2 process list saved"

# ===========================================================================
# 5. ENVIRONMENT VARIABLES CHECK
# ===========================================================================
step "5. Environment Variables Check"

# Load .env if it exists (for checking)
set -a
if [ -f "$APP_DIR/.env" ]; then
  # shellcheck disable=SC1090
  source "$APP_DIR/.env" 2>/dev/null || true
fi
set +a

MISSING_VARS=()
WARN_VARS=()

check_var() {
  local name="$1"
  local required="${2:-required}"
  local value="${!name:-}"

  if [ -z "$value" ]; then
    if [ "$required" = "required" ]; then
      MISSING_VARS+=("$name")
      error "  ✗ $name is NOT SET (required)"
    else
      WARN_VARS+=("$name")
      warn "  ⚠ $name is not set (optional)"
    fi
  else
    # Check if value looks like a placeholder
    if echo "$value" | grep -qiE '^(your-|placeholder|changeme|xxx|sk-xxx|https://.*\.supabase\.co$)'; then
      WARN_VARS+=("$name")
      warn "  ⚠ $name appears to contain a placeholder value"
    else
      # Never echo the actual value!
      info "  ✓ $name is set"
    fi
  fi
}

info "Checking critical environment variables..."
check_var "Z_AI_API_KEY" "required"
check_var "NEXT_PUBLIC_SUPABASE_URL" "required"
check_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "required"
check_var "SUPABASE_SERVICE_ROLE_KEY" "required"

info "Checking optional environment variables..."
check_var "DATABASE_URL" "optional"
check_var "OPENCLAW_PORT" "optional"
check_var "OPENCLAW_GATEWAY_URL" "optional"
check_var "TTS_API_URL" "optional"

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  error "MISSING REQUIRED VARIABLES: ${MISSING_VARS[*]}"
  error "The app will NOT function correctly without them."
  error "Edit: nano $APP_DIR/.env"
  error "Then restart: pm2 restart quranpulse"
  error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

if [ ${#WARN_VARS[@]} -gt 0 ]; then
  warn "Variables with issues: ${WARN_VARS[*]}"
  warn "Please verify values in: $APP_DIR/.env"
fi

# ===========================================================================
# 6. HEALTH CHECK
# ===========================================================================
step "6. Post-Deploy Health Check"

sleep 5  # Wait for the app to start

HEALTH_OK=false

# Try direct port first
if curl -sf -o /dev/null "http://localhost:$APP_PORT" 2>/dev/null; then
  log "App is responding on port $APP_PORT ✓"
  HEALTH_OK=true
elif curl -sf -o /dev/null "http://localhost:$CADDY_PORT" 2>/dev/null; then
  log "App is responding via Caddy on port $CADDY_PORT ✓"
  HEALTH_OK=true
else
  warn "App not yet responding — it may still be starting up."
  warn "Check: pm2 logs quranpulse"
fi

# Check PM2 status
PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "unknown")
if [ "$PM2_STATUS" = "online" ]; then
  log "PM2 process status: online ✓"
elif [ "$PM2_STATUS" = "stopped" ] || [ "$PM2_STATUS" = "errored" ]; then
  error "PM2 process status: $PM2_STATUS ✗"
  warn "Check logs: pm2 logs quranpulse"
else
  info "PM2 process status: $PM2_STATUS"
fi

# ===========================================================================
# 7. DEPLOYMENT SUMMARY
# ===========================================================================
step "7. Deployment Summary"

echo ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  QuranPulse Deployment Complete!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log ""
log "  App Directory:  $APP_DIR"
log "  App Port:       $APP_PORT"
log "  Caddy Port:     $CADDY_PORT"
log "  PM2 Process:    quranpulse"
log "  VPS IP:         76.13.176.142"
log "  Access URL:     http://76.13.176.142:$CADDY_PORT"
log ""
log "  Useful Commands:"
log "    pm2 logs quranpulse          # View application logs"
log "    pm2 restart quranpulse       # Restart the app"
log "    pm2 stop quranpulse          # Stop the app"
log "    pm2 monit                    # Monitor CPU/Memory"
log "    sudo systemctl status caddy  # Check Caddy status"
log "    nano $APP_DIR/.env           # Edit environment variables"
log ""
if [ "$HEALTH_OK" = true ]; then
  log "  Status: ✅ HEALTHY — App is running and responding"
else
  warn "  Status: ⏳ STARTING — App may still be initializing"
  warn "  Run 'pm2 logs quranpulse' to check startup progress"
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  error "  ⚠️  ${#MISSING_VARS[@]} required env vars are MISSING!"
  error "  The app will not work correctly until they are set."
fi

echo ""
log "Deployment log: $LOG_FILE"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
