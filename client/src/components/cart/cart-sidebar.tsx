import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/lib/currency";
import { useLocation } from "wouter";
import { Minus, Plus, X, ShoppingBag, Truck, Shield, ArrowRight } from "lucide-react";

export default function CartSidebar() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { formatPrice } = useCurrency();
  const [, setLocation] = useLocation();
  const [promoCode, setPromoCode] = useState("");

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 12; // Free shipping over $100
  const total = subtotal + shipping;

  const handleCheckout = () => {
    toggleCart();
    setLocation("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <Sheet open={isCartOpen} onOpenChange={toggleCart}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Your cart is currently empty</SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="text-gray-500 text-center">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button onClick={() => { toggleCart(); setLocation("/products"); }} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        {/* Trust indicators */}
        <div className="flex items-center justify-between py-3 bg-green-50 rounded-lg px-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Fast Shipping</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.product?.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=80&h=80&fit=crop"}
                alt={item.product?.name || "Product"}
                className="w-16 h-16 object-cover rounded-md"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {item.product?.name || "Custom Product"}
                </h4>
                <div className="text-sm text-gray-500 space-y-1">
                  {item.size && <div>Size: {item.size}</div>}
                  {item.color && <div>Color: {item.color}</div>}
                  {item.customizations && (
                    <div className="text-xs text-blue-600">Custom Design</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2 text-sm font-medium">
                      {item.quantity || 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatPrice(parseFloat(item.product?.basePrice || "0") * (item.quantity || 1))}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="space-y-4 pt-4 border-t">
          {/* Promo Code */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <Button variant="outline" size="sm">
              Apply
            </Button>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <div className="text-xs text-gray-500">
                Free shipping on orders over {formatPrice(100)}
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button onClick={handleCheckout} className="w-full btn-primary group">
              Checkout
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => { toggleCart(); setLocation("/products"); }}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Payment Security */}
          <div className="text-center text-xs text-gray-500">
            Secure 256-bit SSL encryption
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}