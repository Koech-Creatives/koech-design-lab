export interface ReactTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  defaultProps: Record<string, any>;
  preview: string;
}

export const reactTemplates: ReactTemplate[] = [
  {
    id: 'modern-quote-react',
    name: 'Modern Quote Card',
    description: 'A clean, modern quote card with customizable colors and typography',
    category: 'Social Media',
    code: `function QuoteCard({ 
  quote = "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  author = "Winston Churchill",
  authorTitle = "Former Prime Minister",
  primaryColor = "#3B82F6",
  backgroundColor = "#FFFFFF",
  textColor = "#1F2937",
  logoUrl = ""
}) {
  return (
    <div style={{
      width: '600px',
      height: '600px',
      backgroundColor: backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* Quote Mark */}
      <div style={{
        fontSize: '120px',
        color: primaryColor,
        opacity: 0.3,
        lineHeight: 1,
        marginBottom: '-20px'
      }}>
        "
      </div>
      
      {/* Quote Text */}
      <p style={{
        fontSize: '32px',
        color: textColor,
        textAlign: 'center',
        margin: '20px 0',
        lineHeight: 1.4,
        fontWeight: '500'
      }}>
        {quote}
      </p>
      
      {/* Author Section */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: primaryColor
        }}>
          {author}
        </div>
        <div style={{
          fontSize: '14px',
          color: textColor,
          opacity: 0.7,
          marginTop: '5px'
        }}>
          {authorTitle}
        </div>
      </div>
      
      {/* Logo */}
      {logoUrl && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px'
        }}>
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%'
            }}
          />
        </div>
      )}
    </div>
  );
}`,
    defaultProps: {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      authorTitle: "Former Prime Minister",
      primaryColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      logoUrl: ""
    },
    preview: '/api/placeholder/300/300'
  },
  
  {
    id: 'product-showcase-react',
    name: 'Product Showcase',
    description: 'A modern product showcase card with image, title, description and CTA',
    category: 'Marketing',
    code: `function ProductShowcase({
  productTitle = "Amazing Product",
  productDescription = "Discover the perfect solution for your needs with our innovative design.",
  productPrice = "$99.99",
  ctaText = "Learn More",
  productImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  primaryColor = "#10B981",
  backgroundColor = "#F9FAFB",
  textColor = "#111827",
  logoUrl = ""
}) {
  return (
    <div style={{
      width: '600px',
      height: '400px',
      backgroundColor: backgroundColor,
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Product Image */}
      <div style={{
        width: '50%',
        height: '100%',
        backgroundImage: \`url(\${productImage})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      {/* Content */}
      <div style={{
        width: '50%',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: textColor,
          margin: '0 0 16px 0',
          lineHeight: 1.2
        }}>
          {productTitle}
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: textColor,
          opacity: 0.8,
          margin: '0 0 20px 0',
          lineHeight: 1.5
        }}>
          {productDescription}
        </p>
        
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: primaryColor,
          margin: '0 0 24px 0'
        }}>
          {productPrice}
        </div>
        
        <button style={{
          backgroundColor: primaryColor,
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}>
          {ctaText}
        </button>
        
        {/* Logo */}
        {logoUrl && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}`,
    defaultProps: {
      productTitle: "Amazing Product",
      productDescription: "Discover the perfect solution for your needs with our innovative design.",
      productPrice: "$99.99",
      ctaText: "Learn More",
      productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      primaryColor: "#10B981",
      backgroundColor: "#F9FAFB",
      textColor: "#111827",
      logoUrl: ""
    },
    preview: '/api/placeholder/300/200'
  },
  
  {
    id: 'event-announcement-react',
    name: 'Event Announcement',
    description: 'A vibrant event announcement card with date, time, and location',
    category: 'Events',
    code: `function EventAnnouncement({
  eventTitle = "Annual Conference 2024",
  eventType = "CONFERENCE",
  eventDate = "March 15, 2024",
  eventTime = "9:00 AM - 5:00 PM",
  eventLocation = "Convention Center",
  primaryColor = "#8B5CF6",
  backgroundColor = "#FFFFFF",
  accentColor = "#F3F4F6",
  textColor = "#1F2937",
  logoUrl = ""
}) {
  return (
    <div style={{
      width: '600px',
      height: '400px',
      backgroundColor: backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: primaryColor,
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '2px',
          opacity: 0.9
        }}>
          {eventType}
        </div>
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px'
            }}
          />
        )}
      </div>
      
      {/* Content */}
      <div style={{
        flex: 1,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: textColor,
          margin: '0 0 30px 0',
          lineHeight: 1.2
        }}>
          {eventTitle}
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            color: textColor
          }}>
            <div style={{
              width: '4px',
              height: '16px',
              backgroundColor: primaryColor,
              marginRight: '12px'
            }} />
            <strong>Date:</strong>&nbsp;{eventDate}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            color: textColor
          }}>
            <div style={{
              width: '4px',
              height: '16px',
              backgroundColor: primaryColor,
              marginRight: '12px'
            }} />
            <strong>Time:</strong>&nbsp;{eventTime}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            color: textColor
          }}>
            <div style={{
              width: '4px',
              height: '16px',
              backgroundColor: primaryColor,
              marginRight: '12px'
            }} />
            <strong>Location:</strong>&nbsp;{eventLocation}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        backgroundColor: primaryColor,
        opacity: 0.1,
        borderRadius: '50%'
      }} />
    </div>
  );
}`,
    defaultProps: {
      eventTitle: "Annual Conference 2024",
      eventType: "CONFERENCE",
      eventDate: "March 15, 2024",
      eventTime: "9:00 AM - 5:00 PM",
      eventLocation: "Convention Center",
      primaryColor: "#8B5CF6",
      backgroundColor: "#FFFFFF",
      accentColor: "#F3F4F6",
      textColor: "#1F2937",
      logoUrl: ""
    },
    preview: '/api/placeholder/300/200'
  },
  
  {
    id: 'social-media-post-react',
    name: 'Social Media Post',
    description: 'A versatile social media post template with image and text overlay',
    category: 'Social Media',
    code: `function SocialMediaPost({
  title = "Follow Your Dreams",
  subtitle = "Every great journey begins with a single step",
  backgroundImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
  overlayColor = "#000000",
  overlayOpacity = "0.4",
  textColor = "#FFFFFF",
  primaryColor = "#FF6B6B",
  logoUrl = ""
}) {
  return (
    <div style={{
      width: '600px',
      height: '600px',
      position: 'relative',
      backgroundImage: \`url(\${backgroundImage})\`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayColor,
        opacity: overlayOpacity
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '60px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: textColor,
          margin: '0 0 20px 0',
          lineHeight: 1.2,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {title}
        </h1>
        
        <div style={{
          width: '60px',
          height: '4px',
          backgroundColor: primaryColor,
          margin: '0 auto 20px auto'
        }} />
        
        <p style={{
          fontSize: '20px',
          color: textColor,
          margin: 0,
          lineHeight: 1.4,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          opacity: 0.9
        }}>
          {subtitle}
        </p>
      </div>
      
      {/* Logo */}
      {logoUrl && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          zIndex: 1
        }}>
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      )}
    </div>
  );
}`,
    defaultProps: {
      title: "Follow Your Dreams",
      subtitle: "Every great journey begins with a single step",
      backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      overlayColor: "#000000",
      overlayOpacity: "0.4",
      textColor: "#FFFFFF",
      primaryColor: "#FF6B6B",
      logoUrl: ""
    },
    preview: '/api/placeholder/300/300'
  }
];

export function getReactTemplateById(id: string): ReactTemplate | undefined {
  return reactTemplates.find(template => template.id === id);
}

export function getReactTemplatesByCategory(category: string): ReactTemplate[] {
  return reactTemplates.filter(template => template.category === category);
} 