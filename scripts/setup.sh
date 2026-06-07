#!/bin/bash

echo "=========================================="
echo "  StudentHub Setup Script"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is required but not installed."
    echo "Install from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js 18 or higher is required."
    echo "Current version: $(node -v)"
    exit 1
fi

echo "Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

# Setup environment
echo ""
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "Please update .env.local with your Supabase credentials"
else
    echo ".env.local already exists"
fi

# Create storage buckets instruction
echo ""
echo "=========================================="
echo "  Next Steps"
echo "=========================================="
echo ""
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Copy your project URL and keys to .env.local"
echo "3. Run the SQL schema from docs/DATABASE_SCHEMA.sql"
echo "4. Create storage buckets in Supabase:"
echo "   - student-photos (Public)"
echo "   - teacher-photos (Public)"
echo "   - school-logos (Public)"
echo "   - assignment-files (Private)"
echo "   - submission-files (Private)"
echo "   - documents (Private)"
echo "   - id-cards (Private)"
echo "5. Run: npm run dev"
echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
