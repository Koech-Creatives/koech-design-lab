import { createServer } from 'http';
import { parse } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

interface RenderRequest {
  templateId: string;
  brand: {
    id: string;
    name: string;
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    fonts: {
      primary: string;
      secondary?: string;
    };
  };
  content: {
    [key: string]: string | number | boolean;
  };
  platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok';
}

interface RenderResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
  };
}

const PLATFORM_DIMENSIONS = {
  instagram: { width: 1080, height: 1350 },
  linkedin: { width: 1200, height: 627 },
  twitter: { width: 1600, height: 900 },
  tiktok: { width: 1080, height: 1920 },
};

// Load fonts (you'll need to add font files to your project)
const fontData = {
  inter: readFileSync(join(process.cwd(), 'fonts/Inter-Regular.ttf')),
  interBold: readFileSync(join(process.cwd(), 'fonts/Inter-Bold.ttf')),
};

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname } = parse(req.url || '', true);

  if (pathname === '/api/render' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const renderRequest: RenderRequest = JSON.parse(body);
          const result = await renderTemplate(renderRequest);
          
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error) {
          console.error('Render error:', error);
          const errorResponse: RenderResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown render error'
          };
          
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(500);
          res.end(JSON.stringify(errorResponse));
        }
      });
    } catch (error) {
      console.error('Request processing error:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

async function renderTemplate(request: RenderRequest): Promise<RenderResponse> {
  const { brand, content, platform } = request;
  const dimensions = PLATFORM_DIMENSIONS[platform];

  // Create React element for the template (simplified version)
  const element = React.createElement('div', {
    style: {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      backgroundColor: brand.colors.background || '#ffffff',
      fontFamily: brand.fonts.primary || 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      position: 'relative',
    }
  }, [
    // Brand Logo
    brand.logo && React.createElement('div', {
      style: {
        position: 'absolute',
        top: '40px',
        right: '40px',
        width: '60px',
        height: '60px',
      }
    }, React.createElement('img', {
      src: brand.logo,
      alt: brand.name,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }
    })),
    
    // Main Content
    React.createElement('div', {
      style: { textAlign: 'center', maxWidth: '80%' }
    }, [
      content.title && React.createElement('h1', {
        style: {
          fontSize: platform === 'tiktok' ? '72px' : '64px',
          fontWeight: '700',
          color: brand.colors.primary,
          marginBottom: '24px',
          lineHeight: '1.2',
        }
      }, content.title as string),
      
      content.subtitle && React.createElement('p', {
        style: {
          fontSize: platform === 'tiktok' ? '32px' : '28px',
          color: brand.colors.secondary || '#666666',
          lineHeight: '1.4',
          fontWeight: '400',
        }
      }, content.subtitle as string),
    ]),

    // Bottom Accent
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '8px',
        backgroundColor: brand.colors.accent || brand.colors.primary,
      }
    }),
  ]);

  // Convert React element to SVG using Satori
  const svg = await satori(element, {
    width: dimensions.width,
    height: dimensions.height,
    fonts: [
      {
        name: 'Inter',
        data: fontData.inter,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: fontData.interBold,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // Convert SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    background: 'rgba(238, 238, 238, .9)',
  });
  
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // In a real implementation, you would upload this to Supabase Storage
  // For now, we'll return a base64 data URL
  const base64Image = `data:image/png;base64,${pngBuffer.toString('base64')}`;

  return {
    success: true,
    imageUrl: base64Image,
    metadata: {
      width: dimensions.width,
      height: dimensions.height,
      fileSize: pngBuffer.length,
      format: 'png',
    },
  };
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`🎨 Render API running on port ${port}`);
});

export { server }; 