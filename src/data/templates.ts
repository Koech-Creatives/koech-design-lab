export const templateLibrary = {
  instagram: [
    {
      id: 'ig-minimal-quote',
      name: 'Minimal Quote',
      category: 'Quote',
      platform: 'instagram',
      format: { width: 1080, height: 1080 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1080 },
          style: { backgroundColor: '#f8fafc' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'quote',
          type: 'text',
          content: '"Your inspiring quote here"',
          position: { x: 150, y: 400 },
          size: { width: 780, height: 200 },
          style: { 
            fontSize: '42px', 
            fontWeight: 'bold', 
            color: '#1e293b',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          },
          zIndex: 2,
        },
        {
          id: 'author',
          type: 'text',
          content: '- Author Name',
          position: { x: 150, y: 650 },
          size: { width: 780, height: 60 },
          style: { 
            fontSize: '24px', 
            fontWeight: '400', 
            color: '#64748b',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          },
          zIndex: 3,
        },
      ],
    },
    {
      id: 'ig-product-showcase',
      name: 'Product Showcase',
      category: 'Product',
      platform: 'instagram',
      format: { width: 1080, height: 1350 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1350 },
          style: { backgroundColor: '#ffffff' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'product-image',
          type: 'image',
          content: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: { x: 140, y: 100 },
          size: { width: 800, height: 600 },
          style: { borderRadius: '16px' },
          zIndex: 2,
        },
        {
          id: 'title',
          type: 'text',
          content: 'Amazing Product',
          position: { x: 140, y: 750 },
          size: { width: 800, height: 80 },
          style: { 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            textAlign: 'center'
          },
          zIndex: 3,
        },
        {
          id: 'description',
          type: 'text',
          content: 'Discover the perfect solution for your needs',
          position: { x: 140, y: 850 },
          size: { width: 800, height: 60 },
          style: { 
            fontSize: '24px', 
            fontWeight: '400', 
            color: '#6b7280',
            textAlign: 'center'
          },
          zIndex: 4,
        },
      ],
    },
    {
      id: 'ig-story-template',
      name: 'Story Template',
      category: 'Story',
      platform: 'instagram',
      format: { width: 1080, height: 1920 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1920 },
          style: { backgroundColor: '#6366f1' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'main-text',
          type: 'text',
          content: 'Your Story Here',
          position: { x: 100, y: 800 },
          size: { width: 880, height: 200 },
          style: { 
            fontSize: '64px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 2,
        },
      ],
    },
    {
      id: 'ig-vertical-content',
      name: 'Vertical Content',
      category: 'Content',
      platform: 'instagram',
      format: { width: 1080, height: 1350 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1350 },
          style: { backgroundColor: '#ffffff' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'header-image',
          type: 'image',
          position: { x: 40, y: 40 },
          size: { width: 1000, height: 600 },
          style: { borderRadius: '16px' },
          zIndex: 2,
        },
        {
          id: 'title',
          type: 'text',
          content: 'Your Title Here',
          position: { x: 40, y: 680 },
          size: { width: 1000, height: 80 },
          style: { 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          },
          zIndex: 3,
        },
        {
          id: 'description',
          type: 'text',
          content: 'Add your description or content here. This template is perfect for long-form content, product showcases, or vertical stories.',
          position: { x: 40, y: 780 },
          size: { width: 1000, height: 100 },
          style: { 
            fontSize: '24px', 
            fontWeight: '400', 
            color: '#6b7280',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          },
          zIndex: 4,
        },
        {
          id: 'cta-button',
          type: 'rectangle',
          position: { x: 390, y: 920 },
          size: { width: 300, height: 60 },
          style: { 
            backgroundColor: '#ff4940',
            borderRadius: '12px'
          },
          zIndex: 5,
        },
        {
          id: 'cta-text',
          type: 'text',
          content: 'Learn More',
          position: { x: 390, y: 930 },
          size: { width: 300, height: 40 },
          style: { 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#ffffff',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          },
          zIndex: 6,
        }
      ],
    },
  ],
  linkedin: [
    {
      id: 'li-professional-post',
      name: 'Professional Post',
      category: 'Business',
      platform: 'linkedin',
      format: { width: 1200, height: 627 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1200, height: 627 },
          style: { backgroundColor: '#0077b5' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'title',
          type: 'text',
          content: 'Professional Insight',
          position: { x: 100, y: 200 },
          size: { width: 1000, height: 100 },
          style: { 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 2,
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Share your expertise with the world',
          position: { x: 100, y: 320 },
          size: { width: 1000, height: 60 },
          style: { 
            fontSize: '24px', 
            fontWeight: '400', 
            color: '#e5e7eb',
            textAlign: 'center'
          },
          zIndex: 3,
        },
      ],
    },
    {
      id: 'li-tips-carousel',
      name: 'Tips Carousel',
      category: 'Educational',
      platform: 'linkedin',
      format: { width: 1080, height: 1080 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1080 },
          style: { backgroundColor: '#f3f4f6' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'tip-number',
          type: 'text',
          content: 'TIP #1',
          position: { x: 100, y: 150 },
          size: { width: 880, height: 80 },
          style: { 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#0077b5',
            textAlign: 'center'
          },
          zIndex: 2,
        },
        {
          id: 'tip-content',
          type: 'text',
          content: 'Your valuable tip goes here',
          position: { x: 100, y: 400 },
          size: { width: 880, height: 200 },
          style: { 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#1f2937',
            textAlign: 'center'
          },
          zIndex: 3,
        },
      ],
    },
  ],
  twitter: [
    {
      id: 'tw-announcement',
      name: 'Announcement',
      category: 'News',
      platform: 'twitter',
      format: { width: 1200, height: 675 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1200, height: 675 },
          style: { backgroundColor: '#1da1f2' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'announcement',
          type: 'text',
          content: 'Big Announcement!',
          position: { x: 100, y: 250 },
          size: { width: 1000, height: 120 },
          style: { 
            fontSize: '56px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 2,
        },
      ],
    },
    {
      id: 'tw-meme-template',
      name: 'Meme Template',
      category: 'Fun',
      platform: 'twitter',
      format: { width: 1080, height: 1080 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1080 },
          style: { backgroundColor: '#000000' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'meme-text',
          type: 'text',
          content: 'When you finally...',
          position: { x: 100, y: 450 },
          size: { width: 880, height: 180 },
          style: { 
            fontSize: '42px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 2,
        },
      ],
    },
  ],
  tiktok: [
    {
      id: 'tt-vertical-promo',
      name: 'Vertical Promo',
      category: 'Promotion',
      platform: 'tiktok',
      format: { width: 1080, height: 1920 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1920 },
          style: { backgroundColor: '#ff0050' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'promo-text',
          type: 'text',
          content: 'Don\'t Miss Out!',
          position: { x: 100, y: 800 },
          size: { width: 880, height: 200 },
          style: { 
            fontSize: '64px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 2,
        },
        {
          id: 'cta',
          type: 'text',
          content: 'Swipe Up Now',
          position: { x: 100, y: 1100 },
          size: { width: 880, height: 100 },
          style: { 
            fontSize: '36px', 
            fontWeight: '600', 
            color: '#ffffff',
            textAlign: 'center'
          },
          zIndex: 3,
        },
      ],
    },
    {
      id: 'tt-tutorial-cover',
      name: 'Tutorial Cover',
      category: 'Educational',
      platform: 'tiktok',
      format: { width: 1080, height: 1920 },
      elements: [
        {
          id: 'bg',
          type: 'rectangle',
          position: { x: 0, y: 0 },
          size: { width: 1080, height: 1920 },
          style: { backgroundColor: '#25f4ee' },
          locked: true,
          zIndex: 1,
        },
        {
          id: 'tutorial-title',
          type: 'text',
          content: 'How To...',
          position: { x: 100, y: 700 },
          size: { width: 880, height: 150 },
          style: { 
            fontSize: '56px', 
            fontWeight: 'bold', 
            color: '#000000',
            textAlign: 'center'
          },
          zIndex: 2,
        },
        {
          id: 'step-count',
          type: 'text',
          content: 'In 3 Easy Steps',
          position: { x: 100, y: 900 },
          size: { width: 880, height: 80 },
          style: { 
            fontSize: '32px', 
            fontWeight: '500', 
            color: '#1f2937',
            textAlign: 'center'
          },
          zIndex: 3,
        },
      ],
    },
  ],
};