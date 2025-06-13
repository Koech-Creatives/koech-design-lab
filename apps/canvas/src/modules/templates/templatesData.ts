export interface Template {
  id: string;
  name: string;
  previewImage: string;
  description: string;
  baseHTML: string;
  defaultStyles: {
    font: string;
    colors: {
      primary: string;
      background: string;
      text: string;
      accent: string;
    };
    logoUrl: string;
  };
  category: string;
  platforms: string[];
}

export const templatesData: Template[] = [
  {
    id: 'modern-quote',
    name: 'Modern Quote Card',
    previewImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    description: 'Clean and modern quote design perfect for social media inspiration posts',
    category: 'Quote',
    platforms: ['Instagram', 'LinkedIn', 'Twitter'],
    baseHTML: `
      <div class="quote-container">
        <div class="quote-mark">"</div>
        <h1 class="quote-text">{{quoteText}}</h1>
        <div class="author-section">
          <div class="author-name">{{authorName}}</div>
          <div class="author-title">{{authorTitle}}</div>
        </div>
        <div class="brand-logo">
          <img src="{{logoUrl}}" alt="Brand Logo" />
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Inter, sans-serif',
      colors: {
        primary: '#3B82F6',
        background: '#F8FAFC',
        text: '#1E293B',
        accent: '#EF4444'
      },
      logoUrl: 'https://placehold.co/400x400/3B82F6/FFFFFF/png?text=Logo&font=roboto'
    }
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    previewImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Professional product display template with clean layout and call-to-action',
    category: 'Product',
    platforms: ['Instagram', 'Facebook', 'LinkedIn'],
    baseHTML: `
      <div class="product-container">
        <div class="product-image-section">
          <img src="{{productImage}}" alt="Product" class="product-image" />
        </div>
        <div class="product-content">
          <h1 class="product-title">{{productTitle}}</h1>
          <p class="product-description">{{productDescription}}</p>
          <div class="product-price">{{productPrice}}</div>
          <button class="cta-button">{{ctaText}}</button>
        </div>
        <div class="brand-watermark">
          <img src="{{logoUrl}}" alt="Brand" />
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Poppins, sans-serif',
      colors: {
        primary: '#10B981',
        background: '#FFFFFF',
        text: '#374151',
        accent: '#F59E0B'
      },
      logoUrl: 'https://placehold.co/400x400/10B981/FFFFFF/png?text=Logo&font=roboto'
    }
  },
  {
    id: 'event-announcement',
    name: 'Event Announcement',
    previewImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    description: 'Eye-catching event announcement with date, time, and location details',
    category: 'Event',
    platforms: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'],
    baseHTML: `
      <div class="event-container">
        <div class="event-header">
          <div class="event-badge">{{eventType}}</div>
          <h1 class="event-title">{{eventTitle}}</h1>
        </div>
        <div class="event-details">
          <div class="event-date">
            <span class="label">Date:</span>
            <span class="value">{{eventDate}}</span>
          </div>
          <div class="event-time">
            <span class="label">Time:</span>
            <span class="value">{{eventTime}}</span>
          </div>
          <div class="event-location">
            <span class="label">Location:</span>
            <span class="value">{{eventLocation}}</span>
          </div>
        </div>
        <div class="event-cta">
          <button class="register-button">{{ctaText}}</button>
        </div>
        <div class="brand-footer">
          <img src="{{logoUrl}}" alt="Brand" />
          <span class="brand-name">{{brandName}}</span>
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Roboto, sans-serif',
      colors: {
        primary: '#8B5CF6',
        background: '#1F2937',
        text: '#F9FAFB',
        accent: '#F472B6'
      },
      logoUrl: 'https://placehold.co/400x400/8B5CF6/FFFFFF/png?text=Logo&font=roboto'
    }
  },
  {
    id: 'tips-infographic',
    name: 'Tips Infographic',
    previewImage: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop',
    description: 'Educational infographic template perfect for sharing tips and insights',
    category: 'Educational',
    platforms: ['Instagram', 'LinkedIn', 'Pinterest'],
    baseHTML: `
      <div class="tips-container">
        <div class="tips-header">
          <div class="tip-number">{{tipNumber}}</div>
          <h1 class="tips-title">{{tipsTitle}}</h1>
        </div>
        <div class="tips-content">
          <div class="tip-item">
            <div class="tip-icon">💡</div>
            <div class="tip-text">{{tip1}}</div>
          </div>
          <div class="tip-item">
            <div class="tip-icon">🎯</div>
            <div class="tip-text">{{tip2}}</div>
          </div>
          <div class="tip-item">
            <div class="tip-icon">🚀</div>
            <div class="tip-text">{{tip3}}</div>
          </div>
        </div>
        <div class="tips-footer">
          <img src="{{logoUrl}}" alt="Brand" />
          <div class="brand-info">
            <div class="brand-name">{{brandName}}</div>
            <div class="brand-tagline">{{brandTagline}}</div>
          </div>
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Open Sans, sans-serif',
      colors: {
        primary: '#06B6D4',
        background: '#ECFDF5',
        text: '#065F46',
        accent: '#F97316'
      },
      logoUrl: 'https://placehold.co/400x400/06B6D4/FFFFFF/png?text=Logo&font=roboto'
    }
  },
  {
    id: 'testimonial-card',
    name: 'Customer Testimonial',
    previewImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
    description: 'Professional testimonial card to showcase customer feedback and reviews',
    category: 'Testimonial',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    baseHTML: `
      <div class="testimonial-container">
        <div class="testimonial-content">
          <div class="quote-mark">"</div>
          <p class="testimonial-text">{{testimonialText}}</p>
        </div>
        <div class="customer-info">
          <div class="customer-avatar">
            <img src="{{customerImage}}" alt="Customer" />
          </div>
          <div class="customer-details">
            <div class="customer-name">{{customerName}}</div>
            <div class="customer-title">{{customerTitle}}</div>
            <div class="customer-company">{{customerCompany}}</div>
          </div>
        </div>
        <div class="rating-section">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <div class="rating-text">{{ratingText}}</div>
        </div>
        <div class="brand-signature">
          <img src="{{logoUrl}}" alt="Brand" />
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Lato, sans-serif',
      colors: {
        primary: '#DC2626',
        background: '#FEF2F2',
        text: '#7F1D1D',
        accent: '#FBBF24'
      },
      logoUrl: 'https://placehold.co/400x400/DC2626/FFFFFF/png?text=Logo&font=roboto'
    }
  },
  {
    id: 'business-automation-post',
    name: 'Business Automation Post',
    previewImage: 'https://placehold.co/400x300/1E3A8A/FFFFFF/png?text=Business+Post&font=roboto',
    description: 'Modern business automation social media post perfect for startups and tech companies',
    category: 'Business',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    baseHTML: `
      <div class="business-post-container">
        <div class="brand-header">
          <div class="brand-logo-section">
            <img src="{{logoUrl}}" alt="Brand Logo" class="brand-logo" />
          </div>
          <div class="brand-info">
            <div class="brand-name">{{brandName}}</div>
            <div class="brand-handle">{{brandHandle}}</div>
          </div>
        </div>
        
        <div class="main-content">
          <h1 class="main-headline">{{mainHeadline}}</h1>
          <h2 class="sub-headline">{{subHeadline}}</h2>
          <h3 class="call-to-action">{{callToAction}}</h3>
          
          <div class="highlight-badge">{{highlightText}}</div>
          
          <p class="description">{{description}}</p>
          
          <div class="large-text-overlay">{{largeTextOverlay}}</div>
        </div>
        
        <div class="footer-section">
          <div class="swipe-indicator">{{swipeText}}</div>
        </div>
      </div>
    `,
    defaultStyles: {
      font: 'Inter, sans-serif',
      colors: {
        primary: '#EF4444', // Red accent
        background: '#1E3A8A', // Dark blue
        text: '#FFFFFF', // White text
        accent: '#F87171' // Light red
      },
      logoUrl: 'https://placehold.co/400x400/FFFFFF/1E3A8A/png?text=Logo&font=roboto'
    }
  }
];

// TODO: Replace with API call to fetch templates from Directus/Supabase
export const getTemplateById = (id: string): Template | undefined => {
  return templatesData.find(template => template.id === id);
};

// TODO: Add filtering and search functionality for templates
export const getTemplatesByCategory = (category: string): Template[] => {
  return templatesData.filter(template => template.category === category);
};

// TODO: Add user-specific template recommendations based on usage history
export const getRecommendedTemplates = (userId?: string): Template[] => {
  // For now, return first 3 templates as recommendations
  return templatesData.slice(0, 3);
}; 