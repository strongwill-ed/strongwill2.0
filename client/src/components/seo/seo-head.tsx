import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

export default function SEOHead({
  title = "Strongwill Sports - Premium Custom Athletic Apparel",
  description = "Professional custom wrestling gear and athletic apparel. Design your own singlets, team uniforms, and sports equipment with our advanced customization tools.",
  keywords = "custom wrestling gear, athletic apparel, team uniforms, sports equipment, wrestling singlets",
  image = "/images/og-image.jpg",
  url = window.location.href,
  type = "website",
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:url', url);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:site_name', 'Strongwill Sports');
    
    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', title);
    updateMetaName('twitter:description', description);
    updateMetaName('twitter:image', image);
    
    // Additional SEO tags
    updateMetaName('robots', 'index, follow');
    updateMetaName('author', 'Strongwill Sports');
    updateMetaName('viewport', 'width=device-width, initial-scale=1.0');
    
    // Structured data (JSON-LD)
    if (structuredData) {
      updateStructuredData(structuredData);
    }
    
  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateMetaName(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateStructuredData(data: object) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}