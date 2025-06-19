# Landing Page Connections Guide

## 🔗 URL Connections

### Current Live URLs:
- **Landing Page**: https://koech-labs.onrender.com/
- **Canvas App (Frames)**: https://frames-koech-labs.onrender.com/

## 🚀 Landing Page CTA Buttons

All "Try it now" and "Start Designing" buttons on the landing page should link to:
```
https://frames-koech-labs.onrender.com/
```

### Example Button Code for Landing Page:
```jsx
<button
  onClick={() => window.open('https://frames-koech-labs.onrender.com/', '_blank')}
  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
>
  Try Frames Now - Free
</button>
```

### Or as direct link:
```jsx
<a
  href="https://frames-koech-labs.onrender.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium inline-block text-center"
>
  Try Frames Now - Free
</a>
```

## 🎯 Canvas App Back Links

The canvas app header now contains:
- **Logo text**: Links back to landing page
- **Dropdown menu**: "← Back to Koech Labs" option

Both point to: `https://koech-labs.onrender.com/`

## 👤 Guest Mode Implementation

### What's Implemented:
1. **Guest Access**: Users can now use the canvas app without logging in
2. **Feature Restrictions**: Export and Post features require authentication
3. **Login Prompts**: Clear modals explain why login is needed
4. **Guest Indicator**: Badge shows when user is in guest mode

### User Flow:
1. User visits landing page: `https://koech-labs.onrender.com/`
2. Clicks "Try it now" → Opens: `https://frames-koech-labs.onrender.com/`
3. Can use all design features without login
4. When trying to export/post → Prompted to create account or sign in
5. Can easily return to landing page via header links

## 🔧 Technical Changes Made:

### Canvas App Updates:
- ✅ Modified `AuthWrapper.tsx` to support guest mode
- ✅ Created `GuestContext.tsx` for guest state management
- ✅ Updated `Header.tsx` with authentication prompts
- ✅ Added guest mode indicators
- ✅ Updated all links to correct URLs

### Features Requiring Login:
- Export designs (PNG, JPG, PDF, SVG)
- Post to social media
- Save projects
- Access saved projects

### Features Available as Guest:
- Full design canvas
- All design tools
- Templates
- Brand colors and fonts
- Multiple pages/carousel creation
- All platform formats (Instagram, LinkedIn, Twitter, TikTok)

## 📱 Mobile Responsiveness

Both guest mode banners and login prompts are fully responsive and work on mobile devices.

## 🎨 Styling

All new components follow the existing design system:
- Dark theme with navy blue backgrounds
- Red accent color (#ff4940) for primary actions
- Consistent spacing and typography
- Smooth transitions and hover effects

## 🚀 Ready for Production

The connection between both sites is now complete and ready for user testing! 