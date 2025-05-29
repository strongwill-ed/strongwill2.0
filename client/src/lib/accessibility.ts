// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Keyboard navigation support
export function addKeyboardSupport(element: HTMLElement, callback: () => void) {
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  });
}

// Screen reader announcements
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Color contrast utilities
export function ensureColorContrast() {
  // Add high contrast mode detection
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Add reduced motion support
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
  }
}

// Form accessibility helpers
export function enhanceFormAccessibility(form: HTMLFormElement) {
  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    const inputElement = input as HTMLInputElement;
    
    // Add required field indicators
    if (inputElement.required) {
      const label = form.querySelector(`label[for="${inputElement.id}"]`);
      if (label && !label.textContent?.includes('*')) {
        label.textContent += ' *';
        inputElement.setAttribute('aria-required', 'true');
      }
    }
    
    // Enhanced error messages
    inputElement.addEventListener('invalid', () => {
      const errorMessage = inputElement.validationMessage;
      announceToScreenReader(`Error: ${errorMessage}`);
    });
  });
}