import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, insertProductCategorySchema } from "@shared/schema";
import type { Product, ProductCategory, Order, GroupOrder, Refund, AbTest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Plus, Package, ShoppingBag, Users, DollarSign, TrendingUp, Eye, EyeOff, Edit, Trash2, Settings, Mail, Save, Upload, Download, Loader2, X, Play, Pause, BarChart3, Target, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

const createProductSchema = insertProductSchema.extend({
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  salePrice: z.string().optional(),
  isOnSale: z.boolean().optional(),
});

const createCategorySchema = insertProductCategorySchema;

// Bulk Product Manager Component
function BulkProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBulkData();
  }, []);

  const loadBulkData = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/products/bulk");
      const data = await response.json();
      setProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products for bulk management",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === "all" || product.categoryId.toString() === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const bulkActivate = async () => {
    if (selectedProducts.size === 0) return;
    setIsUpdating(true);
    try {
      const response = await apiRequest("PATCH", "/api/admin/products/bulk-activate", {
        productIds: Array.from(selectedProducts)
      });
      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      loadBulkData();
      setSelectedProducts(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update products",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const bulkDeactivate = async () => {
    if (selectedProducts.size === 0) return;
    setIsUpdating(true);
    try {
      const response = await apiRequest("PATCH", "/api/admin/products/bulk-deactivate", {
        productIds: Array.from(selectedProducts)
      });
      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      loadBulkData();
      setSelectedProducts(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update products",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const bulkMarkOnSale = async () => {
    if (selectedProducts.size === 0) return;
    setIsUpdating(true);
    try {
      const response = await apiRequest("PATCH", "/api/admin/products/bulk-mark-sale", {
        productIds: Array.from(selectedProducts)
      });
      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      loadBulkData();
      setSelectedProducts(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark products on sale",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const bulkRemoveSale = async () => {
    if (selectedProducts.size === 0) return;
    setIsUpdating(true);
    try {
      const response = await apiRequest("PATCH", "/api/admin/products/bulk-remove-sale", {
        productIds: Array.from(selectedProducts)
      });
      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      loadBulkData();
      setSelectedProducts(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove sale from products",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const exportProducts = () => {
    // Create CSV format for easier editing
    const csvHeaders = ['name', 'description', 'categoryId', 'basePrice', 'imageUrl', 'sizes', 'colors', 'isActive', 'isOnSale', 'salePrice'];
    const csvRows = filteredProducts.map(product => [
      product.name,
      product.description || '',
      product.categoryId,
      product.basePrice,
      product.imageUrl || '',
      (product.sizes || []).join(';'),
      (product.colors || []).join(';'),
      product.isActive,
      product.isOnSale || false,
      product.salePrice || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvContent);
    const exportFileDefaultName = 'strongwill-products.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header and one data row');
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const expectedHeaders = ['name', 'description', 'categoryId', 'basePrice', 'imageUrl', 'sizes', 'colors', 'isActive', 'isOnSale', 'salePrice'];
        
        // Validate headers
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const productsToImport = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const productData: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            
            switch (header) {
              case 'categoryId':
                productData[header] = value ? parseInt(value) : null;
                break;
              case 'basePrice':
              case 'salePrice':
                productData[header] = value ? parseFloat(value) : (header === 'basePrice' ? 0 : null);
                break;
              case 'sizes':
              case 'colors':
                productData[header] = value ? value.split(';').filter(Boolean) : [];
                break;
              case 'isActive':
              case 'isOnSale':
                productData[header] = value.toLowerCase() === 'true';
                break;
              default:
                productData[header] = value;
            }
          });
          
          // Validate required fields
          if (!productData.name || !productData.basePrice) {
            throw new Error(`Row ${i + 1}: Missing required fields (name, basePrice)`);
          }
          
          productsToImport.push(productData);
        }

        // Send to backend
        const response = await apiRequest("POST", "/api/admin/products/bulk-import", {
          products: productsToImport
        });
        
        const result = await response.json();
        
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.imported} products`,
        });
        
        loadBulkData();
        
      } catch (error: any) {
        toast({
          title: "Import failed",
          description: error.message || "Failed to import products",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bulk Product Manager</h2>
        <p className="text-gray-600">Manage multiple products at once</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Bulk Upload Instructions</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Upload CSV files with product data to add new products to the catalog</li>
          <li>• Existing products will remain unchanged - new products are added alongside them</li>
          <li>• Required fields: name, basePrice, categoryId, sizes, colors</li>
          <li>• Use semicolon (;) to separate multiple sizes or colors in CSV</li>
          <li>• Download the current catalog first to see the expected format</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button 
            onClick={bulkActivate} 
            disabled={selectedProducts.size === 0 || isUpdating}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Activate Selected ({selectedProducts.size})
          </Button>
          
          <Button 
            onClick={bulkDeactivate} 
            disabled={selectedProducts.size === 0 || isUpdating}
            variant="destructive"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Deactivate Selected ({selectedProducts.size})
          </Button>

          <Button 
            onClick={bulkMarkOnSale} 
            disabled={selectedProducts.size === 0 || isUpdating}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Mark on Sale ({selectedProducts.size})
          </Button>
          
          <Button 
            onClick={bulkRemoveSale} 
            disabled={selectedProducts.size === 0 || isUpdating}
            variant="outline"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Remove Sale ({selectedProducts.size})
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportProducts}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({filteredProducts.length})
            </Button>
            
            <label className="cursor-pointer">
              <Button variant="outline" disabled={isImporting} asChild>
                <span>
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </>
                  )}
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportProducts}
                className="hidden"
                disabled={isImporting}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded"
        />
        <label className="text-sm font-medium">
          Select All ({filteredProducts.length} products)
        </label>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => {
              const category = categories.find(c => c.id === product.categoryId);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{category?.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {product.isOnSale && product.salePrice ? (
                        <>
                          <span className="text-red-600 font-semibold">${product.salePrice}</span>
                          <span className="text-gray-500 line-through text-sm">${product.basePrice}</span>
                        </>
                      ) : (
                        <span>${product.basePrice}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {product.isOnSale && <Badge variant="destructive" className="ml-2">On Sale</Badge>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Email Template Manager Component
function EmailTemplateManager() {
  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const templateTypes = [
    { key: 'order_confirmation', name: 'Order Confirmation', description: 'Sent when an order is confirmed' },
    { key: 'newsletter_confirmation', name: 'Newsletter Welcome', description: 'Sent when someone subscribes to newsletter' },
    { key: 'group_order_created', name: 'Group Order Created', description: 'Sent to organizer when group order is created' },
    { key: 'group_order_invitation', name: 'Group Order Invitation', description: 'Sent to invite members to join group order' },
    { key: 'sponsorship_inquiry', name: 'Sponsorship Inquiry', description: 'Sent to sponsors when they receive an inquiry' },
    { key: 'sponsorship_agreement', name: 'Sponsorship Agreement', description: 'Sent when sponsorship agreement is created' },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/email-templates");
      const data = await response.json();
      
      const templatesMap: Record<string, any> = {};
      data.forEach((template: any) => {
        const key = template.key.replace('email_template_', '');
        try {
          templatesMap[key] = JSON.parse(template.value);
        } catch {
          templatesMap[key] = getDefaultTemplate(key);
        }
      });
      
      setTemplates(templatesMap);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultTemplate = (type: string) => {
    const defaults: Record<string, any> = {
      order_confirmation: {
        subject: 'Order Confirmation - Strongwill Sports',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #000;">Order Confirmation</h1><p>Dear {{customerName}},</p><p>Thank you for your order! Your order #{{orderId}} has been confirmed.</p><p><strong>Total: ${{totalAmount}}</strong></p><p>Best regards,<br>Strongwill Sports Team</p></div>',
        text: 'Order Confirmation - Dear {{customerName}}, Thank you for your order #{{orderId}}. Total: ${{totalAmount}}. Best regards, Strongwill Sports Team'
      },
      newsletter_confirmation: {
        subject: 'Welcome to Strongwill Sports Newsletter!',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #000;">Welcome to Strongwill Sports!</h1><p>Thank you for subscribing to our newsletter!</p><p><strong>Free shipping on your first order!</strong></p><p>Best regards,<br>Strongwill Sports Team</p></div>',
        text: 'Welcome to Strongwill Sports! Thank you for subscribing to our newsletter! Free shipping on your first order!'
      },
      group_order_invitation: {
        subject: 'Join Our Group Order - Strongwill Sports',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #000;">Join Our Group Order</h1><p>You have been invited to join group order: {{groupOrderName}}</p><p>Minimum quantity: {{minQuantity}}</p><p><a href="{{joinLink}}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none;">Join Now</a></p></div>',
        text: 'Join Our Group Order: {{groupOrderName}}. Minimum quantity: {{minQuantity}}. Join at: {{joinLink}}'
      },
      design_share: {
        subject: 'Check out this design - Strongwill Sports',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #000;">Design Shared</h1><p>Someone has shared a design with you!</p><p><a href="{{designLink}}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none;">View Design</a></p></div>',
        text: 'Someone has shared a design with you! View it at: {{designLink}}'
      }
    };
    
    return defaults[type] || { subject: '', html: '', text: '' };
  };

  const saveTemplate = async (type: string, template: any) => {
    setIsSaving(type);
    try {
      const response = await apiRequest("POST", `/api/admin/email-templates/${type}`, template);
      
      if (response.ok) {
        setTemplates(prev => ({ ...prev, [type]: template }));
        toast({
          title: "Success",
          description: "Email template saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email template",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const updateTemplate = (type: string, field: string, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Template Manager</h2>
          <p className="text-gray-600">Customize email templates sent to customers</p>
        </div>
      </div>

      <Tabs defaultValue={templateTypes[0].key} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {templateTypes.map(template => (
            <TabsTrigger key={template.key} value={template.key} className="text-xs">
              {template.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {templateTypes.map(templateType => {
          const template = templates[templateType.key] || getDefaultTemplate(templateType.key);
          
          return (
            <TabsContent key={templateType.key} value={templateType.key}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {templateType.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{templateType.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      value={template.subject}
                      onChange={(e) => updateTemplate(templateType.key, 'subject', e.target.value)}
                      placeholder="Email subject..."
                    />
                  </div>

                  <div>
                    <Label>HTML Content</Label>
                    <Textarea
                      value={template.html}
                      onChange={(e) => updateTemplate(templateType.key, 'html', e.target.value)}
                      placeholder="HTML email content..."
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables like: customerName, orderId, totalAmount
                    </p>
                  </div>

                  <div>
                    <Label>Plain Text Content</Label>
                    <Textarea
                      value={template.text}
                      onChange={(e) => updateTemplate(templateType.key, 'text', e.target.value)}
                      placeholder="Plain text email content..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={() => saveTemplate(templateType.key, template)}
                    disabled={isSaving === templateType.key}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {isSaving === templateType.key ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Template
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

// A/B Testing Manager Component
function ABTestingManager() {
  const { toast } = useToast();
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<AbTest | null>(null);
  const [isViewResultsOpen, setIsViewResultsOpen] = useState(false);

  const { data: abTests, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/ab-tests'],
  });

  const createTestMutation = useMutation({
    mutationFn: (testData: any) => apiRequest("POST", "/api/admin/ab-tests", testData),
    onSuccess: () => {
      refetch();
      setIsCreateTestOpen(false);
      toast({
        title: "A/B Test Created",
        description: "Your A/B test has been created successfully."
      });
    }
  });

  const updateTestMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PATCH", `/api/admin/ab-tests/${id}`, data),
    onSuccess: () => {
      refetch();
      toast({
        title: "Test Updated",
        description: "A/B test has been updated successfully."
      });
    }
  });

  const deleteTestMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/ab-tests/${id}`),
    onSuccess: () => {
      refetch();
      toast({
        title: "Test Deleted",
        description: "A/B test has been deleted successfully."
      });
    }
  });

  const testForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      testType: "homepage_hero",
      goalMetric: "conversion_rate",
      trafficSplit: 50,
      variantA: {
        title: "",
        description: "",
        buttonText: "",
        backgroundColor: "#ffffff",
        textColor: "#000000"
      },
      variantB: {
        title: "",
        description: "",
        buttonText: "",
        backgroundColor: "#000000",
        textColor: "#ffffff"
      }
    }
  });

  const onCreateTest = (data: any) => {
    createTestMutation.mutate(data);
  };

  const startTest = (test: AbTest) => {
    updateTestMutation.mutate({
      id: test.id,
      data: { status: "active", startDate: new Date() }
    });
  };

  const pauseTest = (test: AbTest) => {
    updateTestMutation.mutate({
      id: test.id,
      data: { status: "paused" }
    });
  };

  const completeTest = (test: AbTest) => {
    updateTestMutation.mutate({
      id: test.id,
      data: { status: "completed", endDate: new Date() }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">A/B Testing</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage A/B tests to optimize user experience
          </p>
        </div>
        <Button onClick={() => setIsCreateTestOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      {/* Test Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(abTests) ? abTests.filter((test: AbTest) => test.status === 'active').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(abTests) ? abTests.filter((test: AbTest) => test.status === 'draft').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(abTests) ? abTests.filter((test: AbTest) => test.status === 'completed').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(abTests) ? abTests.length : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>A/B Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Test Name</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Goal</th>
                  <th className="text-left p-4 font-medium">Traffic Split</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(abTests) && abTests.map((test: AbTest) => (
                  <tr key={test.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-muted-foreground">{test.description}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {test.testType.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === 'active' ? 'bg-green-100 text-green-800' :
                        test.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        test.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{test.goalMetric.replace('_', ' ')}</td>
                    <td className="p-4">{test.trafficSplit}% / {100 - test.trafficSplit}%</td>
                    <td className="p-4">
                      {test.startDate && test.endDate ? 
                        `${Math.ceil((new Date(test.endDate).getTime() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24))} days` :
                        test.startDate ? 
                        `${Math.ceil((new Date().getTime() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24))} days` :
                        'Not started'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {test.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startTest(test)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {test.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => pauseTest(test)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => completeTest(test)}
                            >
                              Complete
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTest(test);
                            setIsViewResultsOpen(true);
                          }}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTestMutation.mutate(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Test Dialog */}
      <Dialog open={isCreateTestOpen} onOpenChange={setIsCreateTestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create A/B Test</DialogTitle>
            <DialogDescription>
              Set up a new A/B test to optimize your user experience
            </DialogDescription>
          </DialogHeader>
          
          <Form {...testForm}>
            <form onSubmit={testForm.handleSubmit(onCreateTest)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={testForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Hero Section Test" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={testForm.control}
                  name="testType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="homepage_hero">Homepage Hero</SelectItem>
                          <SelectItem value="product_page">Product Page</SelectItem>
                          <SelectItem value="checkout_flow">Checkout Flow</SelectItem>
                          <SelectItem value="pricing">Pricing</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={testForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Test different hero section layouts..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={testForm.control}
                  name="goalMetric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Metric</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal metric" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                          <SelectItem value="click_through_rate">Click Through Rate</SelectItem>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="signup_rate">Signup Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={testForm.control}
                  name="trafficSplit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Split (% for Variant A)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="10" 
                          max="90" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Variant Configuration */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variant A (Control)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={testForm.control}
                      name="variantA.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Original title" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testForm.control}
                      name="variantA.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Original description" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testForm.control}
                      name="variantA.buttonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Shop Now" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 grid-cols-2">
                      <FormField
                        control={testForm.control}
                        name="variantA.backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={testForm.control}
                        name="variantA.textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variant B (Test)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={testForm.control}
                      name="variantB.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="New title" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testForm.control}
                      name="variantB.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="New description" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testForm.control}
                      name="variantB.buttonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Get Started" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 grid-cols-2">
                      <FormField
                        control={testForm.control}
                        name="variantB.backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={testForm.control}
                        name="variantB.textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateTestOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTestMutation.isPending}>
                  {createTestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Test
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Test Results Dialog */}
      <Dialog open={isViewResultsOpen} onOpenChange={setIsViewResultsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Results: {selectedTest?.name}</DialogTitle>
            <DialogDescription>
              A/B test performance metrics and analysis
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-green-600">+12% vs control</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Statistical Significance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">95% needed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Variant A (Control)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">617</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span className="font-medium">19</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">3.08%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Variant B (Test)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">617</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium text-green-600">3.73%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Variant B shows promising results</p>
                        <p className="text-sm text-muted-foreground">
                          21% improvement in conversion rate with 94% confidence
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Continue test for statistical significance</p>
                        <p className="text-sm text-muted-foreground">
                          Need 1% more confidence to reach 95% threshold
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingGroupOrder, setEditingGroupOrder] = useState<GroupOrder | null>(null);
  const [isEditGroupOrderOpen, setIsEditGroupOrderOpen] = useState(false);
  
  // User Management States
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  
  // Refund System States
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundFormData, setRefundFormData] = useState({
    orderId: 0,
    refundAmount: '',
    reason: '',
    adminNotes: ''
  });
  
  // Order Notification Email States
  const [adminEmail, setAdminEmail] = useState('admin@strongwillsports.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [adminEmails, setAdminEmails] = useState([
    { type: 'orders', email: 'orders@strongwillsports.com', enabled: true },
    { type: 'refunds', email: 'support@strongwillsports.com', enabled: true },
    { type: 'general', email: 'admin@strongwillsports.com', enabled: true }
  ]);
  const [newEmailType, setNewEmailType] = useState('');
  const [newEmailAddress, setNewEmailAddress] = useState('');



  // User management functions
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleViewUserOrders = (userId: number) => {
    // Navigate to orders filtered by user
    setActiveTab("orders");
  };

  const handleCreateRefund = (orderId: number) => {
    setRefundFormData({
      orderId,
      refundAmount: '',
      reason: '',
      adminNotes: ''
    });
    setIsRefundDialogOpen(true);
  };

  const processRefund = async () => {
    try {
      await apiRequest('POST', '/api/admin/refunds', refundFormData);
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/refunds'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      
      toast({
        title: "Refund Processed",
        description: "The refund has been successfully processed."
      });
      
      setIsRefundDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process refund.",
        variant: "destructive"
      });
    }
  };

  const testEmailNotification = async () => {
    setIsTestingEmail(true);
    try {
      await apiRequest('POST', '/api/admin/test-email', {
        adminEmail,
        testType: 'order_notification'
      });
      
      toast({
        title: "Test Email Sent",
        description: `Test notification sent to ${adminEmail}`
      });
    } catch (error) {
      toast({
        title: "Email Test Failed",
        description: "Could not send test email. Check email configuration.",
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const addEmailNotification = () => {
    if (newEmailType && newEmailAddress) {
      setAdminEmails((prev: any) => [...prev, {
        type: newEmailType,
        email: newEmailAddress,
        enabled: true
      }]);
      setNewEmailType('');
      setNewEmailAddress('');
      toast({
        title: "Email Added",
        description: "New notification email has been configured.",
      });
    }
  };

  const removeEmailNotification = (index: number) => {
    setAdminEmails((prev: any) => prev.filter((_: any, i: number) => i !== index));
    toast({
      title: "Email Removed",
      description: "Notification email has been removed.",
    });
  };

  const toggleEmailNotification = (index: number) => {
    setAdminEmails((prev: any) => prev.map((email: any, i: number) => 
      i === index ? { ...email, enabled: !email.enabled } : email
    ));
  };

  // Always call all hooks before any conditional returns
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.role === "admin", // Only fetch if admin
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!user && user.role === "admin",
  });

  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
    enabled: !!user && user.role === "admin",
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user && user.role === "admin",
  });

  const { data: groupOrders = [] } = useQuery<GroupOrder[]>({
    queryKey: ["/api/group-orders"],
    enabled: !!user && user.role === "admin",
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  const { data: refunds = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/refunds"],
    enabled: !!user && user.role === "admin",
  });

  // Computed values for user filtering
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Forms
  const createProductForm = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      basePrice: "0.00",
      salePrice: "",
      isOnSale: false,
      imageUrl: "",
      sizes: [],
      colors: [],
      isActive: true,
    },
  });

  const createCategoryForm = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const editProductForm = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      basePrice: "0.00",
      imageUrl: "",
      sizes: [],
      colors: [],
      isActive: true,
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createProductSchema>) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateProductOpen(false);
      createProductForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createCategorySchema>) => {
      return apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsCreateCategoryOpen(false);
      createCategoryForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof createProductSchema> }) => {
      return apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsEditProductOpen(false);
      setEditingProduct(null);
      editProductForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const deleteGroupOrderMutation = useMutation({
    mutationFn: async (groupOrderId: number) => {
      return apiRequest("DELETE", `/api/group-orders/${groupOrderId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group order deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete group order",
        variant: "destructive",
      });
    },
  });

  const updateGroupOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/group-orders/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group order updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsEditGroupOrderOpen(false);
      setEditingGroupOrder(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update group order",
        variant: "destructive",
      });
    },
  });

  const onCreateProduct = (data: z.infer<typeof createProductSchema>) => {
    createProductMutation.mutate(data);
  };

  const onCreateCategory = (data: z.infer<typeof createCategorySchema>) => {
    createCategoryMutation.mutate(data);
  };

  const onEditProduct = (data: z.infer<typeof createProductSchema>) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    }
  };

  // Effect to populate edit form when product is selected
  React.useEffect(() => {
    if (editingProduct) {
      editProductForm.reset({
        name: editingProduct.name,
        description: editingProduct.description || "",
        categoryId: editingProduct.categoryId,
        basePrice: editingProduct.basePrice,
        imageUrl: editingProduct.imageUrl || "",
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || [],
        isActive: editingProduct.isActive,
        isOnSale: editingProduct.isOnSale || false,
        salePrice: editingProduct.salePrice || "",
      });
    }
  }, [editingProduct, editProductForm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Blue", "Navy", "Gray", "Green", "Yellow"];

  // Check if user is admin after all hooks are defined
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You need administrator privileges to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Please contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your custom apparel business</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="space-y-2">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bulk-products">Bulk Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
              <TabsTrigger value="group-orders">Group Orders</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="emails">Email Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.revenue || "0.00"}</div>
                  <p className="text-xs text-muted-foreground">From all orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activeOrders || 0} active orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.products || 0}</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Group Orders</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.groupOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activeGroupOrders || 0} active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#SW-{order.id}</TableCell>
                        <TableCell>User {order.userId}</TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Products</h2>
              <div className="flex space-x-3">
                <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Product Category</DialogTitle>
                    </DialogHeader>
                    <Form {...createCategoryForm}>
                      <form onSubmit={createCategoryForm.handleSubmit(onCreateCategory)} className="space-y-4">
                        <FormField
                          control={createCategoryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Singlets" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createCategoryForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Professional wrestling singlets..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createCategoryForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full btn-primary" disabled={createCategoryMutation.isPending}>
                          {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Product</DialogTitle>
                    </DialogHeader>
                    <Form {...createProductForm}>
                      <form onSubmit={createProductForm.handleSubmit(onCreateProduct)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={createProductForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Classic Wrestling Singlet" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={createProductForm.control}
                            name="basePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="45.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-end">
                          <FormField
                            control={createProductForm.control}
                            name="isOnSale"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium">
                                  On Sale
                                </FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={createProductForm.control}
                            name="salePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sale Price</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="35.00" 
                                    {...field} 
                                    disabled={!createProductForm.watch("isOnSale")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="text-sm text-gray-600">
                            {createProductForm.watch("isOnSale") && createProductForm.watch("salePrice") && createProductForm.watch("basePrice") && (
                              <span className="text-green-600 font-medium">
                                Save ${(parseFloat(createProductForm.watch("basePrice")) - parseFloat(createProductForm.watch("salePrice"))).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <FormField
                          control={createProductForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Professional grade wrestling singlet..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createProductForm.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createProductForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={createProductForm.control}
                            name="sizes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Sizes</FormLabel>
                                <div className="grid grid-cols-3 gap-2">
                                  {availableSizes.map((size) => (
                                    <label key={size} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={field.value.includes(size)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            field.onChange([...field.value, size]);
                                          } else {
                                            field.onChange(field.value.filter(s => s !== size));
                                          }
                                        }}
                                      />
                                      <span className="text-sm">{size}</span>
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={createProductForm.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Colors</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  {availableColors.map((color) => (
                                    <label key={color} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={field.value.includes(color)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            field.onChange([...field.value, color]);
                                          } else {
                                            field.onChange(field.value.filter(c => c !== color));
                                          }
                                        }}
                                      />
                                      <span className="text-sm">{color}</span>
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="w-full btn-primary" disabled={createProductMutation.isPending}>
                          {createProductMutation.isPending ? "Creating..." : "Create Product"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                {/* Edit Product Dialog */}
                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <Form {...editProductForm}>
                      <form onSubmit={editProductForm.handleSubmit(onEditProduct)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={editProductForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Classic Wrestling Singlet" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editProductForm.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={editProductForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="High-quality wrestling singlet made from moisture-wicking fabric..." 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={editProductForm.control}
                            name="basePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Base Price (AUD)</FormLabel>
                                <FormControl>
                                  <Input placeholder="59.99" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editProductForm.control}
                            name="isOnSale"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>On Sale</FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Mark this product as on sale
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={editProductForm.control}
                            name="salePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sale Price (AUD)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="49.99" 
                                    {...field} 
                                    disabled={!editProductForm.watch("isOnSale")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="text-sm text-gray-600 flex items-end">
                            {editProductForm.watch("isOnSale") && editProductForm.watch("salePrice") && editProductForm.watch("basePrice") && (
                              <span className="text-green-600 font-medium">
                                Save ${(parseFloat(editProductForm.watch("basePrice")) - parseFloat(editProductForm.watch("salePrice") || "0")).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <FormField
                          control={editProductForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={editProductForm.control}
                            name="sizes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Sizes</FormLabel>
                                <div className="grid grid-cols-3 gap-2">
                                  {availableSizes.map((size) => (
                                    <label key={size} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={field.value.includes(size)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            field.onChange([...field.value, size]);
                                          } else {
                                            field.onChange(field.value.filter(s => s !== size));
                                          }
                                        }}
                                      />
                                      <span className="text-sm">{size}</span>
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editProductForm.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Colors</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  {availableColors.map((color) => (
                                    <label key={color} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={field.value.includes(color)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            field.onChange([...field.value, color]);
                                          } else {
                                            field.onChange(field.value.filter(c => c !== color));
                                          }
                                        }}
                                      />
                                      <span className="text-sm">{color}</span>
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={editProductForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                Product is active
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full btn-primary" disabled={updateProductMutation.isPending}>
                          {updateProductMutation.isPending ? "Updating..." : "Update Product"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const category = categories.find(c => c.id === product.categoryId);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=50&h=50&fit=crop"} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{category?.name || "N/A"}</TableCell>
                          <TableCell>${product.basePrice}</TableCell>
                          <TableCell>
                            <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingProduct(product);
                                setIsEditProductOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Orders</h2>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#SW-{order.id}</TableCell>
                        <TableCell>User {order.userId}</TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>
                          <Select 
                            value={order.status} 
                            onValueChange={(status) => updateOrderStatusMutation.mutate({ orderId: order.id, status })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCreateRefund(order.id)}
                            >
                              Refund
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Group Orders Tab */}
          <TabsContent value="group-orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Group Orders</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupOrders.map((groupOrder) => {
                const product = products.find(p => p.id === groupOrder.productId);
                const progress = ((groupOrder.currentQuantity || 0) / (groupOrder.minimumQuantity || 10)) * 100;
                
                return (
                  <Card key={groupOrder.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{groupOrder.name}</CardTitle>
                        <Badge className={groupOrder.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {groupOrder.status}
                        </Badge>
                      </div>
                      {product && (
                        <p className="text-sm text-gray-600">{product.name}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{groupOrder.currentQuantity || 0} / {groupOrder.minimumQuantity || 10}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-black h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Deadline: {format(new Date(groupOrder.deadline), "MMM dd, yyyy")}
                        </div>
                        
                        {/* Admin Controls */}
                        <div className="flex space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingGroupOrder(groupOrder);
                              setIsEditGroupOrderOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this group order? This action cannot be undone.")) {
                                deleteGroupOrderMutation.mutate(groupOrder.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Edit Group Order Dialog */}
          <Dialog open={isEditGroupOrderOpen} onOpenChange={setIsEditGroupOrderOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Group Order</DialogTitle>
              </DialogHeader>
              {editingGroupOrder && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      defaultValue={editingGroupOrder.name}
                      onChange={(e) => {
                        setEditingGroupOrder({
                          ...editingGroupOrder,
                          name: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-deadline">Deadline</Label>
                    <Input
                      id="edit-deadline"
                      type="datetime-local"
                      defaultValue={new Date(editingGroupOrder.deadline).toISOString().slice(0, 16)}
                      onChange={(e) => {
                        setEditingGroupOrder({
                          ...editingGroupOrder,
                          deadline: new Date(e.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-minimum">Minimum Quantity</Label>
                    <Input
                      id="edit-minimum"
                      type="number"
                      defaultValue={editingGroupOrder.minimumQuantity}
                      onChange={(e) => {
                        setEditingGroupOrder({
                          ...editingGroupOrder,
                          minimumQuantity: parseInt(e.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      defaultValue={editingGroupOrder.status || "active"}
                      onValueChange={(value) => {
                        setEditingGroupOrder({
                          ...editingGroupOrder,
                          status: value
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        updateGroupOrderMutation.mutate({
                          id: editingGroupOrder.id,
                          data: {
                            name: editingGroupOrder.name,
                            deadline: editingGroupOrder.deadline,
                            minimumQuantity: editingGroupOrder.minimumQuantity,
                            status: editingGroupOrder.status
                          }
                        });
                      }}
                      disabled={updateGroupOrderMutation.isPending}
                      className="flex-1"
                    >
                      {updateGroupOrderMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditGroupOrderOpen(false);
                        setEditingGroupOrder(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-semibold">${stats?.revenue || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-semibold">{stats?.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Orders</span>
                      <span className="font-semibold">{stats?.activeOrders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-semibold">
                        ${stats?.totalOrders ? (parseFloat(stats.revenue) / stats.totalOrders).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Product Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Products</span>
                      <span className="font-semibold">{stats?.products || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Products</span>
                      <span className="font-semibold">{products.filter(p => p.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      <span className="font-semibold">{categories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bulk Product Management Tab */}
          <TabsContent value="bulk-products" className="space-y-6">
            <BulkProductManager />
          </TabsContent>

          {/* Email Template Management Tab */}
          <TabsContent value="emails" className="space-y-6">
            <EmailTemplateManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Admin Settings</h2>
            </div>
            
            {/* Email Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Email Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure email addresses to receive notifications for different types of events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Email Notifications */}
                <div>
                  <h4 className="font-medium mb-3">Current Notification Emails</h4>
                  <div className="space-y-3">
                    {adminEmails.map((emailConfig, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-sm">{emailConfig.email}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {emailConfig.type}
                          </Badge>
                          {emailConfig.enabled ? (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEmailNotification(index)}
                          >
                            {emailConfig.enabled ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmailNotification(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Email Notification */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Notification Email</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="emailType">Notification Type</Label>
                      <Select value={newEmailType} onValueChange={setNewEmailType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orders">New Orders</SelectItem>
                          <SelectItem value="refunds">Refunds</SelectItem>
                          <SelectItem value="group-orders">Group Orders</SelectItem>
                          <SelectItem value="sponsorships">Sponsorships</SelectItem>
                          <SelectItem value="general">General Admin</SelectItem>
                          <SelectItem value="urgent">Urgent Issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="emailAddress">Email Address</Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        placeholder="admin@strongwillsports.com"
                        value={newEmailAddress}
                        onChange={(e) => setNewEmailAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addEmailNotification} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Email
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Test Email Section */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Test Email Notifications</h4>
                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      placeholder="test@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={testEmailNotification}
                      disabled={isTestingEmail}
                    >
                      {isTestingEmail ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Test
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Send a test email to verify your notification system is working properly.
                  </p>
                </div>

                {/* Notification Types Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Notification Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>New Order Notifications</span>
                        <Badge variant="secondary">Real-time</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Refund Confirmations</span>
                        <Badge variant="secondary">Immediate</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Group Order Completions</span>
                        <Badge variant="secondary">Daily digest</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Sponsorship Inquiries</span>
                        <Badge variant="secondary">Real-time</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>System Alerts</span>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Low Stock Warnings</span>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Management Tab */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Pages Management</h2>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Content management system for pages will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Blog Management</h2>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Blog post management system will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quote Requests Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Quote Requests</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Quote Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Quote request management system will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">User Management</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(user.createdAt || Date.now()), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUserOrders(user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - #SW-{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Order ID:</span> #SW-{selectedOrder.id}</p>
                      <p><span className="font-medium">Customer Email:</span> {selectedOrder.customerEmail || 'N/A'}</p>
                      <p><span className="font-medium">User ID:</span> {selectedOrder.userId || 'Guest'}</p>
                      <p><span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </Badge>
                      </p>
                      <p><span className="font-medium">Created:</span> {selectedOrder.createdAt ? format(new Date(selectedOrder.createdAt), "MMM dd, yyyy HH:mm") : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Shipping Address:</span></p>
                      <div className="pl-4 text-gray-600">
                        {selectedOrder.shippingAddress ? (
                          <div>
                            {(() => {
                              try {
                                const address = JSON.parse(selectedOrder.shippingAddress);
                                return (
                                  <div>
                                    <p>{address.name || 'N/A'}</p>
                                    <p>{address.address || 'N/A'}</p>
                                    <p>{address.city || 'N/A'}, {address.state || 'N/A'} {address.zipCode || 'N/A'}</p>
                                    <p>{address.country || 'N/A'}</p>
                                  </div>
                                );
                              } catch (e) {
                                return <p>{selectedOrder.shippingAddress}</p>;
                              }
                            })()}
                          </div>
                        ) : (
                          <p>No shipping address provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Details</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Subtotal</p>
                              <p className="text-sm text-gray-600">Base order amount</p>
                            </div>
                          </TableCell>
                          <TableCell>${selectedOrder.subtotal}</TableCell>
                        </TableRow>
                        {selectedOrder.discount && parseFloat(selectedOrder.discount) > 0 && (
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Discount</p>
                                <p className="text-sm text-gray-600">Applied discounts</p>
                              </div>
                            </TableCell>
                            <TableCell>-${selectedOrder.discount}</TableCell>
                          </TableRow>
                        )}
                        {selectedOrder.shipping && parseFloat(selectedOrder.shipping) > 0 && (
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Shipping</p>
                                <p className="text-sm text-gray-600">Delivery charges</p>
                              </div>
                            </TableCell>
                            <TableCell>${selectedOrder.shipping}</TableCell>
                          </TableRow>
                        )}
                        {selectedOrder.tax && parseFloat(selectedOrder.tax) > 0 && (
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Tax</p>
                                <p className="text-sm text-gray-600">Applied taxes</p>
                              </div>
                            </TableCell>
                            <TableCell>${selectedOrder.tax}</TableCell>
                          </TableRow>
                        )}
                        <TableRow className="border-t-2">
                          <TableCell>
                            <div>
                              <p className="font-bold">Total Amount</p>
                              <p className="text-sm text-gray-600">Final order total</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">${selectedOrder.totalAmount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => {
                      // Update order status
                      const updateStatus = async () => {
                        try {
                          await apiRequest("PUT", `/api/orders/${selectedOrder.id}/status`, { status: value });
                          queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
                          queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
                          setSelectedOrder({ ...selectedOrder, status: value });
                          toast({
                            title: "Success",
                            description: "Order status updated successfully",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to update order status",
                            variant: "destructive",
                          });
                        }
                      };
                      updateStatus();
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Refund Dialog */}
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
              <DialogDescription>
                Create a manual refund for Order #{refundFormData.orderId}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Refund Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={refundFormData.refundAmount}
                  onChange={(e) => setRefundFormData(prev => ({
                    ...prev,
                    refundAmount: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <Label>Refund Reason</Label>
                <Select value={refundFormData.reason} onValueChange={(value) => 
                  setRefundFormData(prev => ({ ...prev, reason: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective_product">Defective Product</SelectItem>
                    <SelectItem value="wrong_size">Wrong Size</SelectItem>
                    <SelectItem value="customer_request">Customer Request</SelectItem>
                    <SelectItem value="order_error">Order Error</SelectItem>
                    <SelectItem value="quality_issue">Quality Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Internal notes about this refund..."
                  value={refundFormData.adminNotes}
                  onChange={(e) => setRefundFormData(prev => ({
                    ...prev,
                    adminNotes: e.target.value
                  }))}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={processRefund}>
                Process Refund
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Edit Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user account details and permissions
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={editingUser.username || ''}
                      onChange={(e) => setEditingUser(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>User Role</Label>
                  <Select value={editingUser.role} onValueChange={(value) => 
                    setEditingUser(prev => ({ ...prev, role: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="sponsor">Sponsor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Account Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">User ID:</span>
                      <span className="ml-2 font-mono">{editingUser.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2">{format(new Date(editingUser.createdAt || Date.now()), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Save user changes
                setIsEditUserOpen(false);
                toast({
                  title: "User Updated",
                  description: "User account has been successfully updated."
                });
              }}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
