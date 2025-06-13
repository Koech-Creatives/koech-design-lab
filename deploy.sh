#!/bin/bash

# Koech Canvas Deployment Script
# This script helps prepare and deploy the app to Render

echo "🚀 Koech Canvas Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run build test
echo "🔨 Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Production ready"
else
    echo "📝 Committing changes..."
    git add .
    git commit -m "Production ready build - $(date)"
fi

echo ""
echo "✅ Pre-deployment checks complete!"
echo ""
echo "🌐 Next steps for Render deployment:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to https://dashboard.render.com"
echo "3. Create new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - VITE_SUPABASE_URL=your-supabase-url"
echo "   - VITE_SUPABASE_ANON_KEY=your-supabase-key"
echo "6. Deploy!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!" 