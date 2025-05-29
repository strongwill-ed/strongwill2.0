import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-logo italic text-2xl font-bold mb-4 block">
              Strongwillsports
            </span>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Premium custom athletic apparel for champions who never settle for ordinary.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/products?category=1">
                  <span className="hover:text-white transition-colors cursor-pointer">Wrestling Singlets</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=4">
                  <span className="hover:text-white transition-colors cursor-pointer">Team Jerseys</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=2">
                  <span className="hover:text-white transition-colors cursor-pointer">Custom Hoodies</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=3">
                  <span className="hover:text-white transition-colors cursor-pointer">Athletic Shorts</span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="hover:text-white transition-colors cursor-pointer">All Products</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/design-tool">
                  <span className="hover:text-white transition-colors cursor-pointer">Custom Design Tool</span>
                </Link>
              </li>
              <li>
                <Link href="/group-orders">
                  <span className="hover:text-white transition-colors cursor-pointer">Group Orders</span>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Team Partnerships</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Bulk Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Rush Orders</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">Size Guide</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Return Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-white transition-colors cursor-pointer">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Strongwill Sports. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
