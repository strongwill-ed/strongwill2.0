import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/product/product-card";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";
import { Sparkles } from "lucide-react";

interface ProductRecommendationsProps {
  currentProductId?: number;
  categoryId?: number;
  title?: string;
  maxItems?: number;
}

export default function ProductRecommendations({ 
  currentProductId, 
  categoryId, 
  title = "You might also like",
  maxItems = 4 
}: ProductRecommendationsProps) {
  const [, setLocation] = useLocation();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter recommendations based on category and exclude current product
  const recommendations = products
    .filter(product => {
      if (currentProductId && product.id === currentProductId) return false;
      if (categoryId && product.categoryId !== categoryId) return false;
      return true;
    })
    .sort(() => Math.random() - 0.5) // Randomize for variety
    .slice(0, maxItems);

  if (recommendations.length === 0) {
    return null;
  }

  const handleProductClick = (productId: number) => {
    setLocation(`/design-tool?product=${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    // This would trigger the add to cart modal
    console.log("Add to cart:", product);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDesignClick={() => handleProductClick(product.id)}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}