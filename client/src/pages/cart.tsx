import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { SponsorshipCredit } from "@shared/schema";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [appliedCredits, setAppliedCredits] = useState<number[]>([]);

  // Fetch available sponsorship credits for authenticated users
  const { data: sponsorshipCredits = [] } = useQuery<SponsorshipCredit[]>({
    queryKey: ["/api/user/sponsorship-credits"],
    enabled: !!user,
  });

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.basePrice || "0");
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const calculateBulkDiscount = (subtotal: number, totalQuantity: number) => {
    if (totalQuantity >= 10) {
      return subtotal * 0.1; // 10% discount for 10+ items
    }
    return 0;
  };

  const calculateSponsorshipDiscount = () => {
    return appliedCredits.reduce((total, creditId) => {
      const credit = sponsorshipCredits.find(c => c.id === creditId);
      if (credit && credit.isActive) {
        return total + parseFloat(credit.remainingAmount);
      }
      return total;
    }, 0);
  };

  const handleCreditToggle = (creditId: number, checked: boolean) => {
    if (checked) {
      setAppliedCredits(prev => [...prev, creditId]);
    } else {
      setAppliedCredits(prev => prev.filter(id => id !== creditId));
    }
  };

  const subtotal = calculateSubtotal();
  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const bulkDiscount = calculateBulkDiscount(subtotal, totalQuantity);
  const sponsorshipDiscount = calculateSponsorshipDiscount();
  const shipping = 15.00; // Flat rate shipping
  const total = Math.max(0, subtotal - bulkDiscount - sponsorshipDiscount + shipping);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product?.name || "Product"}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        ${parseFloat(item.product?.basePrice || "0").toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border-0 bg-transparent"
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Bulk Discount (10% off 10+ items)</span>
                    <span>-${bulkDiscount.toFixed(2)}</span>
                  </div>
                )}

                {/* Sponsorship Credits Section */}
                {user && sponsorshipCredits.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Apply Sponsorship Credits
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {sponsorshipCredits
                        .filter(credit => credit.isActive && parseFloat(credit.remainingAmount) > 0)
                        .map((credit) => (
                          <div key={credit.id} className="flex items-center space-x-2 text-sm">
                            <Checkbox
                              id={`credit-${credit.id}`}
                              checked={appliedCredits.includes(credit.id)}
                              onCheckedChange={(checked) => handleCreditToggle(credit.id, checked as boolean)}
                            />
                            <label 
                              htmlFor={`credit-${credit.id}`} 
                              className="flex-1 cursor-pointer"
                            >
                              ${parseFloat(credit.remainingAmount).toFixed(2)} available
                            </label>
                          </div>
                        ))}
                    </div>
                    {sponsorshipDiscount > 0 && (
                      <div className="flex justify-between text-blue-600 dark:text-blue-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span>Sponsorship Credits Applied</span>
                        <span>-${sponsorshipDiscount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}