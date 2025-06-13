export interface HTMLTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  platforms: string[];
  thumbnail: string;
  html: string;
  css: string;
  fields: TemplateField[];
  dimensions: {
    [platform: string]: {
      width: number;
      height: number;
    };
  };
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'image' | 'color' | 'select';
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export const htmlTemplates: HTMLTemplate[] = [
  {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    category: 'Quote',
    description: 'Clean and elegant quote design with customizable text and colors',
    platforms: ['instagram', 'linkedin', 'twitter'],
    thumbnail: '/templates/minimal-quote-thumb.jpg',
    html: `
      <div class="quote-container">
        <div class="quote-mark">"</div>
        <h1 class="quote-text">{{quote}}</h1>
        <div class="author">{{author}}</div>
        <div class="brand-logo">
          <img src="{{logo}}" alt="Brand Logo" />
        </div>
      </div>
    `,
    css: `
      .quote-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 60px;
        background: linear-gradient(135deg, {{primaryColor}}, {{secondaryColor}});
        font-family: {{fontHeading}}, serif;
        position: relative;
        box-sizing: border-box;
      }
      
      .quote-mark {
        font-size: 120px;
        color: rgba(255, 255, 255, 0.2);
        line-height: 1;
        margin-bottom: -20px;
        font-family: Georgia, serif;
      }
      
      .quote-text {
        font-size: 42px;
        font-weight: 600;
        color: white;
        text-align: center;
        line-height: 1.3;
        margin: 0 0 40px 0;
        max-width: 80%;
      }
      
      .author {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.9);
        font-style: italic;
        margin-bottom: 40px;
      }
      
      .brand-logo {
        position: absolute;
        bottom: 30px;
        right: 30px;
      }
      
      .brand-logo img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    `,
    fields: [
      {
        id: 'quote',
        label: 'Quote Text',
        type: 'text',
        placeholder: 'Enter your inspiring quote...',
        defaultValue: 'Success is not final, failure is not fatal: it is the courage to continue that counts.'
      },
      {
        id: 'author',
        label: 'Author',
        type: 'text',
        placeholder: 'Author name',
        defaultValue: '- Winston Churchill'
      }
    ],
    dimensions: {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 627 },
      twitter: { width: 1200, height: 675 }
    }
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    category: 'Product',
    description: 'Professional product presentation with customizable background and text',
    platforms: ['instagram', 'linkedin', 'facebook'],
    thumbnail: '/templates/product-showcase-thumb.jpg',
    html: `
      <div class="product-container">
        <div class="product-image">
          <img src="{{productImage}}" alt="Product" />
        </div>
        <div class="content-section">
          <h1 class="product-title">{{title}}</h1>
          <p class="product-description">{{description}}</p>
          <div class="cta-button">{{ctaText}}</div>
        </div>
        <div class="brand-logo">
          <img src="{{logo}}" alt="Brand Logo" />
        </div>
      </div>
    `,
    css: `
      .product-container {
        width: 100%;
        height: 100%;
        display: flex;
        background: {{backgroundColor}};
        font-family: {{fontBody}}, sans-serif;
        position: relative;
        box-sizing: border-box;
      }
      
      .product-image {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
      }
      
      .product-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 12px;
      }
      
      .content-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 60px 40px;
        color: {{textColor}};
      }
      
      .product-title {
        font-size: 48px;
        font-weight: bold;
        margin: 0 0 20px 0;
        font-family: {{fontHeading}}, sans-serif;
        color: {{primaryColor}};
      }
      
      .product-description {
        font-size: 20px;
        line-height: 1.6;
        margin: 0 0 30px 0;
        opacity: 0.9;
      }
      
      .cta-button {
        display: inline-block;
        background: {{primaryColor}};
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
        max-width: 200px;
      }
      
      .brand-logo {
        position: absolute;
        top: 30px;
        right: 30px;
      }
      
      .brand-logo img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
    `,
    fields: [
      {
        id: 'productImage',
        label: 'Product Image',
        type: 'image',
        defaultValue: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: 'title',
        label: 'Product Title',
        type: 'text',
        placeholder: 'Enter product name...',
        defaultValue: 'Amazing Product'
      },
      {
        id: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'Describe your product...',
        defaultValue: 'Discover the perfect solution for your needs with our innovative product design.'
      },
      {
        id: 'ctaText',
        label: 'Call to Action',
        type: 'text',
        placeholder: 'Button text...',
        defaultValue: 'Learn More'
      },
      {
        id: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        id: 'textColor',
        label: 'Text Color',
        type: 'color',
        defaultValue: '#333333'
      }
    ],
    dimensions: {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 627 },
      facebook: { width: 1200, height: 630 }
    }
  },
  {
    id: 'announcement',
    name: 'Announcement',
    category: 'Marketing',
    description: 'Eye-catching announcement design for important updates and news',
    platforms: ['instagram', 'linkedin', 'twitter', 'facebook'],
    thumbnail: '/templates/announcement-thumb.jpg',
    html: `
      <div class="announcement-container">
        <div class="announcement-badge">{{badge}}</div>
        <h1 class="announcement-title">{{title}}</h1>
        <p class="announcement-subtitle">{{subtitle}}</p>
        <div class="announcement-details">{{details}}</div>
        <div class="brand-section">
          <img src="{{logo}}" alt="Brand Logo" class="brand-logo" />
          <div class="brand-name">{{brandName}}</div>
        </div>
      </div>
    `,
    css: `
      .announcement-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 60px;
        background: linear-gradient(45deg, {{primaryColor}}, {{secondaryColor}});
        font-family: {{fontBody}}, sans-serif;
        text-align: center;
        position: relative;
        box-sizing: border-box;
      }
      
      .announcement-badge {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 24px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 30px;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }
      
      .announcement-title {
        font-size: 56px;
        font-weight: bold;
        color: white;
        margin: 0 0 20px 0;
        font-family: {{fontHeading}}, sans-serif;
        line-height: 1.1;
      }
      
      .announcement-subtitle {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0 0 30px 0;
        line-height: 1.4;
      }
      
      .announcement-details {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 40px 0;
        max-width: 80%;
      }
      
      .brand-section {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .brand-logo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .brand-name {
        color: white;
        font-size: 18px;
        font-weight: 600;
      }
    `,
    fields: [
      {
        id: 'badge',
        label: 'Badge Text',
        type: 'text',
        placeholder: 'e.g., NEW, UPDATE, ANNOUNCEMENT',
        defaultValue: 'ANNOUNCEMENT'
      },
      {
        id: 'title',
        label: 'Main Title',
        type: 'text',
        placeholder: 'Your announcement title...',
        defaultValue: 'Big News!'
      },
      {
        id: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'Supporting text...',
        defaultValue: 'Something exciting is coming your way'
      },
      {
        id: 'details',
        label: 'Details',
        type: 'text',
        placeholder: 'Additional information...',
        defaultValue: 'Stay tuned for more updates and exclusive content.'
      },
      {
        id: 'brandName',
        label: 'Brand Name',
        type: 'text',
        placeholder: 'Your brand name...',
        defaultValue: 'Your Brand'
      }
    ],
    dimensions: {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 627 },
      twitter: { width: 1200, height: 675 },
      facebook: { width: 1200, height: 630 }
    }
  },
  {
    id: 'tips-carousel',
    name: 'Tips Carousel',
    category: 'Educational',
    description: 'Educational content design perfect for sharing tips and insights',
    platforms: ['instagram', 'linkedin'],
    thumbnail: '/templates/tips-carousel-thumb.jpg',
    html: `
      <div class="tips-container">
        <div class="tips-header">
          <div class="tips-number">{{tipNumber}}</div>
          <div class="tips-category">{{category}}</div>
        </div>
        <h1 class="tips-title">{{title}}</h1>
        <div class="tips-content">{{content}}</div>
        <div class="tips-footer">
          <img src="{{logo}}" alt="Brand Logo" class="brand-logo" />
          <div class="brand-info">
            <div class="brand-name">{{brandName}}</div>
            <div class="brand-tagline">{{tagline}}</div>
          </div>
        </div>
      </div>
    `,
    css: `
      .tips-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 50px;
        background: {{backgroundColor}};
        font-family: {{fontBody}}, sans-serif;
        position: relative;
        box-sizing: border-box;
      }
      
      .tips-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 40px;
      }
      
      .tips-number {
        width: 60px;
        height: 60px;
        background: {{primaryColor}};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
      }
      
      .tips-category {
        background: rgba({{primaryColorRGB}}, 0.1);
        color: {{primaryColor}};
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .tips-title {
        font-size: 42px;
        font-weight: bold;
        color: {{textColor}};
        margin: 0 0 30px 0;
        font-family: {{fontHeading}}, sans-serif;
        line-height: 1.2;
      }
      
      .tips-content {
        font-size: 20px;
        color: {{textColor}};
        line-height: 1.6;
        flex: 1;
        margin-bottom: 40px;
      }
      
      .tips-footer {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-top: 20px;
        border-top: 2px solid rgba({{primaryColorRGB}}, 0.2);
      }
      
      .brand-logo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .brand-name {
        font-size: 18px;
        font-weight: 600;
        color: {{textColor}};
        margin-bottom: 4px;
      }
      
      .brand-tagline {
        font-size: 14px;
        color: rgba({{textColorRGB}}, 0.7);
      }
    `,
    fields: [
      {
        id: 'tipNumber',
        label: 'Tip Number',
        type: 'text',
        placeholder: '1, 2, 3...',
        defaultValue: '1'
      },
      {
        id: 'category',
        label: 'Category',
        type: 'text',
        placeholder: 'e.g., DESIGN TIP, BUSINESS TIP',
        defaultValue: 'PRO TIP'
      },
      {
        id: 'title',
        label: 'Tip Title',
        type: 'text',
        placeholder: 'Your tip title...',
        defaultValue: 'Master This Essential Skill'
      },
      {
        id: 'content',
        label: 'Tip Content',
        type: 'text',
        placeholder: 'Explain your tip in detail...',
        defaultValue: 'Here\'s a valuable insight that can transform your approach and help you achieve better results in your work.'
      },
      {
        id: 'brandName',
        label: 'Brand Name',
        type: 'text',
        placeholder: 'Your brand name...',
        defaultValue: 'Your Brand'
      },
      {
        id: 'tagline',
        label: 'Brand Tagline',
        type: 'text',
        placeholder: 'Your tagline...',
        defaultValue: 'Expert insights & tips'
      },
      {
        id: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        id: 'textColor',
        label: 'Text Color',
        type: 'color',
        defaultValue: '#333333'
      }
    ],
    dimensions: {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 627 }
    }
  }
];

// Helper function to get templates by platform
export function getTemplatesByPlatform(platform: string): HTMLTemplate[] {
  return htmlTemplates.filter(template => 
    template.platforms.includes(platform)
  );
}

// Helper function to get template by ID
export function getTemplateById(id: string): HTMLTemplate | undefined {
  return htmlTemplates.find(template => template.id === id);
} 