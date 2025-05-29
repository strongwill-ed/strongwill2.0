import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/components/auth/auth-provider";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

export default function Header() {
  const [location] = useLocation();
  const { cartItems, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Design", href: "/design-tool" },
    { name: "Group Orders", href: "/group-orders" },
    { name: "Sponsorship", href: "/sponsorship" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-3xl text-black cursor-pointer hover:text-gray-700 transition-colors tracking-tight">
                <span className="font-black italic">STRONGWILL</span>
                <span className="font-normal italic">SPORTS</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer text-center block ${
                  isActiveLink(item.href)
                    ? "text-black border-b-2 border-black"
                    : "text-gray-600 hover:text-black"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleCart}
              className="relative text-gray-600 hover:text-black"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-gray-500">
                      {user.email} • {user.role}
                    </div>
                    <div className="border-t my-1"></div>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Order History
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </DropdownMenuItem>
                    </Link>
                    <div className="border-t my-1"></div>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/register">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        Sign Up
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin Button - Only show for authenticated admin users */}
            {user && user.role === "admin" && (
              <Link href="/admin">
                <Button 
                  size="sm" 
                  className={`btn-primary ${isActiveLink("/admin") ? "bg-gray-800" : ""}`}
                >
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-black">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <span className="font-logo italic text-xl font-bold text-black">
                      Strongwillsports
                    </span>
                  </div>
                  
                  <nav className="flex-1 space-y-1">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <span 
                          className={`block px-3 py-2 text-base font-medium rounded-md cursor-pointer transition-colors ${
                            isActiveLink(item.href)
                              ? "bg-black text-white"
                              : "text-gray-900 hover:bg-gray-100"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-900 hover:bg-gray-100"
                      onClick={() => {
                        toggleCart();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingCart className="mr-3 h-5 w-5" />
                      Cart ({cartItemCount})
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-start text-gray-900 hover:bg-gray-100">
                      <User className="mr-3 h-5 w-5" />
                      Account
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
