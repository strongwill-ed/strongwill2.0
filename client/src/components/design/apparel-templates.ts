// Apparel template functions for different product types

export function getApparelTemplate(productName: string | null | undefined) {
  if (!productName || typeof productName !== 'string') {
    return 'singlet'; // Default fallback
  }
  
  const name = productName.toLowerCase();
  
  if (name.includes('singlet')) {
    return 'singlet';
  } else if (name.includes('shirt') || name.includes('tee')) {
    return 'shirt';
  } else if (name.includes('shorts')) {
    return 'shorts';
  } else if (name.includes('jersey')) {
    return 'jersey';
  } else if (name.includes('hoodie')) {
    return 'hoodie';
  } else {
    return 'singlet'; // Default template
  }
}

export function getTemplateDisplayName(template: string): string {
  switch (template) {
    case 'singlet':
      return 'Wrestling Singlet';
    case 'shirt':
      return 'T-Shirt';
    case 'shorts':
      return 'Athletic Shorts';
    case 'jersey':
      return 'Sports Jersey';
    case 'hoodie':
      return 'Hoodie';
    default:
      return 'Athletic Apparel';
  }
}

export function getTemplateColors(template: string): string[] {
  switch (template) {
    case 'singlet':
      return ['#FF0000', '#0066CC', '#000000', '#FFFFFF', '#FFD700'];
    case 'shirt':
      return ['#000000', '#FFFFFF', '#FF0000', '#0066CC', '#228B22'];
    case 'shorts':
      return ['#000000', '#FFFFFF', '#0066CC', '#FF0000', '#800080'];
    case 'jersey':
      return ['#FF0000', '#0066CC', '#FFD700', '#228B22', '#000000'];
    case 'hoodie':
      return ['#000000', '#FFFFFF', '#808080', '#0066CC', '#8B0000'];
    default:
      return ['#000000', '#FFFFFF', '#FF0000', '#0066CC'];
  }
}