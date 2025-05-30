import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CurrencyProvider } from "@/lib/currency";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import DesignTool from "@/pages/design-tool";
import GroupOrders from "@/pages/group-orders";
import Sponsorship from "@/pages/sponsorship";
import CreateSeekerProfile from "@/pages/create-seeker-profile";
import CreateSponsorProfile from "@/pages/create-sponsor-profile";
import TeamProfile from "@/pages/team-profile";
import SponsorProfile from "@/pages/sponsor-profile";
import SharedTeamProfile from "@/pages/shared-team-profile";
import SponsorshipAgreement from "@/pages/sponsorship-agreement";
import SponsorshipOrder from "@/pages/sponsorship-order";
import Admin from "@/pages/admin";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Orders from "@/pages/orders";
import MyDesigns from "@/pages/my-designs";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CartSidebar from "@/components/cart/cart-sidebar";
import { CartProvider } from "@/hooks/use-cart";
import { NewsletterPopup } from "@/components/newsletter-popup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/design-tool" component={DesignTool} />
      <Route path="/group-orders" component={GroupOrders} />
      <Route path="/sponsorship" component={Sponsorship} />
      <Route path="/create-seeker-profile" component={CreateSeekerProfile} />
      <Route path="/create-sponsor-profile" component={CreateSponsorProfile} />
      <Route path="/team-profile/:id" component={TeamProfile} />
      <Route path="/sponsor-profile/:id" component={SponsorProfile} />
      <Route path="/shared/:token" component={SharedTeamProfile} />
      <Route path="/sponsorship-agreement/:id" component={SponsorshipAgreement} />
      <Route path="/sponsorship-order/:orderId" component={SponsorshipOrder} />
      <Route path="/admin" component={Admin} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/orders" component={Orders} />
      <Route path="/my-designs" component={MyDesigns} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
                <CartSidebar />
                <NewsletterPopup />
                <Toaster />
              </div>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
