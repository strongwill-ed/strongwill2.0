/**
 * Performance monitoring and optimization utilities
 * Implements Phase 6 performance requirements
 */

// Performance metrics tracking
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load times
  trackPageLoad(pageName: string) {
    const loadTime = performance.now();
    if (!this.metrics.has(pageName)) {
      this.metrics.set(pageName, []);
    }
    this.metrics.get(pageName)!.push(loadTime);
  }

  // Track API response times
  trackAPICall(endpoint: string, startTime: number) {
    const duration = performance.now() - startTime;
    const key = `api_${endpoint}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    this.metrics.get(key)!.push(duration);
  }

  // Get performance summary
  getMetrics() {
    const summary: Record<string, { avg: number; count: number }> = {};
    this.metrics.forEach((times, key) => {
      summary[key] = {
        avg: times.reduce((a, b) => a + b, 0) / times.length,
        count: times.length
      };
    });
    return summary;
  }
}

// Image optimization utilities
export function optimizeImageLoading() {
  // Implement lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Bundle size monitoring
export function checkBundleSize() {
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;
  
  scripts.forEach(script => {
    // This would typically be calculated during build time
    console.log('Script loaded:', (script as HTMLScriptElement).src);
  });
  
  return totalSize;
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return null;
}

// Core Web Vitals tracking
export function trackCoreWebVitals() {
  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      if (!(entry as any).hadRecentInput) {
        console.log('CLS:', (entry as any).value);
      }
    });
  }).observe({ entryTypes: ['layout-shift'] });
}