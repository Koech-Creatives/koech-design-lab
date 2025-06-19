# Koech Labs Landing Page Implementation Guide

## 🏗️ Project Structure
```
koech-labs-landing/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── features/page.tsx           # Features overview
│   │   ├── frames/page.tsx             # Frames details
│   │   ├── stacks/page.tsx             # Stacks coming soon
│   │   ├── muse/page.tsx               # Muse coming soon
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── PlatformOverview.tsx
│   │   │   ├── FeaturesList.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── CTA.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── ComingSoon.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── data/
│       ├── features.ts
│       └── testimonials.ts
└── public/
    ├── images/
    └── icons/
```

## 🎨 Key Components

### 1. Hero Section (Home Page) 
```jsx
// Hero Component
export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to <span className="text-yellow-400">Koech Labs</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          The Complete Creator Platform: Design → Automate → Optimize
        </p>
        
        {/* Three Tool Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <ToolCard 
            name="Frames"
            description="Professional Design Canvas"
            status="available"
            href="/frames"
            ctaText="Start Designing"
          />
          <ToolCard 
            name="Stacks"
            description="AI Carousel Builder"
            status="coming-soon"
            href="/stacks"
            ctaText="Join Waitlist"
          />
          <ToolCard 
            name="Muse"
            description="AI Content Assistant"
            status="coming-soon"
            href="/muse"
            ctaText="Join Waitlist"
          />
        </div>
      </div>
    </section>
  );
}
```

### 2. Frames Page (Detailed)
```jsx
// Frames page: /frames/page.tsx
export default function FramesPage() {
  return (
    <div>
      {/* Hero for Frames */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Frames - Professional Design Canvas
          </h1>
          <p className="text-xl mb-8">
            Create stunning social media content with our intuitive design tool
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('https://your-current-app.com', '_blank')}
          >
            Launch Frames →
          </Button>
        </div>
      </section>

      {/* Feature Sections */}
      <FeatureShowcase />
      <HowItWorks />
      <Benefits />
      <CTA ctaText="Start Using Frames" href="https://your-current-app.com" />
    </div>
  );
}
```

### 3. Coming Soon Pages
```jsx
// Stacks/Muse pages
export default function StacksPage() {
  return (
    <ComingSoon 
      toolName="Stacks"
      description="AI-Powered Carousel Builder"
      features={[
        "Automatic content suggestions",
        "Layout optimization",
        "Drag-and-drop interface",
        "Smart templates"
      ]}
      launchDate="Q2 2024"
    />
  );
}
```

## 🔗 Integration Strategy

### Current App Integration
1. **Frames button/link** → Redirects to current Koech Canvas app
2. **Shared design system** → Use same colors/fonts as current app
3. **User flow** → Seamless signup/login between landing and app

### URL Structure
```
Landing Page Routes:
├── koechlabs.com/              # Home
├── koechlabs.com/features      # All features
├── koechlabs.com/frames        # Frames details + launch
├── koechlabs.com/stacks        # Coming soon
└── koechlabs.com/muse          # Coming soon

App Routes:
├── frames.koechlabs.com        # Current app (subdomain)
└── app.koechlabs.com           # Alternative
```

## 🎯 Key Messaging Strategy

### Home Page Messaging
- **Primary**: "Complete Creator Platform"
- **Secondary**: "Three powerful tools for modern creators"
- **CTA**: "Start with Frames (Available Now)"

### Frames Page Messaging
- **Primary**: "Professional Design Canvas"
- **Secondary**: "Create stunning social media content"
- **Features**: Multi-platform support, templates, collaboration
- **CTA**: "Launch Frames" → direct to current app

### Coming Soon Messaging
- **Primary**: "Exciting AI tools coming soon"
- **Secondary**: "Join the waitlist for early access"
- **CTA**: Email capture for notifications

## 🚀 Development Priorities

### Phase 1 (Week 1)
- [ ] Set up Next.js project
- [ ] Create basic layout (Navbar, Footer)
- [ ] Build Home page with three-tool overview
- [ ] Create Frames detail page
- [ ] Set up routing

### Phase 2 (Week 2)
- [ ] Build coming soon pages for Stacks/Muse
- [ ] Add animations and interactions
- [ ] Implement email capture
- [ ] Connect to current app

### Phase 3 (Week 3)
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Deploy and test

## 📊 Success Metrics
- **Landing page visits** → Frames app signups
- **Email captures** for Stacks/Muse waitlist
- **Time on page** for each tool section
- **Conversion rate** from landing to app

## 🎨 Design System Alignment
- Use **same brand colors** as current Koech Canvas app
- **Consistent typography** and spacing
- **Shared UI components** for buttons, cards, forms
- **Responsive design** that matches app's mobile experience 