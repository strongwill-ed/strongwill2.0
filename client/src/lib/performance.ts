// Image lazy loading utility
export function lazyLoadImage(img: HTMLImageElement) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        image.src = image.dataset.src || '';
        image.classList.remove('lazy');
        observer.unobserve(image);
      }
    });
  });

  imageObserver.observe(img);
}

// Critical resource preloading
export function preloadCriticalResources() {
  const criticalImages = [
    '/images/hero-banner.jpg',
    '/images/logo.svg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Web Vitals monitoring
export function initWebVitals() {
  if ('web-vital' in window) {
    // Web Vitals monitoring would be implemented here
    // This is a placeholder for production metrics
    console.log('Web Vitals monitoring initialized');
  }
}

// Resource hints for performance
export function addResourceHints() {
  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

// Bundle optimization utilities
export function dynamicImport<T = any>(moduleFactory: () => Promise<T>): Promise<T> {
  return moduleFactory();
}