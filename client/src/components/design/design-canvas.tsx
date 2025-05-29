import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from "react";
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

    // Draw product outline (singlet shape)
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const centerX = width / 2;
    const centerY = height / 2;
    const singletWidth = width * 0.6;
    const singletHeight = height * 0.8;
    
    // Draw rounded rectangle for singlet
    const x = centerX - singletWidth / 2;
    const y = centerY - singletHeight / 2;
    const radius = 20;
    
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + singletWidth - radius, y);
    ctx.quadraticCurveTo(x + singletWidth, y, x + singletWidth, y + radius);
    ctx.lineTo(x + singletWidth, y + singletHeight - radius);
    ctx.quadraticCurveTo(x + singletWidth, y + singletHeight, x + singletWidth - radius, y + singletHeight);
    ctx.lineTo(x + radius, y + singletHeight);
    ctx.quadraticCurveTo(x, y + singletHeight, x, y + singletHeight - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.stroke();

    // Add color zones
    ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';
    ctx.fillRect(x + 20, y + 50, singletWidth - 40, 80); // Chest area
    
    ctx.fillStyle = 'rgba(40, 167, 69, 0.1)';
    ctx.fillRect(x + 20, y + 150, singletWidth - 40, 80); // Waist area

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