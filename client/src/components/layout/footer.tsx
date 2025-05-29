import { Link } from "wouter";
import { NewsletterSubscription } from "@/components/newsletter/newsletter-subscription";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SiTiktok, SiOnlyfans } from "react-icons/si";
import { useState } from "react";

export function Footer() {
  const [showRickRoll, setShowRickRoll] = useState(false);

  const handleOnlyFansClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRickRoll(true);
    
    // After 4 seconds, hide the video and redirect to homepage
    setTimeout(() => {
      setShowRickRoll(false);
      window.location.href = '/';
    }, 4000);
  };

  return (
    <>
      {showRickRoll && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <iframe
            width="80%"
            height="80%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1"
            title="Rick Roll"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="max-w-4xl max-h-96"
          />
        </div>
      )}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl italic">
              <span className="font-black">STRONGWILL</span>
              <span className="font-normal">SPORTS</span>
            </h3>
            <p className="text-gray-300 text-sm">
              Premium custom apparel for serious athletes. Create, customize, and compete with confidence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/strongwillsports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/strongwillsports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@strongwillsports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on TikTok"
              >
                <SiTiktok className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/strongwillsports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <button
                onClick={handleOnlyFansClick}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on OnlyFans"
              >
                <SiOnlyfans className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link href="/design-tool" className="text-gray-300 hover:text-white transition-colors">
                  Design Tool
                </Link>
              </li>
              <li>
                <Link href="/group-orders" className="text-gray-300 hover:text-white transition-colors">
                  Group Orders
                </Link>
              </li>
              <li>
                <Link href="/sponsorship" className="text-gray-300 hover:text-white transition-colors">
                  Sponsorship
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@strongwillsports.com" className="text-gray-300 hover:text-white transition-colors">
                  support@strongwillsports.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <NewsletterSubscription variant="footer" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Strongwill Sports. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
        </div>
      </footer>
    </>
  );
}