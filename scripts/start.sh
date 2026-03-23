#!/bin/bash

# Local Development Server Startup Script
# Starts both the frontend (Vite) and backend (Express) concurrently

set +e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
FRONTEND_DIR="$ROOT_DIR/frontend"
SERVER_DIR="$ROOT_DIR/server"

echo -e "${BLUE}Starting development environment...${NC}"
echo ""

# Install root dependencies (concurrently)
if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    cd "$ROOT_DIR" && npm install
    echo -e "${GREEN}Done${NC}"
    echo ""
fi

# Install frontend dependencies
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$FRONTEND_DIR" && npm install
    echo -e "${GREEN}Done${NC}"
    echo ""
fi

# Install server dependencies
if [ ! -d "$SERVER_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd "$SERVER_DIR" && npm install
    echo -e "${GREEN}Done${NC}"
    echo ""
fi

# Warn if env files are missing
if [ ! -f "$FRONTEND_DIR/.env.local" ] && [ ! -f "$FRONTEND_DIR/.env" ]; then
    echo -e "${YELLOW}Warning: No .env.local found in frontend/ — Supabase/WorkOS vars may be missing${NC}"
fi
if [ ! -f "$SERVER_DIR/.env" ]; then
    echo -e "${YELLOW}Warning: No .env found in server/ — backend env vars may be missing${NC}"
fi

echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend:  http://localhost:3001${NC}"
echo ""

cd "$ROOT_DIR"
npm run dev
