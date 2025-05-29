import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import type { Product } from "@shared/schema";

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [, setLocation] = useLocation();

  const productIds = [...new Set(cartItems.map(item => item.productId).filter(Boolean))];
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: productIds.length > 0,
  });

  const getProduct = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout...", cartItems);
    toggleCart(); // Close the cart sidebar
    setLocation("/checkout"); // Navigate to checkout page
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Start designing your custom apparel!</p>
                <Button onClick={toggleCart} className="btn-primary">
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const product = getProduct(item.productId || 0);
                    const itemTotal = product ? parseFloat(product.basePrice) * (item.quantity || 1) : 0;

                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product?.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=80&h=80&fit=crop"}
                            alt={product?.name || "Product"}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product?.name || "Custom Product"}
                          </h3>
                          <div className="mt-1 space-y-1">
                            {item.size && (
                              <p className="text-xs text-gray-500">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-xs text-gray-500">Color: {item.color}</p>
                            )}
                            {item.customizations && (
                              <p className="text-xs text-gray-500">Custom Design</p>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity || 1}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Subtotal</span>
                  <span className="text-base font-medium text-gray-900">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full btn-primary"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={toggleCart}
                    className="w-full btn-secondary"
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    Accepted Payment Methods
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                      <i className="fab fa-cc-visa text-white text-xs"></i>
                    </div>
                    <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                      <i className="fab fa-cc-mastercard text-white text-xs"></i>
                    </div>
                    <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                      <i className="fab fa-cc-stripe text-white text-xs"></i>
                    </div>
                    <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                      <i className="fab fa-paypal text-white text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
