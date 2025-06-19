# Koech Labs - Render Deployment Guide

## 🚀 **Deployment Overview**

This guide covers deploying both applications to Render.com:
- **Landing Page** → `koechlabs.com`
- **Canvas App (Frames)** → `frames.koechlabs.com`

---

## 📋 **Prerequisites**

1. **GitHub Repositories** for both applications
2. **Render.com account** (free tier works)
3. **Domain ownership** (koechlabs.com)
4. **Environment variables** for canvas app

---

## 🎯 **Step 1: Deploy Canvas App (Frames)**

### **1.1 Create Render Service**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your **koech-design-lab** GitHub repository
4. Use these settings:

```yaml
Name: koech-frames-app
Environment: Node
Plan: Free
Build Command: npm install && npm run build
Start Command: npm run start
Auto-Deploy: Yes
```

### **1.2 Environment Variables**
Add these in Render dashboard:

```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_DIRECTUS_URL=https://your-directus-instance.com
```

### **1.3 Custom Domain**
1. In Render service settings → **"Custom Domains"**
2. Add: `frames.koechlabs.com`
3. Configure DNS (see DNS section below)

---

## 🎯 **Step 2: Deploy Landing Page**

### Perfect — based on the brand visuals from your logo (deep navy blue, clean white typography, and a red play/forward arrow), here’s a stylized dashboard layout for Koech Labs, including a dark-mode theme and feature status flags for in-progress modules.

⸻

🧪 Koech Labs Dashboard v1

Modular. Intelligent. Creator-First.

✅ Active Modules
	•	🎨 Frames — Visual design canvas (READY)
	•	🧩 Stacks — AI-powered carousel builder (Coming Soon)
	•	🧠 Muse — AI content assistant (Coming Soon)

⸻

🖌️ Color Scheme (from logo)

Element	Color	Use Case
Primary	#012B4C (Deep Navy)	Background, headers, nav
Accent	#FF3E3E (Signal Red)	Call-to-action buttons, badges
Text Light	#FFFFFF (White)	Primary text on dark
Text Muted	#A9B3C1 (Muted blue-gray)	Side labels, placeholders
Card/Panel	#0D3A5C or #112D4E	Inner backgrounds


⸻

🧭 Sidebar Navigation

[Lab Logo] Koech Labs

🏠  Dashboard
🎨  Frames          ✔️ Ready
🧩  Stacks          🚧 Coming Soon
🧠  Muse            🚧 Coming Soon
🧰  Identity        🔒 Coming Soon
📅  Post            🔒 Coming Soon
📊  Pulse           🔒 Coming Soon
🔌  Link            🔒 Coming Soon
💻  Core            🔒 Coming Soon

[Settings Icon]  Profile / Account


⸻

🧱 Dashboard Layout Structure

🏠 Dashboard (Main View)

Welcome back, [User]! Let’s build something brilliant.

Quick Actions
	•	[Create New Design 🎨]
	•	[Generate Carousel 🧩]
	•	[Ask Muse Anything 🧠]

Modules

Feature	Status	Description
Frames	✅ Ready	Your drag-and-drop canvas to design content across formats.
Stacks	🚧 Coming Soon	AI-powered slide & carousel generator.
Muse	🚧 Coming Soon	Content generation & smart assistant.
Identity	🔒 Locked	Store and apply your brand’s style.
Post	🔒 Locked	Schedule and publish to all platforms.
Pulse	🔒 Locked	Performance insights and engagement analytics.
Link	🔒 Locked	Connect tools and social platforms.
Core	🔒 Locked	Developer APIs & SDK access.

🔔 Tip: New modules will unlock as they’re released. You’ll be notified via in-app badge.

⸻

📐 Component Design Guidelines

Cards

background: #0D3A5C;
border-radius: 16px;
padding: 24px;
color: #FFFFFF;
box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;

Buttons

.primary {
  background: #FF3E3E;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
}
.secondary {
  background: transparent;
  border: 1px solid #FF3E3E;
  color: #FF3E3E;
}


⸻

✅ What’s Ready
	•	Frames is fully integrated with:
	•	Responsive drag-and-drop canvas
	•	Element panels, brand panel
	•	Project management
	•	Export via html2canvas

⸻

🚀 Next Steps

I recommend:
	1.	Use this dashboard layout as your base shell in App.tsx or a DashboardLayout.tsx
	2.	Add ComingSoonCard components for inactive modules
	3.	Load feature flags via context or moduleStatus.ts map
	4.	Style with Tailwind classes like:

<div className="bg-[#012B4C] text-white p-6 rounded-xl shadow-lg">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-bold">Stacks</h3>
    <span className="bg-red-500 px-2 py-1 text-sm rounded-md">Coming Soon</span>
  </div>
</div>


⸻

Would you like:
	•	A Figma file of this dashboard?
	•	Tailwind-ready React components?
	•	A dynamic feature flag system to control module access?

Let’s ship this clean, confident dashboard that scales with each release.e Render Service** 
1. Create **new Web Service** in Render
2. Connect your **koech-labs-landing** GitHub repository
3. Use these settings:

```yaml
Name: koech-labs-landing
Environment: Node
Plan: Free
Build Command: npm install && npm run build
Start Command: npm start
Auto-Deploy: Yes
```

### **2.2 Custom Domain**
1. In Render service settings → **"Custom Domains"**
2. Add: `koechlabs.com`
3. Configure DNS (see DNS section below)

---

## 🌐 **Step 3: DNS Configuration**

### **For koechlabs.com (Landing Page)**
```bash
# DNS Records at your domain provider
Type: CNAME
Name: @
Value: koech-labs-landing.onrender.com

# Alternative A Record
Type: A
Name: @
Value: [Render IP - provided in dashboard]
```

### **For frames.koechlabs.com (Canvas App)**
```bash
# DNS Records at your domain provider  
Type: CNAME
Name: frames
Value: koech-frames-app.onrender.com
```

---

## 🔗 **Step 4: Connection Flow**

### **User Journey:**
```
1. User visits: koechlabs.com (Landing)
2. Clicks "Try it now" 
3. Opens: frames.koechlabs.com (Canvas App)
4. User starts designing
```

### **Cross-Application Links:**
- **Landing → Canvas**: All CTAs point to `https://frames.koechlabs.com`
- **Canvas → Landing**: Header menu links to `https://koechlabs.com`

---

## ⚙️ **Step 5: Build Configuration**

### **Canvas App (package.json)**
Verify these scripts exist:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "start": "vite preview --port $PORT --host 0.0.0.0",
    "preview": "vite preview"
  }
}
```

### **Landing Page (package.json)**
Verify these scripts exist:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🔒 **Step 6: SSL & Security**

### **Automatic SSL**
- Render provides **free SSL certificates**
- Automatically enabled for custom domains
- Force HTTPS in production

### **Security Headers**
Add to canvas app's `vite.config.ts`:
```typescript
export default defineConfig({
  // ... existing config
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
```

---

## 📊 **Step 7: Monitoring & Analytics**

### **Render Built-in Monitoring**
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory, Response times
- **Alerts**: Email notifications for downtime

### **Add Analytics to Landing Page**
```javascript
// Add to landing page for conversion tracking
const handleTryNow = () => {
  // Track conversion event
  gtag('event', 'try_frames_click', {
    'event_category': 'engagement',
    'event_label': 'landing_to_frames'
  });
  
  window.open('https://frames.koechlabs.com', '_blank');
};
```

---

## 🚀 **Step 8: Deployment Commands**

### **Deploy Canvas App**
```bash
# Push to main branch to trigger auto-deploy
git add .
git commit -m "Deploy Frames to Render"
git push origin main
```

### **Deploy Landing Page**
```bash
# Push to main branch to trigger auto-deploy  
git add .
git commit -m "Deploy landing page to Render"
git push origin main
```

---

## 🐛 **Step 9: Troubleshooting**

### **Common Issues**

**1. Build Failures**
```bash
# Check Node.js version compatibility
"engines": {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
}
```

**2. Environment Variables**
- Ensure all VITE_ prefixed variables are set
- Check Supabase URL format
- Verify Directus instance accessibility

**3. Domain Connection Issues**
- DNS propagation can take 24-48 hours
- Use DNS checker tools to verify
- Check CNAME/A record configuration

**4. CORS Issues**
- Update Supabase allowed origins
- Add both domains to Directus CORS settings

---

## ✅ **Step 10: Post-Deployment Checklist**

### **Landing Page Tests**
- [ ] Page loads at koechlabs.com
- [ ] All CTA buttons work  
- [ ] Mobile responsiveness
- [ ] SSL certificate active
- [ ] Analytics tracking

### **Canvas App Tests**
- [ ] App loads at frames.koechlabs.com
- [ ] Authentication works
- [ ] Supabase connection active
- [ ] Canvas functionality intact
- [ ] Brand assets loading

### **Integration Tests** 
- [ ] Landing page CTAs open canvas app
- [ ] Canvas app "Back to Koech Labs" works
- [ ] User flow from landing → signup → canvas
- [ ] Cross-domain session handling

---

## 🎉 **Success Metrics**

Track these post-deployment:
- **Landing page conversions** → Canvas app visits
- **User registration rates** from landing page traffic  
- **Session duration** in canvas app
- **Feature usage** in Frames

---

## 📞 **Support Resources**

- **Render Documentation**: https://render.com/docs
- **DNS Configuration Help**: Contact your domain provider
- **Application Issues**: Check Render service logs
- **Performance Monitoring**: Use Render metrics dashboard

Your **complete Koech Labs platform** will be live at:
- 🏠 **Landing**: https://koechlabs.com 
- 🎨 **Frames**: https://frames.koechlabs.com 