#!/bin/bash
# ============================================
#   卢恒作品集 (Linux/macOS)
# ============================================

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "============================================"
echo "  Website Launcher (Linux/macOS)"
echo "============================================"
echo ""

# Check node installation
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js not found, please install Node.js first"
    echo "Download: https://nodejs.org/"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} Node.js version: $(node -v)"
echo ""

# Check frontend dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[INFO]${NC} Installing frontend dependencies..."
    npm install
fi

# Check backend dependencies
if [ ! -d "api/node_modules" ]; then
    echo -e "${YELLOW}[INFO]${NC} Installing backend dependencies..."
    (cd api && npm install)
fi

# Create logs directory
mkdir -p "$ROOT/logs"

echo -e "${BLUE}[INFO]${NC} Starting backend service (port 3001)..."
(cd api && npm run dev) > "$ROOT/logs/api.log" 2>&1 &
API_PID=$!
echo $API_PID > "$ROOT/logs/api.pid"
echo -e "${GREEN}[OK]${NC} Backend PID: $API_PID"

echo -e "${BLUE}[INFO]${NC} Waiting for backend to start..."
sleep 3

echo -e "${BLUE}[INFO]${NC} Starting frontend service (port 5173)..."
npm run dev > "$ROOT/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$ROOT/logs/frontend.pid"
echo -e "${GREEN}[OK]${NC} Frontend PID: $FRONTEND_PID"

echo ""
echo "============================================"
echo -e "  ${GREEN}Services started successfully!${NC}"
echo "============================================"
echo -e "  Backend  API:  ${BLUE}http://localhost:3001${NC}"
echo -e "  Frontend UI:  ${BLUE}http://localhost:5173${NC}"
echo "============================================"
echo ""
echo "Logs: $ROOT/logs/"
echo "  - api.log       (backend logs)"
echo "  - frontend.log  (frontend logs)"
echo ""
echo "Run './scripts/stop.sh' to stop services"
echo ""

# Capture exit signal to stop services
trap "bash $SCRIPT_DIR/stop.sh; exit" SIGINT SIGTERM

# Wait for services
wait
