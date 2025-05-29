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
    // For demo purposes, show popup after 1 second
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    
    return () => clearTimeout(timer);
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
    // Set a reminder to show again after 24 hours if they haven't signed up
    if (!localStorage.getItem("newsletter-signed-up")) {
      setTimeout(() => {
        localStorage.removeItem("newsletter-popup-seen");
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black dark:bg-white">
            <Mail className="h-6 w-6 text-white dark:text-black" />
          </div>
          <DialogTitle className="text-2xl font-bold text-black dark:text-white">
            Join Team Strongwill
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get exclusive access to new products, team discounts, and insider updates from the world of custom sports apparel.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-6">
          {/* Limited Time Offer Box */}
          <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded text-xs font-semibold text-center">
            EXCLUSIVE: FREE SHIPPING ON FIRST ORDER
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