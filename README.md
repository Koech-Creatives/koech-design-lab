# Koech Canvas

🎨 **Visual design studio with drag-and-drop interface for creating stunning posts and graphics**

Koech Canvas is a powerful, intuitive design tool perfect for designers, content creators, and marketers who need to create professional-quality graphics quickly and efficiently.

## ✨ Features

### 🎯 **Core Design Tools**
- **Drag & Drop Interface** - Intuitive visual editor
- **Template Library** - Pre-designed templates for various platforms
- **Brand Management** - Consistent branding across all designs
- **Multi-platform Export** - Instagram, Facebook, Twitter, LinkedIn formats
- **Real-time Collaboration** - Work together seamlessly

### 🎨 **Design Capabilities**
- **Text Editor** - Advanced typography controls
- **Image Handling** - Upload, crop, and manipulate images
- **Shape Tools** - Rectangles, circles, and custom shapes
- **Color Palette** - Brand colors and custom color picker
- **Layer Management** - Organize and control design elements

### 📱 **Platform Support**
- Instagram Posts (Square, Portrait, Story)
- Facebook Posts and Covers
- Twitter Headers and Posts
- LinkedIn Posts and Banners
- Custom dimensions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/koech-canvas.git
cd koech-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your configuration:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Directus Configuration (optional)
VITE_DIRECTUS_URL=your_directus_url
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
koech-canvas/
├── src/
│   ├── components/     # UI components
│   │   ├── Canvas.tsx       # Main design canvas
│   │   ├── Sidebar.tsx      # Tool sidebar
│   │   ├── Header.tsx       # Top navigation
│   │   └── ...
│   ├── contexts/       # React contexts
│   │   ├── CanvasContext.tsx    # Canvas state management
│   │   ├── AuthContext.tsx     # Authentication
│   │   └── ...
│   ├── utils/          # Utility functions
│   ├── data/           # Templates and static data
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── docs/              # Documentation
```

## 🎨 Usage

### Creating Your First Design

1. **Choose a Template** - Select from our template gallery or start from scratch
2. **Customize Elements** - Add text, images, shapes, and adjust properties
3. **Apply Branding** - Use your brand colors, fonts, and logo
4. **Export** - Download in your preferred format and resolution

### Template Gallery

The template gallery opens automatically when you start the app, featuring:
- Business templates
- Social media templates
- Marketing materials
- Personal branding templates

### Design Tools

- **AI Panel** - AI-powered design suggestions (coming soon)
- **Import** - Upload your own images and assets
- **Branding** - Manage brand colors, fonts, and logos
- **Canvas** - Layout and background controls
- **Design** - Shape and element tools
- **Colors** - Color palette and picker
- **Text** - Typography and text formatting
- **Order** - Layer management and arrangement

## 🔧 Configuration

### Brand Setup

1. Go to the Branding panel
2. Upload your logo
3. Set brand colors
4. Configure fonts
5. Save your brand kit

### Platform Formats

Koech Canvas supports multiple platform formats:
- **Instagram**: Square (1080x1080), Portrait (1080x1350), Story (1080x1920)
- **Facebook**: Post (1200x630), Cover (820x312)
- **Twitter**: Post (1024x512), Header (1500x500)
- **LinkedIn**: Post (1200x627), Banner (1584x396)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [Documentation](https://docs.koechcanvas.com)
- [Community Forum](https://community.koechcanvas.com)
- [Email Support](mailto:support@koechcanvas.com)

---

Built with ❤️ for designers and creators everywhere
