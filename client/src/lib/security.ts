// Input sanitization utilities
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// XSS prevention
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Rate limiting for client-side requests
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy helpers
export function enforceCSP() {
  // Add CSP meta tag if not present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline' fonts.googleapis.com;
      font-src 'self' fonts.gstatic.com;
      img-src 'self' data: blob:;
      connect-src 'self' ${window.location.origin};
    `.replace(/\s+/g, ' ').trim());
    document.head.appendChild(meta);
  }
}

// Form validation security
export function validateFormData(formData: FormData): boolean {
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      // Check for suspicious patterns
      if (value.includes('<script>') || value.includes('javascript:')) {
        console.warn(`Potentially dangerous input detected in field: ${key}`);
        return false;
      }
    }
  }
  return true;
}

// Secure local storage wrapper
export const secureStorage = {
  setItem(key: string, value: string): void {
    try {
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = sanitizeInput(value);
      localStorage.setItem(sanitizedKey, sanitizedValue);
    } catch (error) {
      console.error('Error setting secure storage item:', error);
    }
  },
  
  getItem(key: string): string | null {
    try {
      const sanitizedKey = sanitizeInput(key);
      return localStorage.getItem(sanitizedKey);
    } catch (error) {
      console.error('Error getting secure storage item:', error);
      return null;
    }
  },
  
  removeItem(key: string): void {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Error removing secure storage item:', error);
    }
  }
};