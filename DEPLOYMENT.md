# Deployment Guide - Render.com

This guide will walk you through deploying Koech Canvas to Render.com, a modern cloud platform that makes deployment simple and reliable.

## 🚀 Quick Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Supabase Project**: Set up authentication backend
4. **Environment Variables**: Prepare your configuration values

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Fork or Clone** this repository to your GitHub account
2. **Ensure all files are committed** and pushed to your main branch
3. **Verify the following files exist**:
   - `package.json` (with production scripts)
   - `render.yaml` (deployment configuration)
   - `public/_redirects` (SPA routing support)
   - `vite.config.ts` (production build settings)

### Step 2: Create Render Service

1. **Log in to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account if not already connected
   - Choose your forked repository

3. **Configure Service**
   ```
   Name: koech-canvas (or your preferred name)
   Environment: Node
   Region: Oregon (or closest to your users)
   Branch: main
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```

### Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

#### Required Variables
```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional Variables
```bash
VITE_DIRECTUS_URL=https://koech-labs.onrender.com
VITE_APP_NAME=Koech Canvas
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for Build**: First deployment takes 5-10 minutes
3. **Monitor Logs**: Check build progress in the dashboard
4. **Test Deployment**: Visit your app URL once build completes

## 🔐 Environment Variables Setup

### Supabase Configuration

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Go to Settings → API
   - Copy Project URL and anon public key

2. **Add to Render**:
   ```
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Directus Configuration (Optional)

If using Directus backend:
```
VITE_DIRECTUS_URL=https://your-directus-instance.com
```

## 🛠️ Build Configuration

The app is configured with production-optimized settings:

### Vite Configuration
- **Minification**: Enabled for production
- **Source Maps**: Disabled in production
- **Code Splitting**: Automatic vendor/UI/utils chunks
- **Asset Optimization**: Images and fonts optimized

### Performance Features
- **Lazy Loading**: Components loaded on demand
- **Tree Shaking**: Unused code eliminated
- **Compression**: Gzip compression enabled
- **Caching**: Static assets cached with long TTL

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Check for typos in variable names
- Verify values don't contain spaces or special characters

#### App Loads But Features Don't Work
- Check browser console for errors
- Verify Supabase URL and key are correct
- Test authentication flow

#### Routing Issues (404 on refresh)
- Ensure `public/_redirects` file exists
- Check SPA routing configuration

### Debug Mode

Enable debug logging in production (temporarily):
```javascript
// In browser console
localStorage.setItem('debug', 'koech-canvas:*');
```

## 📊 Monitoring

### Render Dashboard
- **Metrics**: CPU, Memory, Response times
- **Logs**: Real-time application logs
- **Events**: Deployment history
- **Health Checks**: Automatic monitoring

### Performance Monitoring
- **Lighthouse**: Run performance audits
- **Web Vitals**: Monitor Core Web Vitals
- **Error Tracking**: Monitor JavaScript errors

## 🔄 Updates and Maintenance

### Automatic Deployments
- **Auto-deploy**: Enabled by default on main branch
- **Manual Deploy**: Use "Manual Deploy" button
- **Rollback**: Easy rollback to previous versions

### Updating Dependencies
```bash
# Update packages
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 💰 Pricing

### Render Free Tier
- **750 hours/month**: Free compute time
- **Automatic SSL**: Free HTTPS certificates
- **Global CDN**: Fast content delivery
- **Limitations**: Sleeps after 15 minutes of inactivity

### Upgrading
- **Starter Plan**: $7/month for always-on service
- **Standard Plan**: $25/month for better performance
- **Pro Plan**: $85/month for high-traffic apps

## 🔒 Security

### HTTPS
- **Automatic SSL**: Free Let's Encrypt certificates
- **Force HTTPS**: Automatic HTTP to HTTPS redirects
- **HSTS**: HTTP Strict Transport Security enabled

### Environment Security
- **Encrypted Variables**: Environment variables encrypted at rest
- **Build Isolation**: Each build runs in isolated container
- **Access Control**: Team-based access management

## 📈 Scaling

### Horizontal Scaling
- **Multiple Instances**: Scale across multiple servers
- **Load Balancing**: Automatic traffic distribution
- **Auto-scaling**: Scale based on traffic

### Performance Optimization
- **CDN**: Global content delivery network
- **Compression**: Automatic gzip compression
- **Caching**: Intelligent caching strategies

## 🆘 Support

### Render Support
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status Page**: [status.render.com](https://status.render.com)

### App Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check README.md for setup help
- **Email**: support@koechcreatives.com

---

## 🎉 Success!

Once deployed, your Koech Canvas app will be available at:
`https://your-service-name.onrender.com`

The app includes:
- ✅ Professional design interface
- ✅ Multi-platform support
- ✅ User authentication
- ✅ Real-time saving
- ✅ Export functionality
- ✅ Responsive design
- ✅ Production optimizations

Happy designing! 🎨 