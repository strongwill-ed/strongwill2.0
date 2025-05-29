import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGroupOrderSchema, insertGroupOrderItemSchema } from "@shared/schema";
import type { GroupOrder, Product, GroupOrderItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Plus, Users, Calendar, Package, Share2, Copy, Edit, Trash2, Settings } from "lucide-react";
import { format } from "date-fns";

const createGroupOrderSchema = z.object({
  name: z.string().min(1, "Group order name is required"),
  deadline: z.string().min(1, "Deadline is required"),
  minimumQuantity: z.number().min(1, "Minimum quantity must be at least 1"),
  description: z.string().optional(),
  organizerUserId: z.number(),
});

const joinGroupOrderSchema = insertGroupOrderItemSchema.omit({ groupOrderId: true }).extend({
  nickname: z.string().min(1, "Nickname is required")
});

export default function GroupOrders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedGroupOrder, setSelectedGroupOrder] = useState<GroupOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const { data: groupOrders = [], isLoading } = useQuery<GroupOrder[]>({
    queryKey: ["/api/group-orders"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: groupOrderDetails, isLoading: isLoadingDetails } = useQuery<GroupOrder & { items: GroupOrderItem[] }>({
    queryKey: [`/api/group-orders/${selectedGroupOrder?.id}`],
    enabled: !!selectedGroupOrder && isManageDialogOpen,
  });

  const createGroupOrderForm = useForm<z.infer<typeof createGroupOrderSchema>>({
    resolver: zodResolver(createGroupOrderSchema),
    defaultValues: {
      name: "",
      deadline: "",
      minimumQuantity: 10,
      description: "",
      organizerUserId: user?.id || 1,
    },
  });

  const joinGroupOrderForm = useForm<z.infer<typeof joinGroupOrderSchema>>({
    resolver: zodResolver(joinGroupOrderSchema),
    defaultValues: {
      userId: user?.id || 1,
      quantity: 1,
      participantName: "",
      participantEmail: "",
    },
  });

  const createGroupOrderMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createGroupOrderSchema>) => {
      const { deadline, ...rest } = data;
      const groupOrderData = {
        ...rest,
        deadline: new Date(deadline),
        status: "active",
        currentQuantity: 0,
        paymentMode: "individual",
        totalEstimate: "0.00",
      };
      return apiRequest("POST", "/api/group-orders", groupOrderData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group order created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders"] });
      setIsCreateDialogOpen(false);
      createGroupOrderForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create group order",
        variant: "destructive",
      });
    },
  });

  const joinGroupOrderMutation = useMutation({
    mutationFn: async ({ groupOrderId, data }: { groupOrderId: number; data: z.infer<typeof joinGroupOrderSchema> }) => {
      return apiRequest("POST", `/api/group-orders/${groupOrderId}/join`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully joined group order!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders", selectedGroupOrder?.id] });
      setIsJoinDialogOpen(false);
      joinGroupOrderForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join group order",
        variant: "destructive",
      });
    },
  });

  const removeGroupOrderItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return apiRequest("DELETE", `/api/group-order-items/${itemId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed from group order",
      });
      // Refresh all group orders and the specific group order details
      queryClient.invalidateQueries({ queryKey: ["/api/group-orders"] });
      if (selectedGroupOrder) {
        queryClient.invalidateQueries({ queryKey: [`/api/group-orders/${selectedGroupOrder.id}`] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to remove member from group order",
        variant: "destructive",
      });
    },
  });

  const onCreateSubmit = async (data: z.infer<typeof createGroupOrderSchema>) => {
    try {
      // Create the group order first
      const response = await apiRequest("POST", "/api/group-orders", data);
      const newGroupOrder = await response.json();
      
      // Then redirect to design tool with the new group order ID
      const params = new URLSearchParams({
        groupOrderId: newGroupOrder.id.toString(),
        groupOrderName: data.name,
        returnTo: 'group-orders'
      });
      
      toast({
        title: "Group Order Created",
        description: "Redirecting to design tool to create your design...",
      });
      
      window.location.href = `/design-tool?${params.toString()}`;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group order",
        variant: "destructive",
      });
    }
  };

  const onJoinSubmit = (data: z.infer<typeof joinGroupOrderSchema>) => {
    if (!selectedGroupOrder) return;
    joinGroupOrderMutation.mutate({ groupOrderId: selectedGroupOrder.id, data });
  };

  const copyShareLink = (groupOrderId: number) => {
    const link = `${window.location.origin}/group-orders?join=${groupOrderId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Share this link with your team members",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (current: number, minimum: number) => {
    return Math.min((current / minimum) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Group Orders</h1>
              <p className="text-lg text-gray-600">
                Organize team orders and get quantity discounts for your group.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Group Order</DialogTitle>
                </DialogHeader>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
                  <p className="text-sm text-blue-800">
                    Create a custom design group order. You'll be taken to the Design Tool to create the template and select the product.
                  </p>
                </div>
                
                <Form {...createGroupOrderForm}>
                  <form onSubmit={createGroupOrderForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField
                      control={createGroupOrderForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Order Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Team Eagles Wrestling 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      control={createGroupOrderForm.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createGroupOrderForm.control}
                      name="minimumQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createGroupOrderForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional details about the order..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={createGroupOrderMutation.isPending}
                    >
                      {createGroupOrderMutation.isPending ? "Creating..." : "Create Group Order"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">How Group Orders Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-black mb-2">1. Create Group</h3>
              <p className="text-gray-600 text-sm">Set up your group order with product details and deadline</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-black mb-2">2. Share Link</h3>
              <p className="text-gray-600 text-sm">Share the order link with team members to collect orders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-black mb-2">3. Fulfill Order</h3>
              <p className="text-gray-600 text-sm">Once minimum quantity is reached, we process and ship</p>
            </div>
          </div>
        </div>

        {/* Active Group Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : groupOrders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-black mb-2">No group orders yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first group order to get started with team ordering.
              </p>
            </div>
          ) : (
            groupOrders.map((groupOrder) => {
              const product = products.find(p => p.id === groupOrder.productId);
              const progress = getProgressPercentage(
                groupOrder.currentQuantity || 0, 
                groupOrder.minimumQuantity || 10
              );
              
              return (
                <Card key={groupOrder.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{groupOrder.name}</CardTitle>
                      <Badge className={getStatusColor(groupOrder.status || "active")}>
                        {groupOrder.status || "active"}
                      </Badge>
                    </div>
                    {product && (
                      <p className="text-sm text-gray-600">{product.name}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{groupOrder.currentQuantity || 0} / {groupOrder.minimumQuantity || 10}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        Deadline: {format(new Date(groupOrder.deadline), "MMM dd, yyyy")}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {user && groupOrder.organizerUserId === user.id ? (
                          // Owner controls
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedGroupOrder(groupOrder);
                                setIsManageDialogOpen(true);
                              }}
                              className="flex-1"
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyShareLink(groupOrder.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          // Join controls for non-owners
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedGroupOrder(groupOrder);
                                setIsJoinDialogOpen(true);
                              }}
                              className="flex-1"
                            >
                              Join Order
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyShareLink(groupOrder.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Manage Group Order Dialog */}
        <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Group Order</DialogTitle>
            </DialogHeader>
            {selectedGroupOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-lg">{selectedGroupOrder.name}</h4>
                  <p className="text-sm text-gray-600">
                    {products.find(p => p.id === selectedGroupOrder.productId)?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>Status: <Badge className={getStatusColor(selectedGroupOrder.status || "active")}>{selectedGroupOrder.status}</Badge></span>
                    <span>Progress: {selectedGroupOrder.currentQuantity || 0} / {selectedGroupOrder.minimumQuantity || 10}</span>
                    <span>Deadline: {format(new Date(selectedGroupOrder.deadline), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                {/* Order Members */}
                <div>
                  <h5 className="font-medium mb-3">Order Members ({selectedGroupOrder.currentQuantity || 0})</h5>
                  {isLoadingDetails ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading member details...</p>
                    </div>
                  ) : groupOrderDetails && groupOrderDetails.items && groupOrderDetails.items.length > 0 ? (
                    <div className="space-y-3">
                      {groupOrderDetails.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <div className="flex-1">
                            <p className="font-medium text-black">{item.participantName}</p>
                            <p className="text-sm text-gray-600">{item.participantEmail}</p>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="inline-block mr-3">Qty: <strong>{item.quantity}</strong></span>
                              <span className="inline-block mr-3">Size: <strong>{item.size || 'Not specified'}</strong></span>
                              <span className="inline-block mr-3">Color: <strong>{item.color || 'Not specified'}</strong></span>
                              {item.nickname && <span className="inline-block">Nickname: <strong>{item.nickname}</strong></span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${item.participantName} from this group order?`)) {
                                  removeGroupOrderItemMutation.mutate(item.id);
                                }
                              }}
                              title="Remove member"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-2">No members have joined yet</p>
                      <p className="text-sm text-gray-400">Share the group order link to invite members</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => copyShareLink(selectedGroupOrder.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Share Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsManageDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Join Group Order Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Group Order</DialogTitle>
            </DialogHeader>
            {selectedGroupOrder && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium">{selectedGroupOrder.name}</h4>
                <p className="text-sm text-gray-600">
                  {products.find(p => p.id === selectedGroupOrder.productId)?.name}
                </p>
              </div>
            )}
            <Form {...joinGroupOrderForm}>
              <form onSubmit={joinGroupOrderForm.handleSubmit(onJoinSubmit)} className="space-y-4">
                <FormField
                  control={joinGroupOrderForm.control}
                  name="participantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={joinGroupOrderForm.control}
                  name="participantEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={joinGroupOrderForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={joinGroupOrderForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={joinGroupOrderForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Black", "White", "Red", "Blue", "Navy", "Gray"].map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={joinGroupOrderForm.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter team nickname (e.g., Captain, Striker)"
                          maxLength={50}
                        />
                      </FormControl>
                      <FormDescription>
                        This will help identify you in the team order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-primary"
                  disabled={joinGroupOrderMutation.isPending}
                >
                  {joinGroupOrderMutation.isPending ? "Joining..." : "Join Group Order"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
