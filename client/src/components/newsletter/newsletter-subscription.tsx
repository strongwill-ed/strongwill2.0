import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, ArrowRight } from "lucide-react";

interface NewsletterSubscriptionProps {
  variant?: "default" | "footer" | "modal";
  className?: string;
}

export function NewsletterSubscription({ variant = "default", className = "" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", {
        email: email.trim(),
      });

      if (response.ok) {
        toast({
          title: "Welcome to Strongwill Sports!",
          description: "You've successfully subscribed to our newsletter. Check your email for a confirmation.",
        });
        setEmail("");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "footer") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
          <p className="text-sm text-gray-300">
            Get the latest gear, training tips, and exclusive offers delivered to your inbox.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-white text-black hover:bg-gray-100"
          >
            {isLoading ? "..." : <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className={`text-center space-y-6 ${className}`}>
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Join Our Community</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Be the first to know about new products, training tips, and exclusive offers from Strongwill Sports.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>
        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-black to-gray-900 text-white p-8 rounded-lg ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              <span className="font-black">STRONGWILL</span>{" "}
              <span className="font-normal">SPORTS</span> Newsletter
            </h2>
            <p className="text-gray-300 text-lg">
              Get exclusive access to new product launches, training guides, 
              and special offers for serious athletes.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Early access to new wrestling gear</li>
              <li>• Training tips from professional athletes</li>
              <li>• Exclusive discounts and promotions</li>
              <li>• Custom design inspiration and tutorials</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-100 h-12 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </form>
            <p className="text-xs text-gray-400 text-center">
              Join over 10,000 athletes who trust Strongwill Sports. 
              Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}