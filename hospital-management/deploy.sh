#!/bin/bash

# Hospital Management System - Quick Deployment Script
# This script helps you deploy your application quickly

echo "🏥 Hospital Management System - Deployment Script"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ In correct project directory"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check environment variables
echo ""
echo "🔍 Checking environment variables..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found."
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Environment file found"
fi

# Build the application
echo ""
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Deployment options
echo ""
echo "🚀 Choose your deployment method:"
echo "1. Vercel (Recommended)"
echo "2. Netlify" 
echo "3. Manual deployment preparation"
echo "4. Local production test"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔷 Vercel Deployment"
        echo "==================="
        
        if ! command_exists vercel; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Please follow these steps:"
        echo "1. Run: vercel login"
        echo "2. Run: vercel"
        echo "3. Follow the prompts"
        echo "4. Set environment variables in Vercel dashboard"
        ;;
        
    2)
        echo ""
        echo "🟢 Netlify Deployment"
        echo "===================="
        
        if ! command_exists netlify; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "Please follow these steps:"
        echo "1. Run: netlify login"
        echo "2. Run: netlify deploy"
        echo "3. For production: netlify deploy --prod"
        ;;
        
    3)
        echo ""
        echo "📁 Manual Deployment Preparation"
        echo "================================"
        
        echo "Creating deployment package..."
        mkdir -p deploy-package
        
        # Copy necessary files
        cp -r .next deploy-package/
        cp -r public deploy-package/
        cp package.json deploy-package/
        cp package-lock.json deploy-package/
        
        # Create production scripts
        cat > deploy-package/start.sh << 'EOF'
#!/bin/bash
npm install --production
npm start
EOF
        
        chmod +x deploy-package/start.sh
        
        echo "✅ Deployment package created in ./deploy-package/"
        echo "Upload this folder to your server and run start.sh"
        ;;
        
    4)
        echo ""
        echo "🧪 Local Production Test"
        echo "======================="
        
        echo "Starting production server locally..."
        echo "This will start the app in production mode on http://localhost:3000"
        echo "Press Ctrl+C to stop"
        npm start
        ;;
        
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🆘 For support, check the troubleshooting section in DEPLOYMENT.md"
echo ""
echo "🌐 Your hospital management system is ready to go live!" 