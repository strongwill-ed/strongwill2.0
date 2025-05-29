import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { apiRequest } from "@/lib/queryClient";
import type { SponsorProfile, SeekerProfile } from "@shared/schema";
import { ArrowLeft, Building2, Globe, Phone, DollarSign, Users, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SponsorProfile() {
  const [, params] = useRoute("/sponsor-profile/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [sponsorshipMessage, setSponsorshipMessage] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");

  const profileId = params?.id ? parseInt(params.id) : null;

  const { data: profile, isLoading } = useQuery<SponsorProfile>({
    queryKey: ["/api/sponsor-profiles", profileId],
    enabled: !!profileId,
  });

  const { data: seekerProfile } = useQuery<SeekerProfile>({
    queryKey: ["/api/seeker-profiles/user", user?.id],
    enabled: !!user,
  });

  const sponsorshipMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/sponsorship-agreements", data),
    onSuccess: () => {
      toast({
        title: "Sponsorship Request Sent!",
        description: "Your sponsorship request has been sent to the sponsor.",
      });
      setShowRequestForm(false);
      setSponsorshipMessage("");
      setRequestedAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-agreements"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send sponsorship request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/sponsor-profiles/${profile?.id}`),
    onSuccess: () => {
      toast({
        title: "Profile Deleted",
        description: "Your sponsor profile has been deleted successfully.",
      });
      setLocation("/sponsorship");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sponsor Profile Not Found</h1>
          <Button onClick={() => setLocation("/sponsorship")}>
            Back to Sponsorship
          </Button>
        </div>
      </div>
    );
  }

  const handleSponsorshipRequest = () => {
    if (!seekerProfile) {
      toast({
        title: "Team Profile Required",
        description: "You need to create a team profile first.",
        variant: "destructive",
      });
      return;
    }

    if (!sponsorshipMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your sponsorship request.",
        variant: "destructive",
      });
      return;
    }

    if (!requestedAmount.trim()) {
      toast({
        title: "Amount Required",
        description: "Please enter a requested sponsorship amount.",
        variant: "destructive",
      });
      return;
    }

    sponsorshipMutation.mutate({
      seekerId: seekerProfile.id,
      sponsorId: profile.id,
      amount: requestedAmount,
      duration: 12, // Default 12 months
      logoUsageRights: "limited",
      description: sponsorshipMessage,
      status: "pending",
      paymentStatus: "pending",
    });
  };

  const isOwnProfile = user?.id === profile.userId;
  const canRequest = user && !isOwnProfile && seekerProfile;

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

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{profile.companyName}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-gray-600">{profile.industry}</span>
                  </div>
                </div>
                {canRequest && (
                  <Button
                    onClick={() => setShowRequestForm(true)}
                    className="btn-primary"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Request Sponsorship
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {profile.logoUrl && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Company Logo</h3>
                      <div className="p-4 border rounded-lg bg-gray-50 text-center">
                        <img 
                          src={profile.logoUrl} 
                          alt={`${profile.companyName} Logo`}
                          className="h-20 w-auto mx-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2">This logo will appear on your team's apparel</p>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600 mb-4">
                    {profile.description || "No description provided."}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Contact: {profile.contactName}</span>
                    </div>
                    {profile.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{profile.contactPhone}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {profile.preferredSports && profile.preferredSports.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Preferred Sports</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredSports.map((sport) => (
                          <Badge key={sport} variant="outline">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Sponsorship Budget</h3>
                    <div className="text-2xl font-bold text-green-600">
                      ${profile.sponsorshipBudget ? parseFloat(profile.sponsorshipBudget.toString()).toLocaleString() : 'Contact for details'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Available for team sponsorships
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-3 text-blue-900">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{profile.contactName}</span>
                      </div>
                      {profile.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <a href={`tel:${profile.contactPhone}`} className="text-sm text-blue-600 hover:underline">
                            {profile.contactPhone}
                          </a>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.targetAudience && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Target Audience</h4>
                      <p className="text-sm text-gray-600">{profile.targetAudience}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Request Form */}
          {showRequestForm && (
            <Card>
              <CardHeader>
                <CardTitle>Request Sponsorship</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Requested Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message to Sponsor
                    </label>
                    <Textarea
                      value={sponsorshipMessage}
                      onChange={(e) => setSponsorshipMessage(e.target.value)}
                      placeholder="Tell them about your team, goals, and how the sponsorship will be used..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSponsorshipRequest}
                      disabled={sponsorshipMutation.isPending}
                      className="btn-primary"
                    >
                      {sponsorshipMutation.isPending ? "Sending..." : "Send Request"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRequestForm(false)}
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