import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the popup or signed up
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
    const hasSignedUp = localStorage.getItem("newsletter-signed-up");
    
    if (!hasSeenPopup && !hasSignedUp) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("newsletter-popup-seen", "true");
      }, 3000); // Show after 3 seconds for first-time visitors
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", {
        email: email.trim(),
        source: "popup"
      });

      localStorage.setItem("newsletter-signed-up", "true");
      setIsOpen(false);
      
      toast({
        title: "Welcome to our newsletter!",
        description: "You'll receive updates about new products and exclusive offers.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter-popup-seen", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-white dark:bg-black border-2 border-black dark:border-white">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white">
            <Mail className="h-5 w-5 text-white dark:text-black" />
          </div>
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            Join Team Strongwill
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Get exclusive access to new products, team discounts, and insider updates.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          {/* Limited Time Offer */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-black dark:border-white">
            <p className="text-black dark:text-white font-semibold text-sm mb-1">⚡ Limited Time Offer</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Sign up now and receive <span className="text-black dark:text-white font-bold">free shipping</span> on your first order!
              <span className="text-xs block text-gray-500 dark:text-gray-500">*Terms and conditions apply</span>
            </p>
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              {isSubmitting ? "Joining..." : "Join Now"}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  );
}