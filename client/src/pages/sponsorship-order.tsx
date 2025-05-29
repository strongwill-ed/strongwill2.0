import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { apiRequest } from "@/lib/queryClient";
import type { Order, SponsorshipCredit, OrderItem } from "@shared/schema";
import { ArrowLeft, DollarSign, CheckCircle, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function SponsorshipOrderPage() {
  const [, params] = useRoute("/sponsorship-order/:orderId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedCredits, setSelectedCredits] = useState<number[]>([]);
  const [appliedAmount, setAppliedAmount] = useState("0");
  const [sponsorMessage, setSponsorMessage] = useState("");

  const orderId = params?.orderId ? parseInt(params.orderId) : null;

  const { data: order, isLoading: orderLoading } = useQuery<Order & { items: OrderItem[] }>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: availableCredits = [], isLoading: creditsLoading } = useQuery<SponsorshipCredit[]>({
    queryKey: ["/api/sponsorship-credits/available", user?.id],
    enabled: !!user,
  });

  const submitForApprovalMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/orders/${orderId}/request-sponsorship`, data),
    onSuccess: () => {
      toast({
        title: "Sponsorship Request Sent",
        description: "Your order has been submitted to sponsors for approval and payment.",
      });
      setLocation("/orders");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit sponsorship request. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (orderLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => setLocation("/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const totalOrderAmount = parseFloat(order.totalAmount);
  const remainingAmount = totalOrderAmount - parseFloat(appliedAmount);

  const handleCreditSelection = (creditId: number, amount: string) => {
    const currentCredits = [...selectedCredits];
    const currentAmount = parseFloat(appliedAmount) || 0;
    const creditAmount = parseFloat(amount);

    if (currentCredits.includes(creditId)) {
      // Remove credit
      const updatedCredits = currentCredits.filter(id => id !== creditId);
      const newAmount = Math.max(0, currentAmount - creditAmount);
      setSelectedCredits(updatedCredits);
      setAppliedAmount(newAmount.toString());
    } else {
      // Add credit
      const newAmount = Math.min(totalOrderAmount, currentAmount + creditAmount);
      setSelectedCredits([...currentCredits, creditId]);
      setAppliedAmount(newAmount.toString());
    }
  };

  const handleSubmitForApproval = () => {
    if (selectedCredits.length === 0) {
      toast({
        title: "Select Credits",
        description: "Please select at least one sponsorship credit to apply.",
        variant: "destructive",
      });
      return;
    }

    if (!sponsorMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message for the sponsors.",
        variant: "destructive",
      });
      return;
    }

    submitForApprovalMutation.mutate({
      creditIds: selectedCredits,
      appliedAmount: appliedAmount,
      message: sponsorMessage,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/orders")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary - #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>Status: <Badge>{order.status}</Badge></div>
                    <div>Items: {order.items?.length || 0}</div>
                    <div>Shipping: {order.shippingAddress ? "Address provided" : "Pickup"}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">${totalOrderAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Sponsorship Applied:</span>
                      <span className="font-medium">-${parseFloat(appliedAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Your Payment:</span>
                      <span>${remainingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Sponsorship Credits */}
          <Card>
            <CardHeader>
              <CardTitle>Available Sponsorship Credits</CardTitle>
            </CardHeader>
            <CardContent>
              {availableCredits.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No sponsorship credits available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You need active sponsorship agreements to use credits for orders.
                  </p>
                  <Button onClick={() => setLocation("/sponsorship")}>
                    Find Sponsors
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableCredits.map((credit) => (
                    <div
                      key={credit.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCredits.includes(credit.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleCreditSelection(credit.id, credit.remainingAmount)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Sponsorship Agreement #{credit.agreementId}</h4>
                          <p className="text-sm text-gray-600">
                            Available: ${parseFloat(credit.remainingAmount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {credit.expiresAt ? new Date(credit.expiresAt).toLocaleDateString() : "No expiry"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            ${parseFloat(credit.remainingAmount).toFixed(2)}
                          </div>
                          {selectedCredits.includes(credit.id) && (
                            <CheckCircle className="h-5 w-5 text-blue-600 ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sponsor Request Form */}
          {selectedCredits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Request Sponsor Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Applied Sponsorship Amount
                    </label>
                    <Input
                      type="number"
                      value={appliedAmount}
                      onChange={(e) => {
                        const value = Math.min(totalOrderAmount, Math.max(0, parseFloat(e.target.value) || 0));
                        setAppliedAmount(value.toString());
                      }}
                      max={totalOrderAmount}
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${totalOrderAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message to Sponsors
                    </label>
                    <Textarea
                      value={sponsorMessage}
                      onChange={(e) => setSponsorMessage(e.target.value)}
                      placeholder="Describe your order and how it aligns with the sponsorship agreement..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmitForApproval}
                      disabled={submitForApprovalMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {submitForApprovalMutation.isPending ? "Submitting..." : "Submit for Sponsor Approval"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setLocation("/orders")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}