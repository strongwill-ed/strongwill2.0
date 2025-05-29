// SVG templates for different apparel shapes
export const apparelTemplates = {
  "wrestling-singlet": {
    name: "Wrestling Singlet",
    svg: `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 80 C100 60, 120 40, 140 40 L260 40 C280 40, 300 60, 300 80 L320 120 C330 140, 330 160, 320 180 L310 200 L310 400 C310 420, 300 440, 280 450 L280 520 C280 540, 260 560, 240 560 L160 560 C140 560, 120 540, 120 520 L120 450 C100 440, 90 420, 90 400 L90 200 L80 180 C70 160, 70 140, 80 120 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Leg openings -->
      <ellipse cx="150" cy="520" rx="30" ry="40" fill="none" stroke="#333" stroke-width="1"/>
      <ellipse cx="250" cy="520" rx="30" ry="40" fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 400,
    height: 600
  },
  
  "t-shirt": {
    name: "T-Shirt",
    svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M120 120 L120 460 C120 480, 140 500, 160 500 L240 500 C260 500, 280 480, 280 460 L280 120" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Sleeves -->
      <path d="M120 120 C100 110, 80 120, 70 140 L60 180 C55 200, 65 220, 85 225 L120 220 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <path d="M280 120 C300 110, 320 120, 330 140 L340 180 C345 200, 335 220, 315 225 L280 220 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Neck -->
      <path d="M140 80 C140 60, 160 40, 200 40 C240 40, 260 60, 260 80 L260 120 L140 120 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Neckline -->
      <ellipse cx="200" cy="90" rx="25" ry="15" fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 400,
    height: 500
  },

  "hoodie": {
    name: "Hoodie",
    svg: `<svg viewBox="0 0 420 550" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M110 140 L110 500 C110 520, 130 540, 150 540 L270 540 C290 540, 310 520, 310 500 L310 140" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Sleeves -->
      <path d="M110 140 C90 130, 70 140, 60 160 L50 220 C45 240, 55 260, 75 265 L110 260 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <path d="M310 140 C330 130, 350 140, 360 160 L370 220 C375 240, 365 260, 345 265 L310 260 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Hood -->
      <path d="M130 60 C130 30, 160 10, 210 10 C260 10, 290 30, 290 60 L290 140 L130 140 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Hood detail -->
      <path d="M150 70 C150 50, 170 40, 210 40 C250 40, 270 50, 270 70" 
            fill="none" stroke="#333" stroke-width="1"/>
      <!-- Kangaroo pocket -->
      <rect x="160" y="280" width="100" height="80" rx="10" 
            fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 420,
    height: 550
  },

  "tank-top": {
    name: "Tank Top",
    svg: `<svg viewBox="0 0 350 480" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M100 100 L100 440 C100 460, 120 480, 140 480 L210 480 C230 480, 250 460, 250 440 L250 100 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Shoulder straps -->
      <path d="M100 100 C100 80, 120 60, 140 60 L150 60 L150 100" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <path d="M250 100 C250 80, 230 60, 210 60 L200 60 L200 100" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Neckline -->
      <path d="M150 60 C150 40, 170 20, 175 20 C180 20, 200 40, 200 60" 
            fill="none" stroke="#333" stroke-width="2"/>
      <!-- Armholes -->
      <ellipse cx="100" cy="130" rx="15" ry="30" fill="none" stroke="#333" stroke-width="1"/>
      <ellipse cx="250" cy="130" rx="15" ry="30" fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 350,
    height: 480
  },

  "baseball-jersey": {
    name: "Baseball Jersey",
    svg: `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M120 130 L120 480 C120 500, 140 520, 160 520 L240 520 C260 520, 280 500, 280 480 L280 130" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Sleeves -->
      <path d="M120 130 C100 120, 80 130, 70 150 L65 200 C60 220, 70 240, 90 245 L120 240 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <path d="M280 130 C300 120, 320 130, 330 150 L335 200 C340 220, 330 240, 310 245 L280 240 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Collar -->
      <path d="M140 90 C140 70, 160 50, 200 50 C240 50, 260 70, 260 90 L260 130 L140 130 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Button placket -->
      <line x1="200" y1="90" x2="200" y2="350" stroke="#333" stroke-width="1"/>
      <!-- Buttons -->
      <circle cx="200" cy="120" r="3" fill="#333"/>
      <circle cx="200" cy="160" r="3" fill="#333"/>
      <circle cx="200" cy="200" r="3" fill="#333"/>
      <circle cx="200" cy="240" r="3" fill="#333"/>
      <circle cx="200" cy="280" r="3" fill="#333"/>
      <circle cx="200" cy="320" r="3" fill="#333"/>
    </svg>`,
    width: 400,
    height: 520
  },

  "shorts": {
    name: "Athletic Shorts",
    svg: `<svg viewBox="0 0 350 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Waistband -->
      <rect x="50" y="40" width="250" height="20" rx="5" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Left leg -->
      <path d="M50 60 L50 250 C50 270, 70 290, 90 290 L130 290 C140 290, 150 280, 150 270 L175 200 L175 60 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Right leg -->
      <path d="M175 60 L175 200 L200 270 C200 280, 210 290, 220 290 L260 290 C280 290, 300 270, 300 250 L300 60 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Inseam -->
      <path d="M175 60 L175 200" stroke="#333" stroke-width="1"/>
      <!-- Side pockets -->
      <path d="M60 80 C50 90, 50 110, 60 120" fill="none" stroke="#333" stroke-width="1"/>
      <path d="M290 80 C300 90, 300 110, 290 120" fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 350,
    height: 300
  },

  "polo-shirt": {
    name: "Polo Shirt",
    svg: `<svg viewBox="0 0 380 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M110 130 L110 460 C110 480, 130 500, 150 500 L230 500 C250 500, 270 480, 270 460 L270 130" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Sleeves -->
      <path d="M110 130 C90 120, 70 130, 60 150 L55 190 C50 210, 60 230, 80 235 L110 230 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <path d="M270 130 C290 120, 310 130, 320 150 L325 190 C330 210, 320 230, 300 235 L270 230 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Collar -->
      <path d="M130 70 C130 50, 150 30, 190 30 C230 30, 250 50, 250 70 L250 130 L130 130 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Polo collar detail -->
      <path d="M160 80 L160 130 L220 130 L220 80" fill="none" stroke="#333" stroke-width="1"/>
      <!-- Buttons -->
      <circle cx="190" cy="90" r="3" fill="#333"/>
      <circle cx="190" cy="110" r="3" fill="#333"/>
      <circle cx="190" cy="130" r="3" fill="#333"/>
    </svg>`,
    width: 380,
    height: 500
  },

  "basketball-jersey": {
    name: "Basketball Jersey",
    svg: `<svg viewBox="0 0 380 520" xmlns="http://www.w3.org/2000/svg">
      <!-- Main body -->
      <path d="M100 120 L100 480 C100 500, 120 520, 140 520 L240 520 C260 520, 280 500, 280 480 L280 120 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- Large armholes -->
      <path d="M100 120 C80 130, 60 150, 60 180 C60 210, 80 230, 100 240" 
            fill="none" stroke="#333" stroke-width="2"/>
      <path d="M280 120 C300 130, 320 150, 320 180 C320 210, 300 230, 280 240" 
            fill="none" stroke="#333" stroke-width="2"/>
      <!-- Neckline -->
      <path d="M140 60 C140 40, 160 20, 190 20 C220 20, 240 40, 240 60 L240 120 L140 120 Z" 
            fill="currentColor" stroke="#333" stroke-width="2"/>
      <!-- V-neck -->
      <path d="M170 80 L190 100 L210 80" fill="none" stroke="#333" stroke-width="2"/>
      <!-- Side panels -->
      <path d="M100 200 C80 200, 70 220, 70 240 L70 400 C70 420, 80 440, 100 440" 
            fill="none" stroke="#333" stroke-width="1"/>
      <path d="M280 200 C300 200, 310 220, 310 240 L310 400 C310 420, 300 440, 280 440" 
            fill="none" stroke="#333" stroke-width="1"/>
    </svg>`,
    width: 380,
    height: 520
  }
};

export function getApparelTemplate(productName: string) {
  // Match product names to templates
  const name = productName.toLowerCase();
  
  if (name.includes('singlet')) return apparelTemplates['wrestling-singlet'];
  if (name.includes('t-shirt') || name.includes('tee')) return apparelTemplates['t-shirt'];
  if (name.includes('hoodie') || name.includes('sweatshirt')) return apparelTemplates['hoodie'];
  if (name.includes('tank')) return apparelTemplates['tank-top'];
  if (name.includes('baseball') && name.includes('jersey')) return apparelTemplates['baseball-jersey'];
  if (name.includes('basketball') && name.includes('jersey')) return apparelTemplates['basketball-jersey'];
  if (name.includes('polo')) return apparelTemplates['polo-shirt'];
  if (name.includes('shorts')) return apparelTemplates['shorts'];
  if (name.includes('jersey')) return apparelTemplates['basketball-jersey'];
  
  // Default to t-shirt for generic apparel
  return apparelTemplates['t-shirt'];
}