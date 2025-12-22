#!/bin/bash

# Local Development Server Startup Script
# This script ensures dependencies are installed and starts the development server

# Don't exit on error for npm start (it's a long-running process)
set +e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo -e "${BLUE}🚀 Starting local development server...${NC}"
echo ""

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${YELLOW}❌ Frontend directory not found at: $FRONTEND_DIR${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}❌ package.json not found in frontend directory${NC}"
    exit 1
fi

# Check if node_modules exists, if not, run npm install
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 node_modules not found. Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo ""
fi

# Check for .env file (warn if missing but don't fail)
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: No .env or .env.local file found${NC}"
    echo -e "${YELLOW}   Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set${NC}"
    echo ""
fi

# Start the development server
echo -e "${BLUE}🎯 Starting development server...${NC}"
echo -e "${BLUE}   The app will open at http://localhost:3000${NC}"
echo -e "${BLUE}   If it doesn't open automatically, navigate to that URL${NC}"
echo -e "${YELLOW}   Check the terminal for any compilation errors${NC}"
echo -e "${YELLOW}   Check the browser console (F12) for runtime errors${NC}"
echo ""
echo -e "${GREEN}Starting server...${NC}"
echo ""

# Run npm start (this will keep running)
npm start

# If we get here, npm start exited (which shouldn't happen normally)
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Server exited with an error. Check the output above for details.${NC}"
    exit 1
fi

