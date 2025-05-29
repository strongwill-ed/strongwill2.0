import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { Palette, ShoppingCart } from "lucide-react";
import { useCurrency } from "@/lib/currency";

/**
 * Props interface for the ProductCard component
 * Handles product display and user interactions
 */
interface ProductCardProps {
  product: Product;
  onDesignClick?: () => void;
  onAddToCart?: () => void;
}

/**
 * ProductCard Component
 * 
 * Displays product information in a card format with:
 * - Product image with hover effects
 * - Name, description, and pricing
 * - Available sizes and colors
 * - Action buttons for design and cart functionality
 * 
 * @param product - Product data from the database
 * @param onDesignClick - Callback for design tool navigation
 * @param onAddToCart - Callback for adding item to cart
 */
export default function ProductCard({ product, onDesignClick, onAddToCart }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <Card className="group card-hover overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-black line-clamp-1">
            {product.name}
          </h3>
          {product.isActive && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Active
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="space-y-2 mb-4">
          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 5).map((color) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'red' ? '#ef4444' :
                                     color.toLowerCase() === 'blue' ? '#3b82f6' :
                                     color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                     color.toLowerCase() === 'gray' ? '#6b7280' :
                                     color.toLowerCase() === 'green' ? '#10b981' :
                                     color.toLowerCase() === 'yellow' ? '#f59e0b' :
                                     '#6b7280'
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-xs text-gray-500">+{product.colors.length - 5}</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-black">
            {formatPrice(parseFloat(product.basePrice))}
          </span>
          <span className="text-sm text-gray-500">
            Base price
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onDesignClick}
            className="flex-1 btn-primary"
            size="sm"
          >
            <Palette className="mr-2 h-4 w-4" />
            Design
          </Button>
          
          <Button
            onClick={onAddToCart}
            variant="outline"
            className="btn-secondary"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
