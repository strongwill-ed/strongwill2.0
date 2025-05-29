import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import DesignCanvas from "@/components/design/design-canvas";
import { getApparelTemplate } from "@/components/design/apparel-templates";
import type { Product, Design, InsertDesign, GroupOrder } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Save, ShoppingCart, Download, Undo, Redo, Type, Image, Palette } from "lucide-react";

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotation?: number;
}

export default function DesignTool() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  
  // Get URL params for both regular products and group orders
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");
  const isGroupOrderMode = urlParams.get("groupOrder") === "true";
  const groupOrderData = isGroupOrderMode ? {
    name: urlParams.get("name") || "",
    productId: urlParams.get("productId") || "",
    deadline: urlParams.get("deadline") || "",
    minimumQuantity: parseInt(urlParams.get("minimumQuantity") || "10"),
    description: urlParams.get("description") || "",
    organizerUserId: parseInt(urlParams.get("organizerUserId") || "1")
  } : null;
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(
    productId ? parseInt(productId) : (groupOrderData ? parseInt(groupOrderData.productId) : null)
  );
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [designName, setDesignName] = useState("");
  
  // Cart configuration state
  const [orderItems, setOrderItems] = useState<{[key: string]: number}>({});
  const [addToGroupOrder, setAddToGroupOrder] = useState(false);
  const [selectedGroupOrder, setSelectedGroupOrder] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  
  // Text tool state
  const [textContent, setTextContent] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  
  // Canvas ref
  const canvasRef = useRef<any>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: selectedProductData } = useQuery<Product>({
    queryKey: [`/api/products/${selectedProduct}`],
    enabled: !!selectedProduct,
  });

  const { data: groupOrders = [] } = useQuery<GroupOrder[]>({
    queryKey: ["/api/group-orders"],
  });

  const saveDesignMutation = useMutation({
    mutationFn: async (designData: InsertDesign) => {
      return apiRequest("POST", "/api/designs", designData);
    },
    onSuccess: async (response) => {
      const savedDesign = await response.json();
      
      if (isGroupOrderMode && groupOrderData) {
        // Create group order with the saved design
        const groupOrderPayload = {
          ...groupOrderData,
          productId: parseInt(groupOrderData.productId),
          deadline: new Date(groupOrderData.deadline),
          designId: savedDesign.id,
          orderType: "custom",
          status: "active",
          currentQuantity: 0,
          paymentMode: "individual",
          totalEstimate: "0.00",
        };
        
        try {
          await apiRequest("POST", "/api/group-orders", groupOrderPayload);
          toast({
            title: "Success",
            description: "Design saved and group order created successfully!",
          });
          // Redirect back to group orders page
          window.location.href = "/group-orders";
        } catch (error) {
          toast({
            title: "Error",
            description: "Design saved but failed to create group order",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Design saved successfully!",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save design",
        variant: "destructive",
      });
    },
  });

  const addTextElement = () => {
    if (!textContent.trim()) return;
    
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      content: textContent,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize,
      color: textColor,
      fontFamily,
      rotation: 0,
    };
    
    setDesignElements([...designElements, newElement]);
    setTextContent("");
  };

  const addImageElement = (imageSrc: string) => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'image',
      content: imageSrc,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
    };
    
    setDesignElements([...designElements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setDesignElements(elements =>
      elements.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const addElement = (element: DesignElement) => {
    setDesignElements([...designElements, element]);
  };

  const deleteElement = (id: string) => {
    setDesignElements(elements => elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const saveDesign = () => {
    if (!selectedProduct || !designName.trim()) {
      toast({
        title: "Error",
        description: "Please select a product and enter a design name",
        variant: "destructive",
      });
      return;
    }

    const designData = {
      name: designName,
      designData: JSON.stringify({
        elements: designElements,
        productId: selectedProduct,
      }),
      productId: selectedProduct,
      userId: 1, // TODO: Get from auth context
      isPublic: false,
    };

    saveDesignMutation.mutate(designData);
  };

  const updateOrderQuantity = (size: string, color: string, quantity: number) => {
    const key = `${size}-${color}`;
    setOrderItems(prev => ({
      ...prev,
      [key]: quantity
    }));
  };

  const getTotalItems = () => {
    return Object.values(orderItems).reduce((sum, qty) => sum + qty, 0);
  };

  const addToCartHandler = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    // Only check quantities for regular cart orders, not group orders
    if (!addToGroupOrder) {
      const totalItems = getTotalItems();
      if (totalItems === 0) {
        toast({
          title: "Error",
          description: "Please select at least one item",
          variant: "destructive",
        });
        return;
      }
    }

    if (addToGroupOrder) {
      // Handle group order
      addToGroupOrderHandler();
    } else {
      // Handle regular cart order
      const totalItems = getTotalItems();
      
      // Add each size/color combination to cart
      Object.entries(orderItems).forEach(([key, quantity]) => {
        if (quantity > 0) {
          const [size, color] = key.split('-');
          const cartItem = {
            userId: 1, // TODO: Get from auth context
            productId: selectedProduct,
            quantity,
            size,
            color,
            customizations: JSON.stringify({
              elements: designElements,
              designName,
            }),
          };
          addToCart(cartItem);
        }
      });

      toast({
        title: "Success",
        description: `${getTotalItems()} item(s) added to cart!`,
      });
    }
  };

  const addToGroupOrderHandler = async () => {
    if (!selectedProduct || !selectedGroupOrder) {
      toast({
        title: "Error",
        description: "Please select a product and group order",
        variant: "destructive",
      });
      return;
    }

    try {
      // For group orders, just add the design without specific quantities
      // Members will select their own sizes/colors when joining
      await apiRequest("POST", `/api/group-orders/${selectedGroupOrder}/join`, {
        userId: 1, // TODO: Get from auth context
        quantity: 1, // Default quantity for group order design
        size: "M", // Default size, members will choose their own
        color: "Black", // Default color, members will choose their own
        participantName: "Current User", // TODO: Get from auth context
        participantEmail: "user@example.com", // TODO: Get from auth context
        nickname: nickname.trim() || null,
        customizations: JSON.stringify({
          elements: designElements,
          designName,
        }),
      });

      toast({
        title: "Success",
        description: "Design added to group order! Members can now select their sizes and colors.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add items to group order",
        variant: "destructive",
      });
    }
  };

  const exportDesign = () => {
    try {
      // Find the actual canvas element within the canvas container
      const canvasElement = document.querySelector('#design-canvas canvas') as HTMLCanvasElement;
      if (!canvasElement) {
        toast({
          title: "Error",
          description: "Canvas not ready for export",
          variant: "destructive",
        });
        return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${designName || 'design'}.png`;
      link.href = canvasElement.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Design exported successfully!",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export design",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Design Tool</h1>
              {isGroupOrderMode && groupOrderData ? (
                <div className="mt-2">
                  <p className="text-blue-600 font-medium">Creating design template for: {groupOrderData.name}</p>
                  <p className="text-gray-600 text-sm">This design will be used as the template for your group order</p>
                </div>
              ) : (
                <p className="text-gray-600 mt-1">Create your perfect custom apparel design</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={exportDesign}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" onClick={saveDesign} disabled={saveDesignMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveDesignMutation.isPending ? "Creating..." : (isGroupOrderMode ? "Create Group Order" : "Save")}
              </Button>
              {addToGroupOrder ? (
                <Button onClick={addToGroupOrderHandler} className="btn-primary">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Group Order ({getTotalItems()})
                </Button>
              ) : (
                <Button onClick={addToCartHandler} className="btn-primary">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart ({getTotalItems()})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Design Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="product" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="graphics">
                      <Image className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="colors">
                      <Palette className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="product" className="space-y-4">
                    <div>
                      <Label htmlFor="design-name">Design Name</Label>
                      <Input
                        id="design-name"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        placeholder="Enter design name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-select">Product</Label>
                      <Select 
                        value={selectedProduct?.toString() || ""} 
                        onValueChange={(value) => setSelectedProduct(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} - ${product.basePrice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedProductData && (
                      <div className="space-y-4">
                        <Label>Order Configuration</Label>
                        
                        <div className="space-y-3 pt-4 border-t">
                          <Label>Order Type</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="group-order-toggle"
                              checked={addToGroupOrder}
                              onChange={(e) => setAddToGroupOrder(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="group-order-toggle" className="text-sm">
                              Add to existing group order
                            </Label>
                          </div>
                        </div>

                        {!addToGroupOrder && (
                          <>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-xs text-blue-800">
                                Enter quantities for each size/color combination you want to order.
                              </p>
                            </div>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {selectedProductData.sizes?.map((size) => (
                                <div key={size} className="space-y-2">
                                  <Label className="text-sm font-medium">{size}</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {selectedProductData.colors?.map((color) => (
                                      <div key={`${size}-${color}`} className="flex items-center space-x-2">
                                        <Label className="text-xs min-w-0 flex-1 truncate">{color}</Label>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="50"
                                          value={orderItems[`${size}-${color}`] || 0}
                                          onChange={(e) => updateOrderQuantity(size, color, parseInt(e.target.value) || 0)}
                                          className="w-16 h-8 text-xs"
                                          placeholder="0"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              Total items: {getTotalItems()}
                            </div>
                          </>
                        )}

                        {addToGroupOrder && (
                          <>
                            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-xs text-green-800">
                                For group orders, members will select their own sizes and colors when joining. No quantity selection needed here.
                              </p>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="group-order-select">Select Group Order</Label>
                                <Select 
                                  value={selectedGroupOrder?.toString() || ""} 
                                  onValueChange={(value) => setSelectedGroupOrder(parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a group order" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {groupOrders.filter((order: any) => order.status === 'active').map((order: any) => (
                                      <SelectItem key={order.id} value={order.id.toString()}>
                                        {order.name} (Due: {new Date(order.deadline).toLocaleDateString()})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="nickname-input">Nickname (Optional)</Label>
                                <Input
                                  id="nickname-input"
                                  value={nickname}
                                  onChange={(e) => setNickname(e.target.value)}
                                  placeholder="Enter team nickname (e.g., Captain, Striker)"
                                  maxLength={50}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  This will help identify you in the team order
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text-content">Text</Label>
                      <Textarea
                        id="text-content"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Enter your text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="font-size">Font Size</Label>
                      <Input
                        id="font-size"
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        min="8"
                        max="72"
                      />
                    </div>

                    <div>
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Impact">Impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text-color">Color</Label>
                      <Input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </div>

                    <Button onClick={addTextElement} className="w-full btn-primary">
                      Add Text
                    </Button>
                  </TabsContent>

                  <TabsContent value="graphics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&h=100&fit=crop",
                      ].map((src, index) => (
                        <button
                          key={index}
                          onClick={() => addImageElement(src)}
                          className="aspect-square rounded border-2 border-gray-200 hover:border-black transition-colors"
                        >
                          <img src={src} alt={`Graphic ${index + 1}`} className="w-full h-full object-cover rounded" />
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <Label htmlFor="image-upload">Upload Image</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = e.target?.result as string;
                              addImageElement(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "#000000", "#FFFFFF", "#FF0000", "#00FF00",
                        "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
                        "#800000", "#008000", "#000080", "#808000",
                        "#800080", "#008080", "#C0C0C0", "#808080"
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className="w-full aspect-square rounded border-2 border-gray-300 hover:border-black transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Elements List */}
            {designElements.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Design Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {designElements.map((element) => (
                      <div 
                        key={element.id} 
                        className={`p-2 rounded border cursor-pointer ${
                          selectedElement === element.id ? 'border-black bg-gray-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {element.type === 'text' ? element.content : 'Image'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(element.id);
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Design Canvas</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DesignCanvas
                  ref={canvasRef}
                  product={selectedProductData}
                  elements={designElements}
                  selectedElement={selectedElement}
                  onElementSelect={setSelectedElement}
                  onElementUpdate={updateElement}
                  onElementAdd={addElement}
                  onElementDelete={deleteElement}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
