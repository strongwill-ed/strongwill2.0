import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { getApparelTemplate } from "./apparel-templates";
import type { Product } from "@shared/schema";

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotation?: number;
}

interface DesignCanvasProps {
  product?: Product;
  elements: DesignElement[];
  selectedElement: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onElementAdd: (element: DesignElement) => void;
  onElementDelete: (id: string) => void;
}

interface CanvasRef {
  addTextElement: (text: string, options?: any) => void;
  addImageElement: (imageSrc: string) => void;
  exportCanvas: () => string;
}

// Drawing functions for different garment shapes
const drawSingletShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  ctx.beginPath();
  // Main body
  ctx.moveTo(x + width * 0.2, y + height * 0.15);
  ctx.lineTo(x + width * 0.8, y + height * 0.15);
  ctx.lineTo(x + width * 0.9, y + height * 0.25);
  ctx.lineTo(x + width * 0.9, y + height * 0.8);
  ctx.lineTo(x + width * 0.7, y + height * 0.95);
  ctx.lineTo(x + width * 0.3, y + height * 0.95);
  ctx.lineTo(x + width * 0.1, y + height * 0.8);
  ctx.lineTo(x + width * 0.1, y + height * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Leg openings
  ctx.beginPath();
  ctx.ellipse(x + width * 0.35, y + height * 0.85, width * 0.08, height * 0.08, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x + width * 0.65, y + height * 0.85, width * 0.08, height * 0.08, 0, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawTShirtShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  ctx.beginPath();
  // Main body
  ctx.moveTo(x + width * 0.25, y + height * 0.2);
  ctx.lineTo(x + width * 0.75, y + height * 0.2);
  ctx.lineTo(x + width * 0.75, y + height * 0.9);
  ctx.lineTo(x + width * 0.25, y + height * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Sleeves
  ctx.beginPath();
  ctx.moveTo(x + width * 0.25, y + height * 0.2);
  ctx.lineTo(x + width * 0.1, y + height * 0.25);
  ctx.lineTo(x + width * 0.05, y + height * 0.4);
  ctx.lineTo(x + width * 0.2, y + height * 0.45);
  ctx.lineTo(x + width * 0.25, y + height * 0.35);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + width * 0.75, y + height * 0.2);
  ctx.lineTo(x + width * 0.9, y + height * 0.25);
  ctx.lineTo(x + width * 0.95, y + height * 0.4);
  ctx.lineTo(x + width * 0.8, y + height * 0.45);
  ctx.lineTo(x + width * 0.75, y + height * 0.35);
  ctx.fill();
  ctx.stroke();
  
  // Neck
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.15, width * 0.08, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawHoodieShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Main body (same as t-shirt but longer)
  ctx.beginPath();
  ctx.moveTo(x + width * 0.25, y + height * 0.25);
  ctx.lineTo(x + width * 0.75, y + height * 0.25);
  ctx.lineTo(x + width * 0.75, y + height * 0.95);
  ctx.lineTo(x + width * 0.25, y + height * 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Hood
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.15, width * 0.15, 0, Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Sleeves (simplified)
  ctx.beginPath();
  ctx.moveTo(x + width * 0.25, y + height * 0.25);
  ctx.lineTo(x + width * 0.1, y + height * 0.3);
  ctx.lineTo(x + width * 0.05, y + height * 0.5);
  ctx.lineTo(x + width * 0.2, y + height * 0.55);
  ctx.lineTo(x + width * 0.25, y + height * 0.4);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + width * 0.75, y + height * 0.25);
  ctx.lineTo(x + width * 0.9, y + height * 0.3);
  ctx.lineTo(x + width * 0.95, y + height * 0.5);
  ctx.lineTo(x + width * 0.8, y + height * 0.55);
  ctx.lineTo(x + width * 0.75, y + height * 0.4);
  ctx.fill();
  ctx.stroke();
  
  // Kangaroo pocket
  ctx.beginPath();
  ctx.roundRect(x + width * 0.35, y + height * 0.55, width * 0.3, height * 0.15, 5);
  ctx.stroke();
};

const drawTankTopShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  ctx.beginPath();
  // Main body
  ctx.moveTo(x + width * 0.3, y + height * 0.2);
  ctx.lineTo(x + width * 0.7, y + height * 0.2);
  ctx.lineTo(x + width * 0.7, y + height * 0.9);
  ctx.lineTo(x + width * 0.3, y + height * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Shoulder straps
  ctx.beginPath();
  ctx.moveTo(x + width * 0.3, y + height * 0.2);
  ctx.lineTo(x + width * 0.35, y + height * 0.1);
  ctx.lineTo(x + width * 0.4, y + height * 0.2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + width * 0.7, y + height * 0.2);
  ctx.lineTo(x + width * 0.65, y + height * 0.1);
  ctx.lineTo(x + width * 0.6, y + height * 0.2);
  ctx.stroke();
  
  // Neckline
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.15, width * 0.06, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawJerseyShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Similar to tank top but with larger armholes
  ctx.beginPath();
  ctx.moveTo(x + width * 0.25, y + height * 0.2);
  ctx.lineTo(x + width * 0.75, y + height * 0.2);
  ctx.lineTo(x + width * 0.75, y + height * 0.9);
  ctx.lineTo(x + width * 0.25, y + height * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Large armholes
  ctx.beginPath();
  ctx.arc(x + width * 0.2, y + height * 0.35, width * 0.08, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x + width * 0.8, y + height * 0.35, width * 0.08, 0, 2 * Math.PI);
  ctx.stroke();
  
  // V-neck
  ctx.beginPath();
  ctx.moveTo(x + width * 0.45, y + height * 0.15);
  ctx.lineTo(x + width * 0.5, y + height * 0.25);
  ctx.lineTo(x + width * 0.55, y + height * 0.15);
  ctx.stroke();
};

const drawShortsShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Waistband
  ctx.fillRect(x + width * 0.1, y + height * 0.1, width * 0.8, height * 0.08);
  ctx.strokeRect(x + width * 0.1, y + height * 0.1, width * 0.8, height * 0.08);
  
  // Left leg
  ctx.beginPath();
  ctx.moveTo(x + width * 0.1, y + height * 0.18);
  ctx.lineTo(x + width * 0.5, y + height * 0.18);
  ctx.lineTo(x + width * 0.55, y + height * 0.8);
  ctx.lineTo(x + width * 0.25, y + height * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Right leg
  ctx.beginPath();
  ctx.moveTo(x + width * 0.5, y + height * 0.18);
  ctx.lineTo(x + width * 0.9, y + height * 0.18);
  ctx.lineTo(x + width * 0.75, y + height * 0.8);
  ctx.lineTo(x + width * 0.45, y + height * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawPoloShape = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Same as t-shirt but with collar and buttons
  drawTShirtShape(ctx, x, y, width, height);
  
  // Collar
  ctx.beginPath();
  ctx.moveTo(x + width * 0.4, y + height * 0.12);
  ctx.lineTo(x + width * 0.45, y + height * 0.08);
  ctx.lineTo(x + width * 0.55, y + height * 0.08);
  ctx.lineTo(x + width * 0.6, y + height * 0.12);
  ctx.stroke();
  
  // Button placket
  ctx.beginPath();
  ctx.moveTo(x + width * 0.5, y + height * 0.15);
  ctx.lineTo(x + width * 0.5, y + height * 0.3);
  ctx.stroke();
  
  // Buttons
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.18, 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.22, 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.26, 2, 0, 2 * Math.PI);
  ctx.fill();
};

const DesignCanvas = forwardRef<CanvasRef, DesignCanvasProps>(({
  product,
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementAdd,
  onElementDelete,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const addTextElement = useCallback((text: string, options: any = {}) => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      x: 150,
      y: 200,
      width: 200,
      height: 50,
      fontSize: options.fontSize || 24,
      color: options.color || '#000000',
      fontFamily: options.fontFamily || 'Arial',
      rotation: 0,
    };
    onElementAdd(newElement);
  }, [onElementAdd]);

  const addImageElement = useCallback((imageSrc: string) => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'image',
      content: imageSrc,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
    };
    onElementAdd(newElement);
  }, [onElementAdd]);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }, []);

  useImperativeHandle(ref, () => ({
    addTextElement,
    addImageElement,
    exportCanvas,
  }), [addTextElement, addImageElement, exportCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw product background
    drawProductBackground(ctx, canvas.width, canvas.height);

    // Draw elements
    elements.forEach(element => {
      drawElement(ctx, element, element.id === selectedElement);
    });
  }, [elements, selectedElement, product]);

  const drawProductBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Get appropriate template for the product
    const template = product ? getApparelTemplate(product.name) : getApparelTemplate('t-shirt');
    
    // Calculate dimensions
    const centerX = width / 2;
    const centerY = height / 2;
    const maxSize = Math.min(width * 0.6, height * 0.75);
    const templateWidth = maxSize * 0.8;
    const templateHeight = maxSize;
    
    const x = centerX - templateWidth / 2;
    const y = centerY - templateHeight / 2;

    // Draw garment shape based on template type
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;

    if (template.name.includes('Singlet')) {
      drawSingletShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('T-Shirt')) {
      drawTShirtShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('Hoodie')) {
      drawHoodieShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('Tank')) {
      drawTankTopShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('Jersey')) {
      drawJerseyShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('Shorts')) {
      drawShortsShape(ctx, x, y, templateWidth, templateHeight);
    } else if (template.name.includes('Polo')) {
      drawPoloShape(ctx, x, y, templateWidth, templateHeight);
    } else {
      // Default to t-shirt
      drawTShirtShape(ctx, x, y, templateWidth, templateHeight);
    }

    // Add subtle design zones for reference
    ctx.fillStyle = 'rgba(0, 123, 255, 0.05)';
    ctx.fillRect(x + templateWidth * 0.15, y + templateHeight * 0.25, templateWidth * 0.7, templateHeight * 0.2); // Chest area
    
    ctx.fillStyle = 'rgba(40, 167, 69, 0.05)';
    ctx.fillRect(x + templateWidth * 0.15, y + templateHeight * 0.55, templateWidth * 0.7, templateHeight * 0.2); // Lower area

    // Add product info
    if (product) {
      ctx.fillStyle = '#6c757d';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(product.name, centerX, height - 20);
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DesignElement, isSelected: boolean) => {
    ctx.save();

    // Apply transformations
    ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
    if (element.rotation) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }
    ctx.translate(-element.width / 2, -element.height / 2);

    if (element.type === 'text') {
      // Draw text element
      ctx.fillStyle = element.color || '#000000';
      ctx.font = `${element.fontSize || 24}px ${element.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.content, element.width / 2, element.height / 2);
    } else if (element.type === 'image') {
      // Draw placeholder for image
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(0, 0, element.width, element.height);
      ctx.strokeStyle = '#adb5bd';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, element.width, element.height);
      
      // Draw image icon
      ctx.fillStyle = '#6c757d';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('IMAGE', element.width / 2, element.height / 2);
    }

    // Draw selection border and handles
    if (isSelected) {
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-2, -2, element.width + 4, element.height + 4);
      
      // Draw resize handles
      const handleSize = 8;
      ctx.fillStyle = '#007bff';
      ctx.setLineDash([]);
      
      // Corner handles
      ctx.fillRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
      ctx.fillRect(element.width - handleSize / 2, -handleSize / 2, handleSize, handleSize);
      ctx.fillRect(-handleSize / 2, element.height - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(element.width - handleSize / 2, element.height - handleSize / 2, handleSize, handleSize);
      
      // Rotation handle
      ctx.beginPath();
      ctx.arc(element.width / 2, -15, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.restore();
  };

  const getElementAt = (x: number, y: number): string | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      ) {
        return element.id;
      }
    }
    return null;
  };

  const getResizeHandle = (x: number, y: number, element: DesignElement): string | null => {
    const handleSize = 8;
    const handles = [
      { name: 'nw', x: element.x - handleSize / 2, y: element.y - handleSize / 2 },
      { name: 'ne', x: element.x + element.width - handleSize / 2, y: element.y - handleSize / 2 },
      { name: 'sw', x: element.x - handleSize / 2, y: element.y + element.height - handleSize / 2 },
      { name: 'se', x: element.x + element.width - handleSize / 2, y: element.y + element.height - handleSize / 2 },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x &&
        x <= handle.x + handleSize &&
        y >= handle.y &&
        y <= handle.y + handleSize
      ) {
        return handle.name;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const elementId = getElementAt(x, y);
    onElementSelect(elementId);

    if (elementId) {
      const element = elements.find(el => el.id === elementId);
      if (element && selectedElement === elementId) {
        const handle = getResizeHandle(x, y, element);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
        } else {
          setIsDragging(true);
          setDragElement(elementId);
        }
      }
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && dragElement) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      const element = elements.find(el => el.id === dragElement);
      if (element) {
        onElementUpdate(dragElement, {
          x: element.x + deltaX,
          y: element.y + deltaY,
        });
      }
      setDragStart({ x, y });
    } else if (isResizing && selectedElement && resizeHandle) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        
        let updates: Partial<DesignElement> = {};
        
        switch (resizeHandle) {
          case 'se':
            updates = {
              width: Math.max(20, element.width + deltaX),
              height: Math.max(20, element.height + deltaY),
            };
            break;
          case 'nw':
            updates = {
              x: element.x + deltaX,
              y: element.y + deltaY,
              width: Math.max(20, element.width - deltaX),
              height: Math.max(20, element.height - deltaY),
            };
            break;
          case 'ne':
            updates = {
              y: element.y + deltaY,
              width: Math.max(20, element.width + deltaX),
              height: Math.max(20, element.height - deltaY),
            };
            break;
          case 'sw':
            updates = {
              x: element.x + deltaX,
              width: Math.max(20, element.width - deltaX),
              height: Math.max(20, element.height + deltaY),
            };
            break;
        }
        
        onElementUpdate(selectedElement, updates);
        setDragStart({ x, y });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragElement(null);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedElement) {
        onElementDelete(selectedElement);
      }
    }
  }, [selectedElement, onElementDelete]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-2 border-gray-300 bg-white rounded-lg shadow-sm cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';

export default DesignCanvas;