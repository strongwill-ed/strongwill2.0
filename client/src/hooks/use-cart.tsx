import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import type { InsertCartItem } from "@shared/schema";

interface CartItem extends InsertCartItem {
  id: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: InsertCartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [nextId, setNextId] = useState(1);

  const addToCart = useCallback((item: InsertCartItem) => {
    // Check if item already exists with same product, size, color, and customizations
    const existingItemIndex = cartItems.findIndex(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.size === item.size &&
        cartItem.color === item.color &&
        cartItem.customizations === item.customizations
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      setCartItems(prev => prev.map((cartItem, index) => 
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      ));
      
      toast({
        title: "Cart Updated",
        description: "Item quantity increased in cart",
      });
    } else {
      // Add new item
      const newItem: CartItem = {
        ...item,
        id: nextId,
      };
      
      setCartItems(prev => [...prev, newItem]);
      setNextId(prev => prev + 1);
      
      toast({
        title: "Added to Cart",
        description: "Item added to your cart successfully",
      });
    }
  }, [cartItems, nextId, toast]);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "Item removed from cart",
    });
  }, [toast]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  }, [toast]);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const getCartTotal = useCallback(() => {
    // This would normally fetch product prices from the API
    // For now, we'll use a placeholder calculation
    return cartItems.reduce((total, item) => {
      // Assuming base price of $45 for demo - in real app, fetch from products
      const price = 45; // This should come from product data
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
