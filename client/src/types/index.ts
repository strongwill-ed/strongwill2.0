export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  zIndex: number;
}

export interface DesignData {
  elements: DesignElement[];
  background: {
    color: string;
    image?: string;
  };
}

export interface CartItem {
  id: number;
  productId: number;
  designId?: number;
  quantity: number;
  size: string;
  color: string;
  product?: {
    name: string;
    basePrice: string;
    description: string;
  };
  customizations?: Record<string, any>;
}

export interface ProductWithCategory {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  basePrice: string;
  sizes: string[];
  colors: string[];
  isActive: boolean;
  createdAt: Date;
  category?: {
    name: string;
    description: string;
    slug: string;
  };
}

export interface GroupOrderWithItems {
  id: number;
  name: string;
  description: string;
  organizerId?: number;
  productId: number;
  designId?: number;
  deadline: Date;
  minQuantity: number;
  currentQuantity: number;
  status: string;
  shareCode: string;
  createdAt: Date;
  items: Array<{
    id: number;
    customerName: string;
    customerEmail: string;
    size: string;
    quantity: number;
    createdAt: Date;
  }>;
  product?: ProductWithCategory;
}

export interface OrderWithItems {
  id: number;
  userId?: number;
  customerEmail: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    productId: number;
    designId?: number;
    quantity: number;
    size: string;
    color: string;
    unitPrice: string;
    customizations?: Record<string, any>;
  }>;
}
