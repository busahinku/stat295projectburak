# 🚀 Hospital Management System - Deployment Guide

This guide covers multiple deployment options for your hospital management system, from simple hosting to production-ready deployments.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Working Next.js application
- ✅ Supabase database with schema and data
- ✅ Environment variables configured
- ✅ All dependencies listed in package.json
- ✅ Build process tested locally

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free Tier Available)

**Perfect for**: Quick deployment, auto-scaling, built-in CDN

#### Steps:
1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Set environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Deploy!

3. **Configure Custom Domain** (Optional)
   - In Vercel dashboard, go to your project
   - Click "Domains" tab
   - Add your custom domain

**URL**: Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Netlify (Free Tier Available)

**Perfect for**: Static site hosting with serverless functions

#### Steps:
1. **Build the project**
   ```bash
   npm run build
   npm run export  # If using static export
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `out` folder (for static) or connect GitHub repo
   - Set environment variables in Site Settings > Environment Variables
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

### Option 3: Railway (Database + App Hosting)

**Perfect for**: Full-stack deployment with database

#### Steps:
1. **Sign up at Railway**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub account

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Next.js and deploys

3. **Environment Variables**
   - Go to your project dashboard
   - Click "Variables" tab
   - Add your Supabase credentials

### Option 4: Digital Ocean App Platform

**Perfect for**: Scalable production deployment

#### Steps:
1. **Create App**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Navigate to Apps
   - Create new app from GitHub

2. **Configure**
   - Select your repository
   - Set build command: `npm run build`
   - Set run command: `npm start`
   - Add environment variables

### Option 5: Self-Hosted (VPS/Server)

**Perfect for**: Full control, custom configurations

#### Requirements:
- Ubuntu/CentOS server
- Node.js 18+
- Nginx (optional)
- PM2 for process management

#### Steps:
1. **Server Setup**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd hospital-management
   
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env.local
   # Edit .env.local with your values
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "hospital-app" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx** (Optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Environment Variables Setup

Create these environment variables in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🗄️ Database Deployment (Supabase)

Your Supabase database is already configured. For production:

1. **Production Database**
   - Use the same Supabase project
   - OR create a new project for production
   - Run the schema migration: `database/schema.sql`
   - Add sample data: `database/sample_data.sql`

2. **Database Security**
   - Review Row Level Security policies
   - Update CORS settings if needed
   - Monitor usage and set up alerts

## 🌍 Custom Domain Setup

### For Vercel:
1. Purchase domain from any registrar
2. In Vercel dashboard: Settings > Domains
3. Add domain and follow DNS instructions

### For Other Platforms:
1. Point your domain's A record to the platform's IP
2. Configure SSL certificate (usually automatic)

## 📊 Performance Optimization

### Before Deployment:
1. **Optimize Images**
   ```bash
   # Use Next.js Image component
   import Image from 'next/image'
   ```

2. **Enable Compression**
   ```javascript
   // next.config.ts
   module.exports = {
     compress: true,
     experimental: {
       optimizePackageImports: ['lucide-react']
     }
   }
   ```

3. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   npm run analyze
   ```

## 🔍 Monitoring & Analytics

### Add Analytics:
1. **Vercel Analytics** (Free)
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**
   ```javascript
   // Add to _app.tsx or layout.tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side
   - Restart development server after changes
   - Check deployment platform's environment variables section

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check database policies and RLS settings
   - Ensure database is accessible from deployment platform

4. **Performance Issues**
   - Enable compression in deployment platform
   - Use CDN for static assets
   - Optimize database queries

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test # if you have tests
```

## 📱 Mobile Optimization

Your app is already mobile-responsive, but for PWA:

1. **Add Manifest**
   ```javascript
   // public/manifest.json already exists
   ```

2. **Service Worker** (Optional)
   ```bash
   npm install next-pwa
   ```

## 🎯 SEO Optimization

1. **Meta Tags** (Already implemented)
2. **Sitemap Generation**
   ```javascript
   // Add to next.config.ts
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/sitemap.xml',
           destination: '/api/sitemap'
         }
       ]
     }
   }
   ```

## 📧 Production Checklist

Before going live:

- [ ] Test all user roles and functionalities
- [ ] Verify database connections
- [ ] Check responsive design on mobile
- [ ] Test payment workflows
- [ ] Set up error monitoring
- [ ] Configure backup strategy
- [ ] Set up SSL certificate
- [ ] Test performance under load
- [ ] Review security settings
- [ ] Set up analytics

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check Supabase logs for database issues
4. Use browser developer tools for frontend debugging

## 🎉 Go Live!

Choose your preferred deployment method and follow the steps above. Your hospital management system will be live and accessible to users worldwide!

**Recommended for beginners**: Start with Vercel - it's free, fast, and handles everything automatically.

**Recommended for production**: Digital Ocean or Railway for better control and scalability. 