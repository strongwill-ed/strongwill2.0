import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import AddToCartModal from "@/components/product/add-to-cart-modal";
import SEOHead from "@/components/seo/seo-head";
import type { Product, ProductCategory } from "@shared/schema";
import { Search, Filter, Grid3X3, List, SlidersHorizontal } from "lucide-react";

export default function Products() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  // Get category from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", categoryFromUrl || selectedCategory],
    queryFn: async () => {
      const url = selectedCategory !== "all" 
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Set initial category from URL
  useState(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || product.categoryId?.toString() === selectedCategory;
      const matchesPrice = parseFloat(product.basePrice) >= priceRange[0] && parseFloat(product.basePrice) <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.basePrice) - parseFloat(b.basePrice);
        case "price-high":
          return parseFloat(b.basePrice) - parseFloat(a.basePrice);
        case "newest":
          return b.id - a.id; // Assuming higher ID = newer
        case "rating":
          return Math.random() - 0.5; // Mock rating sort
        case "popular":
          return Math.random() - 0.5; // Mock popularity sort
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const isLoading = categoriesLoading || productsLoading;

  const categoryName = selectedCategory === "all" 
    ? "All Products" 
    : categories?.find(cat => cat.id.toString() === selectedCategory)?.name || "Products";

  const seoTitle = `${categoryName} - Custom Athletic Apparel | Strongwill Sports`;
  const seoDescription = `Shop premium ${categoryName.toLowerCase()} at Strongwill Sports. Custom athletic apparel with advanced design tools, team uniforms, and wrestling singlets.`;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="custom athletic apparel, wrestling singlets, team uniforms, sports clothing, custom design"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": categoryName,
          "description": seoDescription,
          "url": `${window.location.origin}/products`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredProducts.length,
            "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "description": product.description,
              "image": product.imageUrl,
              "offers": {
                "@type": "Offer",
                "price": product.basePrice,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }))
          }
        }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse our complete collection of premium custom athletic apparel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Results Count and View Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredProducts.length} Products
              </h2>
              {searchQuery && (
                <Badge variant="secondary" className="text-sm">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="text-sm">
                  {categories.find(cat => cat.id.toString() === selectedCategory)?.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSortBy("name");
              }}
              className="btn-secondary"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-primary"
            >
              Show All Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onDesignClick={() => setLocation(`/design-tool?product=${product.id}`)}
                  onAddToCart={() => {
                    setSelectedProduct(product);
                    setIsCartModalOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-300 mb-6">
            Contact our team for custom product development and special requests.
          </p>
          <Button 
            variant="secondary"
            size="lg"
            onClick={() => setLocation("/contact")}
            className="bg-white text-black hover:bg-gray-100"
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        product={selectedProduct}
        isOpen={isCartModalOpen}
        onClose={() => {
          setIsCartModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
    </>
  );
}
