export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Strongwill Sports",
    "description": "Premium custom athletic apparel and wrestling gear manufacturer",
    "url": "https://strongwillsports.com",
    "logo": "https://strongwillsports.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "German"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressRegion": "NSW",
      "addressLocality": "Sydney"
    },
    "sameAs": [
      "https://facebook.com/strongwillsports",
      "https://instagram.com/strongwillsports"
    ]
  };
}

export function createProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "Strongwill Sports"
    },
    "offers": {
      "@type": "Offer",
      "price": product.basePrice,
      "priceCurrency": "AUD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Strongwill Sports"
      }
    },
    "category": product.category?.name,
    "sku": product.id.toString()
  };
}

export function createWebPageSchema(page: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.description,
    "url": page.url,
    "mainEntity": {
      "@type": "Organization",
      "name": "Strongwill Sports"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://strongwillsports.com"
        }
      ]
    }
  };
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function createBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}