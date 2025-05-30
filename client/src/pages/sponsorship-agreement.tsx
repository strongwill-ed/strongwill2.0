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
import type { SponsorshipAgreement, SeekerProfile, SponsorProfile } from "@shared/schema";
import { ArrowLeft, DollarSign, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";
import { useState } from "react";

export default function SponsorshipAgreementPage() {
  const [, params] = useRoute("/sponsorship-agreement/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const agreementId = params?.id ? parseInt(params.id) : null;

  const { data: agreement, isLoading } = useQuery<SponsorshipAgreement & {
    seekerProfile: SeekerProfile;
    sponsorProfile: SponsorProfile;
  }>({
    queryKey: ["/api/sponsorship-agreements", agreementId],
    enabled: !!agreementId,
  });

  const updateAgreementMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/sponsorship-agreements/${agreementId}`, data),
    onSuccess: () => {
      toast({
        title: "Agreement Updated",
        description: "The sponsorship agreement has been updated successfully.",
      });
      setShowNegotiation(false);
      setCounterAmount("");
      setCounterMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-agreements", agreementId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update agreement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createCreditMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/sponsorship-credits", data),
    onSuccess: () => {
      toast({
        title: "Credit Created",
        description: "Sponsorship credit has been created and is ready for use.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-agreements", agreementId] });
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-credits"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create sponsorship credit. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
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

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Agreement Not Found</h1>
          <Button onClick={() => setLocation("/sponsorship")}>
            Back to Sponsorship
          </Button>
        </div>
      </div>
    );
  }

  const isSponsor = user && agreement.sponsorProfile && user.id === agreement.sponsorProfile.userId;
  const isSeeker = user && agreement.seekerProfile && user.id === agreement.seekerProfile.userId;
  const canManage = isSponsor || isSeeker;

  const handleAccept = () => {
    updateAgreementMutation.mutate({
      status: "awaiting_payment",
      paymentStatus: "pending",
    });
  };

  const handleReject = () => {
    updateAgreementMutation.mutate({
      status: "rejected",
    });
  };

  const handleCounterOffer = () => {
    if (!counterAmount.trim()) {
      toast({
        title: "Amount Required",
        description: "Please enter a counter offer amount.",
        variant: "destructive",
      });
      return;
    }

    updateAgreementMutation.mutate({
      amount: counterAmount,
      description: counterMessage.trim() ? `${agreement.description}\n\nCounter offer: ${counterMessage}` : agreement.description,
      status: "pending",
    });
  };

  const handlePayment = () => {
    // Create sponsorship credit and process payment
    createCreditMutation.mutate({
      seekerId: agreement.seekerId,
      sponsorId: agreement.sponsorId,
      agreementId: agreement.id,
      amount: agreement.amount,
      remainingAmount: agreement.amount,
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });

    // Update agreement payment status
    updateAgreementMutation.mutate({
      status: "active",
      paymentStatus: "completed",
    });
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/sponsorship")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sponsorship
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">Sponsorship Agreement</CardTitle>
                <div className="flex gap-2 mb-4">
                  <Badge className={getStatusColor(agreement.status)}>
                    {agreement.status ? agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1) : "Unknown"}
                  </Badge>
                  <Badge className={getPaymentStatusColor(agreement.paymentStatus || "pending")}>
                    Payment: {(agreement.paymentStatus || "pending").charAt(0).toUpperCase() + (agreement.paymentStatus || "pending").slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  ${parseFloat(agreement.amount).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Sponsorship Amount</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Team</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">{agreement.seekerProfile?.organizationName}</div>
                  <div className="text-sm text-gray-600">{agreement.seekerProfile?.sportType}</div>
                  <div className="text-sm text-gray-600">{agreement.seekerProfile?.location}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sponsor</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">{agreement.sponsorProfile?.companyName}</div>
                  <div className="text-sm text-gray-600">{agreement.sponsorProfile?.industry}</div>
                  <div className="text-sm text-gray-600">{agreement.sponsorProfile?.location}</div>
                </div>
              </div>
            </div>

            {/* Agreement Details */}
            <div>
              <h3 className="font-semibold mb-2">Agreement Details</h3>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div><strong>Duration:</strong> {agreement.duration} months</div>
                <div><strong>Logo Usage Rights:</strong> {agreement.logoUsageRights}</div>
                <div><strong>Description:</strong></div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{agreement.description}</div>
              </div>
            </div>

            {/* Sponsor Payment Information */}
            {isSponsor && agreement.status === "pending" && (
              <div className="border-t pt-6">
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How Sponsorship Credits Work</h4>
                      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                        <p><strong>Step 1:</strong> Accept this sponsorship agreement</p>
                        <p><strong>Step 2:</strong> Complete secure payment processing</p>
                        <p><strong>Step 3:</strong> Credits are automatically issued to the team</p>
                        <p><strong>Step 4:</strong> Team can use credits on any orders from Strongwill Sports</p>
                      </div>
                      <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-800 rounded text-sm">
                        <strong>Important:</strong> Credits are only issued after successful payment verification. The team will receive ${agreement.amount} AUD in sponsorship credits to use on their orders.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {agreement.status === "awaiting_payment" && agreement.paymentStatus === "pending" && isSponsor && (
              <div className="border-t pt-6">
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Ready for Payment</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Agreement accepted! Complete your payment to issue ${agreement.amount} AUD in sponsorship credits to {agreement.seekerProfile.organizationName}.
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Once payment is processed, the team will be notified and can immediately use their credits for orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {canManage && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {agreement.status === "pending" && (
                    <>
                      <Button
                        onClick={handleAccept}
                        disabled={updateAgreementMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Agreement
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={updateAgreementMutation.isPending}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => setShowNegotiation(true)}
                        variant="outline"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Counter Offer
                      </Button>
                    </>
                  )}
                  {agreement.status === "active" && agreement.paymentStatus === "pending" && isSponsor && (
                    <Button
                      onClick={handlePayment}
                      disabled={createCreditMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {createCreditMutation.isPending ? "Processing..." : "Process Payment"}
                    </Button>
                  )}
                  {agreement.status === "active" && agreement.paymentStatus === "completed" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Payment Completed - Credit Available for Team
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Counter Offer Form */}
            {showNegotiation && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Make Counter Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Counter Amount ($)
                      </label>
                      <Input
                        type="number"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        placeholder={agreement.amount}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Message (Optional)
                      </label>
                      <Textarea
                        value={counterMessage}
                        onChange={(e) => setCounterMessage(e.target.value)}
                        placeholder="Explain your counter offer..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCounterOffer}
                        disabled={updateAgreementMutation.isPending}
                        className="btn-primary"
                      >
                        {updateAgreementMutation.isPending ? "Sending..." : "Send Counter Offer"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNegotiation(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}