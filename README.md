# Koech Design Lab - Monorepo

A modern design platform built with React, TypeScript, and a monorepo architecture using npm workspaces.

## 🏗️ Architecture

This project is structured as a monorepo containing multiple applications and shared packages:

```
koech-design-lab/
├── apps/
│   ├── canvas/          # Original design canvas application
│   └── studio/          # New studio management application
├── shared/
│   ├── ui/             # Shared UI components
│   └── config/         # Shared configuration and types
├── api/                # Backend services (future)
└── package.json        # Root workspace configuration
```

## 📦 Packages

### Applications

#### `@koech-design-lab/canvas`
The main design canvas application with advanced editing capabilities:
- Canvas-based design editor
- Element manipulation and properties
- Template system
- Export functionality

#### `@koech-design-lab/studio`
Studio management application for organizing projects:
- **Dashboard**: Overview of projects and activity
- **Projects**: Project management and organization
- **Templates**: Template library and management
- **Brands**: Brand asset management
- **Settings**: User preferences and configuration

### Shared Packages

#### `@koech-design-lab/shared-ui`
Reusable UI components:
- Button, Input, Modal components
- Consistent design system
- Shared styling utilities

#### `@koech-design-lab/shared-config`
Shared configuration and types:
- Theme configuration
- Constants and API endpoints
- TypeScript interfaces and types

## 🚀 Getting Started

### Installation

```bash
# Install all dependencies
npm install

# Install dependencies for specific workspace
npm install --workspace=@koech-design-lab/canvas
```

### Development

```bash
# Start canvas application (default)
npm run dev

# Start specific applications
npm run dev:canvas   # Design canvas app
npm run dev:studio   # Studio management app
```

### Building

```bash
# Build all applications
npm run build

# Build specific applications
npm run build:canvas
npm run build:studio
```

### Other Commands

```bash
# Lint all workspaces
npm run lint

# Clean all node_modules
npm run clean

# Preview built applications
npm run preview
```

## 🛠️ Development

### Adding New Components

1. **Shared Components**: Add to `shared/ui/src/components/`
2. **App-specific Components**: Add to respective app's `src/components/`

### Adding Dependencies

```bash
# Add to specific workspace
npm install package-name --workspace=@koech-design-lab/canvas

# Add to root (dev dependencies)
npm install -D package-name
```

### Workspace Structure

Each app follows a consistent structure:
```
src/
├── components/
│   ├── common/         # Reusable components
│   ├── forms/          # Form components
│   ├── modals/         # Modal components
│   ├── navigation/     # Navigation components
│   └── layout/         # Layout components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
├── utils/              # Utility functions
└── types/              # TypeScript types
```

## 🎨 Design System

The shared design system provides:
- Consistent color palette
- Typography scale
- Spacing system
- Component library
- Theme configuration

## 📱 Applications

### Canvas App
- **Port**: 5173 (default Vite port)
- **Purpose**: Design creation and editing
- **Features**: Advanced canvas editing, element manipulation

### Studio App  
- **Port**: 5174 (when canvas is running)
- **Purpose**: Project and asset management
- **Features**: Dashboard, project organization, brand management

## 🔧 Configuration

### TypeScript
Each app has its own TypeScript configuration that extends shared base configs.

### Tailwind CSS
Shared Tailwind configuration with consistent design tokens.

### Vite
Each app uses Vite for development and building with optimized configurations.

## 📝 Contributing

1. Create feature branches for new development
2. Follow the established folder structure
3. Use shared components when possible
4. Add new shared components to the UI library
5. Update types in shared config when adding new interfaces

## 🚀 Deployment

Each application can be deployed independently:
- Canvas app: Production design editor
- Studio app: Management dashboard

Build artifacts are generated in each app's `dist/` directory.

---

**Built with ❤️ by the Koech Design Lab team**
