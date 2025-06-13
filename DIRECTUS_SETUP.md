# Directus Backend Setup Instructions

This document provides instructions for setting up the Directus backend to work with your design app.

## Directus Collections Setup

You need to create the following collections in your Directus instance at `https://koech-labs.onrender.com/`:

### 1. Brands Collection

Create a collection named `brands` with the following fields:

- `id` (Primary Key, UUID, Auto-generated)
- `user_id` (UUID, Required) - References the user who owns this brand
- `name` (String, Required) - Brand name
- `colors` (JSON) - Array of color objects with `name` and `hex` properties
- `fonts` (JSON) - Array of font objects with `name`, `url`, and `family` properties
- `logo` (String, Optional) - URL to the brand logo
- `date_created` (DateTime, Auto-generated)
- `date_updated` (DateTime, Auto-updated)

### 2. Projects Collection

Create a collection named `projects` with the following fields:

- `id` (Primary Key, UUID, Auto-generated)
- `user_id` (UUID, Required) - References the user who owns this project
- `brand_id` (UUID, Optional) - References the associated brand
- `name` (String, Required) - Project name
- `platform` (String, Required) - Target platform (instagram, linkedin, twitter, tiktok)
- `format` (JSON) - Format object with `name`, `width`, and `height` properties
- `pages` (JSON) - Array of page objects with `id`, `name`, and `elements` properties
- `current_page_id` (String) - ID of the currently active page
- `thumbnail` (String, Optional) - URL to project thumbnail
- `date_created` (DateTime, Auto-generated)
- `date_updated` (DateTime, Auto-updated)

## User Roles and Permissions

### 1. Create a User Role

1. Go to Settings > Roles & Permissions
2. Create a new role called `user`
3. Set the following permissions:

#### For `brands` collection:
- **Create**: Allow (Own items only)
- **Read**: Allow (Own items only)
- **Update**: Allow (Own items only)
- **Delete**: Allow (Own items only)

#### For `projects` collection:
- **Create**: Allow (Own items only)
- **Read**: Allow (Own items only)
- **Update**: Allow (Own items only)
- **Delete**: Allow (Own items only)

#### For `directus_users` collection:
- **Read**: Allow (Own items only)
- **Update**: Allow (Own items only)

### 2. User Registration

Make sure user registration is enabled in your Directus settings:

1. Go to Settings > Project Settings
2. Enable "Public Registration"
3. Set the default role to `user`

## API Configuration

### 1. CORS Settings

Ensure your Directus instance allows requests from your frontend domain:

1. Go to Settings > Project Settings
2. Add your frontend domain to the CORS allowed origins
3. For development, you can add `http://localhost:5173` (or your dev server port)

### 2. Authentication

The app uses Directus's built-in authentication system with JWT tokens. No additional configuration is needed.

## Environment Variables

Make sure your Directus instance has the following environment variables configured:

```env
# Database connection
DB_CLIENT=pg
DB_HOST=your-database-host
DB_PORT=5432
DB_DATABASE=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# Security
KEY=your-secret-key
SECRET=your-secret-key

# CORS
CORS_ENABLED=true
CORS_ORIGIN=true

# Public registration
AUTH_PROVIDERS=default
```

## Testing the Integration

1. Start your frontend development server
2. Try to register a new user account
3. Create a new project and add some brand colors
4. Save the project and verify data is stored in Directus
5. Refresh the page and verify data persists

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your frontend domain is added to CORS allowed origins
2. **Authentication Errors**: Verify the user role has proper permissions
3. **Collection Not Found**: Ensure all collections are created with the correct field names
4. **Permission Denied**: Check that the user role has the necessary permissions for each collection

### Debug Mode:

To enable debug mode in your frontend, add this to your browser console:

```javascript
localStorage.setItem('debug', 'directus:*');
```

This will show detailed logs of all Directus API calls.

## Data Structure Examples

### Brand Object:
```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "name": "My Brand",
  "colors": [
    { "name": "Primary", "hex": "#ff4940" },
    { "name": "Secondary", "hex": "#003a63" }
  ],
  "fonts": [
    { "name": "Inter", "url": "", "family": "Inter, sans-serif" }
  ],
  "logo": "https://example.com/logo.png"
}
```

### Project Object:
```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "brand_id": "brand-uuid-here",
  "name": "Instagram Post",
  "platform": "instagram",
  "format": {
    "name": "Square 1080x1080",
    "width": 1080,
    "height": 1080
  },
  "pages": [
    {
      "id": "page-1",
      "name": "Page 1",
      "elements": []
    }
  ],
  "current_page_id": "page-1"
}
```

VITE_SUPABASE_URL=https://rwuxzgvpcnggqelrjsqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dXh6Z3ZwY25nZ3FlbHJqc3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NzI5NTQsImV4cCI6MjA1MzA0ODk1NH0.-sya8LykLAe-SrMdSH7IVp49sXbQ-Hun4L_-DE_-MiQ