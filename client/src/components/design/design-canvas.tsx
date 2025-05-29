import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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
}

const DesignCanvas = forwardRef<HTMLCanvasElement, DesignCanvasProps>(({
  product,
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragElement = useRef<string | null>(null);

  useImperativeHandle(ref, () => canvasRef.current!, []);

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
    // Draw a simple product outline (singlet shape)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw singlet outline
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Simple singlet shape
    const centerX = width / 2;
    const centerY = height / 2;
    const singletWidth = width * 0.6;
    const singletHeight = height * 0.8;
    
    ctx.roundRect(
      centerX - singletWidth / 2,
      centerY - singletHeight / 2,
      singletWidth,
      singletHeight,
      20
    );
    
    ctx.stroke();

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
      // Draw image element
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, element.width, element.height);
      };
      img.src = element.content;
    }

    // Draw selection border
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
    }

    ctx.restore();
  };

  const getElementAt = (x: number, y: number): string | null => {
    // Check elements in reverse order (top to bottom)
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const elementId = getElementAt(x, y);
    onElementSelect(elementId);

    if (elementId) {
      isDragging.current = true;
      dragElement.current = elementId;
      dragStart.current = { x, y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || !dragElement.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.current.x;
    const deltaY = y - dragStart.current.y;

    const element = elements.find(el => el.id === dragElement.current);
    if (element) {
      onElementUpdate(dragElement.current, {
        x: element.x + deltaX,
        y: element.y + deltaY,
      });
    }

    dragStart.current = { x, y };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragElement.current = null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const elementId = getElementAt(x, y);
    if (!elementId) {
      onElementSelect(null);
    }
  };

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
        onClick={handleCanvasClick}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';

export default DesignCanvas;
