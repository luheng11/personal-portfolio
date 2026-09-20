#!/bin/bash
# ============================================
#   Website Stopper (Linux/macOS)
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "============================================"
echo "  Website Stopper (Linux/macOS)"
echo "============================================"
echo ""

# Stop services via PID files
stop_by_pid() {
    local name=$1
    local pidfile="$ROOT/logs/$2.pid"
    if [ -f "$pidfile" ]; then
        PID=$(cat "$pidfile")
        if kill -0 "$PID" 2>/dev/null; then
            echo -e "${BLUE}[INFO]${NC} Stopping $name (PID: $PID)..."
            kill "$PID" 2>/dev/null
            sleep 1
            if kill -0 "$PID" 2>/dev/null; then
                kill -9 "$PID" 2>/dev/null
            fi
            echo -e "${GREEN}[OK]${NC} $name stopped"
        else
            echo -e "${YELLOW}[INFO]${NC} $name process does not exist"
        fi
        rm -f "$pidfile"
    else
        echo -e "${YELLOW}[INFO]${NC} $name PID file not found"
    fi
}

stop_by_pid "Frontend" "frontend"
stop_by_pid "Backend" "api"

# Backup: kill processes listening on the ports
for port in 5173 3001; do
    PIDS=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        echo -e "${BLUE}[INFO]${NC} Killing processes on port $port..."
        echo "$PIDS" | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}[OK]${NC} Processes on port $port killed"
    fi
done

echo ""
echo "============================================"
echo -e "  ${GREEN}All services stopped${NC}"
echo "============================================"
