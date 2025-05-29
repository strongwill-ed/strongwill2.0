/**
 * Personalization utilities for product recommendations
 * Uses browser cookies to track user preferences and behavior
 */

interface UserPreferences {
  viewedCategories: number[];
  viewedProducts: number[];
  searchTerms: string[];
  lastVisit: string;
}

const PREFS_COOKIE_NAME = 'strongwill_user_prefs';
const MAX_TRACKED_ITEMS = 10;

/**
 * Get user preferences from cookies
 */
export function getUserPreferences(): UserPreferences {
  if (typeof document === 'undefined') {
    return {
      viewedCategories: [],
      viewedProducts: [],
      searchTerms: [],
      lastVisit: new Date().toISOString()
    };
  }

  try {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(PREFS_COOKIE_NAME + '='))
      ?.split('=')[1];

    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue));
    }
  } catch (error) {
    console.warn('Failed to parse user preferences:', error);
  }

  return {
    viewedCategories: [],
    viewedProducts: [],
    searchTerms: [],
    lastVisit: new Date().toISOString()
  };
}

/**
 * Save user preferences to cookies
 */
export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof document === 'undefined') return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(prefs));
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    document.cookie = `${PREFS_COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.warn('Failed to save user preferences:', error);
  }
}

/**
 * Track product view
 */
export function trackProductView(productId: number, categoryId?: number): void {
  const prefs = getUserPreferences();
  
  // Add to viewed products (keep recent ones)
  prefs.viewedProducts = [
    productId,
    ...prefs.viewedProducts.filter(id => id !== productId)
  ].slice(0, MAX_TRACKED_ITEMS);

  // Add to viewed categories if provided
  if (categoryId) {
    prefs.viewedCategories = [
      categoryId,
      ...prefs.viewedCategories.filter(id => id !== categoryId)
    ].slice(0, MAX_TRACKED_ITEMS);
  }

  prefs.lastVisit = new Date().toISOString();
  saveUserPreferences(prefs);
}

/**
 * Track search term
 */
export function trackSearch(searchTerm: string): void {
  if (!searchTerm.trim()) return;

  const prefs = getUserPreferences();
  const term = searchTerm.toLowerCase().trim();
  
  prefs.searchTerms = [
    term,
    ...prefs.searchTerms.filter(t => t !== term)
  ].slice(0, MAX_TRACKED_ITEMS);

  prefs.lastVisit = new Date().toISOString();
  saveUserPreferences(prefs);
}

/**
 * Get personalized product score for sorting
 */
export function getPersonalizationScore(product: any): number {
  const prefs = getUserPreferences();
  let score = 0;

  // Boost products from viewed categories
  if (product.categoryId && prefs.viewedCategories.includes(product.categoryId)) {
    score += 10;
  }

  // Boost products matching search terms
  const productText = `${product.name} ${product.description || ''}`.toLowerCase();
  prefs.searchTerms.forEach(term => {
    if (productText.includes(term)) {
      score += 5;
    }
  });

  // Boost sale items
  if (product.isOnSale) {
    score += 3;
  }

  // Random factor to avoid being too predictable
  score += Math.random() * 2;

  return score;
}

/**
 * Sort products by personalization relevance
 */
export function sortProductsByRelevance<T extends any>(products: T[]): T[] {
  return [...products].sort((a, b) => getPersonalizationScore(b) - getPersonalizationScore(a));
}