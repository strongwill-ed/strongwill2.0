import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { Palette, ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { useState } from "react";

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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewing, setIsQuickViewing] = useState(false);
  
  // Mock rating - in real app this would come from reviews
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 50;
  
  return (
    <Card className="group card-hover overflow-hidden relative">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick actions overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickViewing(!isQuickViewing);
            }}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        
        {/* Sale badge */}
        {Math.random() > 0.7 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
            Sale
          </Badge>
        )}
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
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
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
          <div className="flex items-center gap-2">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(parseFloat(product.salePrice))}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(parseFloat(product.basePrice))}
                </span>
                <Badge variant="destructive" className="text-xs">
                  SALE
                </Badge>
              </>
            ) : (
              <span className="text-xl font-bold text-black">
                {formatPrice(parseFloat(product.basePrice))}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Starting at
          </span>
        </div>
        
        {/* Stock indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>
          <span className="text-sm text-green-600">In Stock</span>
          <span className="text-xs text-gray-500">• Fast Shipping</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onDesignClick}
            className="flex-1 btn-primary group"
            size="sm"
          >
            <Palette className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Customize
          </Button>
          
          <Button
            onClick={onAddToCart}
            variant="outline"
            className="btn-secondary hover:bg-black hover:text-white transition-colors"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
