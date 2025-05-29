import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiPost } from "@/lib/api";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { GroupOrder, GroupOrderItem, Product } from "@shared/schema";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State/Province/Region is required"),
  zipCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone number is required"),
  sameAsBilling: z.boolean().default(true),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
  paymentMethod: z.enum(["card", "paypal"]).default("card"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeadlineWarning, setShowDeadlineWarning] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<CheckoutFormData | null>(null);

  // Check if this is a group order checkout
  const urlParams = new URLSearchParams(window.location.search);
  const groupOrderId = urlParams.get("groupOrderId");
  const isGroupOrderCheckout = !!groupOrderId;

  // Fetch group order data if this is a group order checkout
  const { data: groupOrderDetails } = useQuery<GroupOrder & { items: GroupOrderItem[] }>({
    queryKey: [`/api/group-orders/${groupOrderId}`],
    enabled: isGroupOrderCheckout,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isGroupOrderCheckout,
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsBilling: true,
      paymentMethod: "card",
      country: "AU",
      shippingCountry: "AU",
    },
  });

  const sameAsBilling = form.watch("sameAsBilling");

  const calculateOrderSummary = () => {
    let subtotal = 0;
    let totalQuantity = 0;

    if (isGroupOrderCheckout && groupOrderDetails) {
      // Calculate totals for group order
      if (groupOrderDetails.productId) {
        const product = products.find(p => p.id === groupOrderDetails.productId);
        const basePrice = parseFloat(product?.basePrice || "0");
        
        totalQuantity = groupOrderDetails.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
        subtotal = basePrice * totalQuantity;
      } else {
        // For custom group orders without a specific product, use a default price per item
        totalQuantity = groupOrderDetails.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
        subtotal = 45.00 * totalQuantity; // Default custom item price
      }
    } else {
      // Regular cart checkout
      subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.product?.basePrice || "0");
        return total + (price * (item.quantity || 1));
      }, 0);
      totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    const bulkDiscount = totalQuantity >= 10 ? subtotal * 0.1 : 0;
    
    // Dynamic shipping based on country
    const selectedCountry = form.watch("country");
    const getShippingRate = (country: string) => {
      // Priority markets - lower shipping rates
      const priorityMarkets = ["AU", "NZ", "GB", "CA", "DE", "NL"];
      if (priorityMarkets.includes(country)) {
        return 12.00;
      }
      
      // EU countries
      const euCountries = ["AT", "BE", "DK", "FI", "FR", "IE", "IT", "LU", "ES", "SE", "PT", "GR", "CY", "MT"];
      if (euCountries.includes(country)) {
        return 18.00;
      }
      
      // North America
      if (["US", "MX"].includes(country)) {
        return 15.00;
      }
      
      // Asia Pacific
      const apacCountries = ["JP", "SG", "HK", "KR", "TH", "MY", "PH", "ID", "VN", "CN", "TW"];
      if (apacCountries.includes(country)) {
        return 25.00;
      }
      
      // Rest of world
      return 35.00;
    };

    const shipping = getShippingRate(selectedCountry);
    const tax = (subtotal - bulkDiscount) * 0.1; // 10% GST for AU/NZ, VAT for EU
    const total = subtotal - bulkDiscount + shipping + tax;

    return { subtotal, bulkDiscount, shipping, tax, total, totalQuantity };
  };

  const { subtotal, bulkDiscount, shipping, tax, total, totalQuantity } = calculateOrderSummary();

  // Calculate shipping timeline based on country
  const getShippingTimelineInDays = (country: string) => {
    // Priority markets - fastest shipping
    const priorityMarkets = ["AU", "NZ", "GB", "CA", "DE", "NL"];
    if (priorityMarkets.includes(country)) {
      return 7; // 7 days for priority markets
    }
    
    // EU countries
    const euCountries = ["AT", "BE", "DK", "FI", "FR", "IE", "IT", "LU", "ES", "SE", "PT", "GR", "CY", "MT"];
    if (euCountries.includes(country)) {
      return 10; // 10 days for EU
    }
    
    // North America
    if (["US", "MX"].includes(country)) {
      return 12; // 12 days for North America
    }
    
    // Asia Pacific
    const apacCountries = ["JP", "SG", "HK", "KR", "TH", "MY", "PH", "ID", "VN", "CN", "TW"];
    if (apacCountries.includes(country)) {
      return 15; // 15 days for Asia Pacific
    }
    
    // Rest of world
    return 21; // 21 days for rest of world
  };

  // Check if shipping deadline will be met
  const checkShippingDeadline = (data: CheckoutFormData): boolean => {
    if (!groupOrderDetails) return true; // No deadline to check for regular orders
    
    const shippingDays = getShippingTimelineInDays(data.country);
    const productionDays = 14; // Assume 14 days for production
    const totalDays = shippingDays + productionDays;
    
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + totalDays);
    
    const groupDeadline = new Date(groupOrderDetails.deadline);
    
    return estimatedDeliveryDate <= groupDeadline;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    // For group orders, check if group order has items; for regular orders, check cart
    if (isGroupOrderCheckout) {
      if (!groupOrderDetails || !groupOrderDetails.items || groupOrderDetails.items.length === 0) {
        toast({
          title: "No items to checkout",
          description: "This group order has no participants yet.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before checkout.",
          variant: "destructive",
        });
        return;
      }
    }

    // Check shipping deadline for group orders
    if (!checkShippingDeadline(data)) {
      setPendingSubmitData(data);
      setShowDeadlineWarning(true);
      return;
    }

    await processCheckout(data);
  };

  const processCheckout = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      // Create order with shipping and billing information
      const orderData = {
        customerEmail: data.email,
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        shippingAddress: sameAsBilling ? {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        } : {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.shippingAddress || data.address,
          city: data.shippingCity || data.city,
          state: data.shippingState || data.state,
          zipCode: data.shippingZipCode || data.zipCode,
          country: data.shippingCountry || data.country,
          phone: data.phone,
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          designId: item.designId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unitPrice: item.product?.basePrice || "0",
          customizations: item.customizations || {},
        })),
        subtotal: subtotal.toFixed(2),
        discount: bulkDiscount.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        totalAmount: total.toFixed(2),
        paymentMethod: data.paymentMethod,
      };

      // Create the order first
      const response = await apiPost<{ orderId: number; message: string }>("/api/orders", orderData);

      if (data.paymentMethod === "card") {
        // Try to create Stripe payment intent
        try {
          const paymentResponse = await apiPost<{ clientSecret: string }>("/api/payments/create-intent", {
            amount: total,
            currency: "usd"
          });
          
          if (paymentResponse.clientSecret) {
            // In a real implementation, you would use Stripe Elements here
            // For now, we'll simulate payment confirmation
            await apiPost("/api/payments/confirm", {
              orderId: response.orderId,
              paymentIntentId: "simulated_payment_" + Date.now()
            });
          }
        } catch (paymentError) {
          // If Stripe is not configured, the order is still created but payment is pending
          console.log("Payment processing not available - order created with pending status");
        }
        toast({
          title: "Order placed successfully!",
          description: `Order #${response.orderId} has been created. You will receive a confirmation email shortly.`,
        });
      } else {
        // PayPal integration would go here
        toast({
          title: "Order placed successfully!",
          description: `Order #${response.orderId} has been created. You will receive a confirmation email shortly.`,
        });
      }

      clearCart();
      setLocation("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't show empty cart message for group order checkout
  if (!isGroupOrderCheckout && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 George Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Sydney" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province/Region</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. NSW, Ontario, Bavaria" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2000, SW1A 1AA, 10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* Priority Markets */}
                                <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                                <SelectItem value="NZ">🇳🇿 New Zealand</SelectItem>
                                <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                                <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                                <SelectItem value="NL">🇳🇱 Netherlands</SelectItem>
                                
                                {/* Other Countries */}
                                <SelectItem value="US">🇺🇸 United States</SelectItem>
                                <SelectItem value="AT">🇦🇹 Austria</SelectItem>
                                <SelectItem value="BE">🇧🇪 Belgium</SelectItem>
                                <SelectItem value="DK">🇩🇰 Denmark</SelectItem>
                                <SelectItem value="FI">🇫🇮 Finland</SelectItem>
                                <SelectItem value="FR">🇫🇷 France</SelectItem>
                                <SelectItem value="IE">🇮🇪 Ireland</SelectItem>
                                <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                                <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                                <SelectItem value="NO">🇳🇴 Norway</SelectItem>
                                <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                                <SelectItem value="SE">🇸🇪 Sweden</SelectItem>
                                <SelectItem value="CH">🇨🇭 Switzerland</SelectItem>
                                <SelectItem value="SG">🇸🇬 Singapore</SelectItem>
                                <SelectItem value="HK">🇭🇰 Hong Kong</SelectItem>
                                <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                                <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                                <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                                <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                                <SelectItem value="CL">🇨🇱 Chile</SelectItem>
                                <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                                <SelectItem value="IN">🇮🇳 India</SelectItem>
                                <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
                                <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
                                <SelectItem value="PH">🇵🇭 Philippines</SelectItem>
                                <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                                <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                                <SelectItem value="CN">🇨🇳 China</SelectItem>
                                <SelectItem value="TW">🇹🇼 Taiwan</SelectItem>
                                <SelectItem value="AE">🇦🇪 United Arab Emirates</SelectItem>
                                <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                                <SelectItem value="IL">🇮🇱 Israel</SelectItem>
                                <SelectItem value="TR">🇹🇷 Turkey</SelectItem>
                                <SelectItem value="EG">🇪🇬 Egypt</SelectItem>
                                <SelectItem value="NG">🇳🇬 Nigeria</SelectItem>
                                <SelectItem value="KE">🇰🇪 Kenya</SelectItem>
                                <SelectItem value="GH">🇬🇭 Ghana</SelectItem>
                                <SelectItem value="MA">🇲🇦 Morocco</SelectItem>
                                <SelectItem value="TN">🇹🇳 Tunisia</SelectItem>
                                <SelectItem value="PL">🇵🇱 Poland</SelectItem>
                                <SelectItem value="CZ">🇨🇿 Czech Republic</SelectItem>
                                <SelectItem value="HU">🇭🇺 Hungary</SelectItem>
                                <SelectItem value="SK">🇸🇰 Slovakia</SelectItem>
                                <SelectItem value="SI">🇸🇮 Slovenia</SelectItem>
                                <SelectItem value="HR">🇭🇷 Croatia</SelectItem>
                                <SelectItem value="RS">🇷🇸 Serbia</SelectItem>
                                <SelectItem value="BG">🇧🇬 Bulgaria</SelectItem>
                                <SelectItem value="RO">🇷🇴 Romania</SelectItem>
                                <SelectItem value="LT">🇱🇹 Lithuania</SelectItem>
                                <SelectItem value="LV">🇱🇻 Latvia</SelectItem>
                                <SelectItem value="EE">🇪🇪 Estonia</SelectItem>
                                <SelectItem value="GR">🇬🇷 Greece</SelectItem>
                                <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
                                <SelectItem value="MT">🇲🇹 Malta</SelectItem>
                                <SelectItem value="CY">🇨🇾 Cyprus</SelectItem>
                                <SelectItem value="IS">🇮🇸 Iceland</SelectItem>
                                <SelectItem value="LU">🇱🇺 Luxembourg</SelectItem>
                                <SelectItem value="LI">🇱🇮 Liechtenstein</SelectItem>
                                <SelectItem value="MC">🇲🇨 Monaco</SelectItem>
                                <SelectItem value="SM">🇸🇲 San Marino</SelectItem>
                                <SelectItem value="VA">🇻🇦 Vatican City</SelectItem>
                                <SelectItem value="AD">🇦🇩 Andorra</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+61 2 9234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sameAsBilling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Same as billing address
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {!sameAsBilling && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="shippingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shipping Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Shipping St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="shippingCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="shippingState"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province/Region</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. NY, Ontario, Bavaria" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("paymentMethod") === "card" && (
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Secure payment processing powered by Stripe
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border">
                          <p className="text-sm">Card payment form would appear here</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Stripe Elements integration required for live payments
                          </p>
                        </div>
                      </div>
                    )}

                    {form.watch("paymentMethod") === "paypal" && (
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          You will be redirected to PayPal to complete your payment
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {isGroupOrderCheckout && groupOrderDetails ? (
                    // Show group order items
                    <>
                      <div className="border-b pb-2 mb-3">
                        <p className="font-medium text-sm text-gray-700">Group Order: {groupOrderDetails.name}</p>
                      </div>
                      {groupOrderDetails.items?.map((item, index) => {
                        let product, itemPrice;
                        if (groupOrderDetails.productId) {
                          product = products.find(p => p.id === groupOrderDetails.productId);
                          itemPrice = parseFloat(product?.basePrice || "0") * (item.quantity || 1);
                        } else {
                          product = { name: "Custom Design" };
                          itemPrice = 45.00 * (item.quantity || 1);
                        }
                        
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <div>
                              <p className="font-medium">{product?.name}</p>
                              <p className="text-gray-500">
                                {item.participantName} • {item.size} • {item.color} • Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">${itemPrice.toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    // Show regular cart items
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-gray-500">
                            {item.size} • {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(parseFloat(item.product?.basePrice || "0") * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {bulkDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Bulk Discount (10% off 10+ items)</span>
                      <span>-${bulkDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Shipping Deadline Warning Dialog */}
      <Dialog open={showDeadlineWarning} onOpenChange={setShowDeadlineWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Shipping Deadline Warning
            </DialogTitle>
            <DialogDescription>
              Based on your shipping address and current production timelines, your order may not arrive before the group order deadline. 
              {groupOrderDetails && (
                <>
                  <br /><br />
                  <strong>Group Order Deadline:</strong> {new Date(groupOrderDetails.deadline).toLocaleDateString()}
                  <br />
                  <strong>Estimated Delivery:</strong> {(() => {
                    if (pendingSubmitData) {
                      const shippingDays = getShippingTimelineInDays(pendingSubmitData.country);
                      const totalDays = shippingDays + 14; // 14 days production
                      const estimatedDate = new Date();
                      estimatedDate.setDate(estimatedDate.getDate() + totalDays);
                      return estimatedDate.toLocaleDateString();
                    }
                    return "Unknown";
                  })()}
                </>
              )}
              <br /><br />
              Would you like to proceed with this order anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeadlineWarning(false);
                setPendingSubmitData(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                setShowDeadlineWarning(false);
                if (pendingSubmitData) {
                  await processCheckout(pendingSubmitData);
                  setPendingSubmitData(null);
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Proceed Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}