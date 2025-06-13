# Koech Canvas - Professional Design Tool

A modern, professional design tool for creating stunning social media content. Built with React, TypeScript, and Tailwind CSS.

![Koech Canvas](./public/logo.png)

## 🚀 Features

- **Multi-Platform Support**: Design for Instagram, LinkedIn, Twitter, and TikTok
- **Professional Templates**: Pre-designed templates for quick start
- **Advanced Canvas Tools**: Text, shapes, images, and more
- **Real-time Collaboration**: Save and sync your designs
- **Export Options**: High-quality PNG exports
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Supabase Auth
- **Backend**: Directus CMS (optional)
- **Icons**: Lucide React
- **Canvas Export**: html2canvas

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm 8+

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd koech-design-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_DIRECTUS_URL=https://your-directus-instance.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Deployment

### Deploy to Render

This app is configured for easy deployment on Render.com:

1. **Fork this repository** to your GitHub account

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Environment Variables** in Render:
   ```
   NODE_ENV=production
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_DIRECTUS_URL=https://koech-labs.onrender.com
   ```

4. **Deploy**: Render will automatically build and deploy your app

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting provider

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Authentication
3. Copy your project URL and anon key to environment variables

### Directus Setup (Optional)

1. Set up a Directus instance
2. Create the required collections (see `DIRECTUS_SETUP.md`)
3. Configure CORS for your domain

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main canvas component
│   ├── Header.tsx      # App header
│   ├── Sidebar.tsx     # Left sidebar
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── CanvasContext.tsx
│   └── ...
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client
│   ├── directus.ts    # Directus client
│   └── ...
├── data/              # Static data
├── hooks/             # Custom React hooks
└── utils/             # Helper functions
```

## 🎨 Customization

### Branding

- Update `public/logo.png` with your logo
- Modify colors in `src/index.css`
- Update app name in `package.json` and `index.html`

### Platform Support

Add new platforms by updating:
- `src/data/platforms.ts`
- `src/components/Header.tsx`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Check Node.js version (18+ required)
2. **Environment Variables**: Ensure all VITE_ prefixed variables are set
3. **CORS Issues**: Configure your backend to allow your domain
4. **Authentication**: Verify Supabase configuration

### Debug Mode

Enable debug logging in development:
```javascript
localStorage.setItem('debug', 'koech-canvas:*');
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@koechcreatives.com

## 🔄 Version History

- **v1.0.0** - Initial production release
  - Multi-platform design support
  - Professional templates
  - Export functionality
  - Authentication system

---

Built with ❤️ by [Koech Creatives](https://koechcreatives.com)
