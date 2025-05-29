import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article';
  image?: string;
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  type = 'website',
  image,
  price,
  currency = 'USD',
  availability,
  structuredData
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (canonical) updateMetaTag('canonical', canonical, 'link', 'href');

    // Open Graph meta tags
    updateMetaTag('og:title', title, 'meta', 'property');
    updateMetaTag('og:description', description, 'meta', 'property');
    updateMetaTag('og:type', type, 'meta', 'property');
    updateMetaTag('og:site_name', 'Strongwill Sports', 'meta', 'property');
    if (image) updateMetaTag('og:image', image, 'meta', 'property');
    if (canonical) updateMetaTag('og:url', canonical, 'meta', 'property');

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image', 'meta', 'name');
    updateMetaTag('twitter:title', title, 'meta', 'name');
    updateMetaTag('twitter:description', description, 'meta', 'name');
    if (image) updateMetaTag('twitter:image', image, 'meta', 'name');

    // Product-specific structured data
    if (type === 'product' && price) {
      const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "availability": `https://schema.org/${availability || 'InStock'}`
        }
      };
      updateStructuredData('product-schema', productSchema);
    }

    // Custom structured data
    if (structuredData) {
      updateStructuredData('custom-schema', structuredData);
    }

    // Organization structured data
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Strongwill Sports",
      "url": window.location.origin,
      "logo": `${window.location.origin}/assets/STRONGWILLSPORTS-LOGO-WHITE.png`,
      "description": "Custom athletic apparel and team uniforms with advanced design tools"
    };
    updateStructuredData('organization-schema', organizationSchema);

  }, [title, description, keywords, canonical, type, image, price, currency, availability, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, tagType: 'meta' | 'link' = 'meta', attr: string = 'name') {
  let element = document.querySelector(`${tagType}[${attr}="${name}"]`);
  
  if (!element) {
    element = document.createElement(tagType);
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  
  if (tagType === 'meta') {
    element.setAttribute('content', content);
  } else if (tagType === 'link' && attr === 'href') {
    element.setAttribute('href', content);
    element.setAttribute('rel', name === 'canonical' ? 'canonical' : name);
  }
}

function updateStructuredData(id: string, data: object) {
  let script = document.getElementById(id);
  
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(data);
}