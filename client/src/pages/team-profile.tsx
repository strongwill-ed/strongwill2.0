import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { apiRequest } from "@/lib/queryClient";
import type { SeekerProfile, SponsorProfile } from "@shared/schema";
import { ArrowLeft, Users, Globe, Phone, Mail, DollarSign, Trash2, Share2, Copy } from "lucide-react";
import { useState } from "react";

export default function TeamProfile() {
  const [, params] = useRoute("/team-profile/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sponsorshipMessage, setSponsorshipMessage] = useState("");

  const profileId = params?.id ? parseInt(params.id) : null;

  const { data: profile, isLoading } = useQuery<SeekerProfile>({
    queryKey: ["/api/seeker-profiles", profileId],
    enabled: !!profileId,
  });

  const { data: sponsorProfile } = useQuery<SponsorProfile>({
    queryKey: ["/api/sponsor-profiles/user", user?.id],
    enabled: !!user,
  });

  const sponsorshipMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/sponsorship-agreements", data),
    onSuccess: () => {
      toast({
        title: "Sponsorship Offer Sent!",
        description: "Your sponsorship offer has been sent to the team.",
      });
      setShowSponsorForm(false);
      setSponsorshipMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-agreements"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send sponsorship offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: () => {
      if (!profile?.id) {
        throw new Error("Profile ID not found");
      }
      return apiRequest("DELETE", `/api/seeker-profiles/${profile.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Profile Deleted",
        description: "Your team profile has been deleted successfully.",
      });
      setLocation("/sponsorship");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete profile. Please try again.",
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
          <h1 className="text-2xl font-bold mb-4">Team Profile Not Found</h1>
          <Button onClick={() => setLocation("/sponsorship")}>
            Back to Sponsorship
          </Button>
        </div>
      </div>
    );
  }

  const handleSponsorshipOffer = () => {
    if (!sponsorProfile) {
      const createProfile = confirm("You need a sponsor profile to make offers. Would you like to create one now?");
      if (createProfile) {
        setLocation("/create-sponsor-profile");
      }
      return;
    }

    if (!sponsorshipMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your sponsorship offer.",
        variant: "destructive",
      });
      return;
    }

    sponsorshipMutation.mutate({
      seekerId: profile.id,
      sponsorId: sponsorProfile.id,
      amount: "0", // To be negotiated
      duration: 12, // Default 12 months
      logoUsageRights: "limited",
      description: sponsorshipMessage,
      status: "pending",
      paymentStatus: "pending",
    });
  };

  const isOwnProfile = user && profile && user.id === profile.userId;
  const isAdmin = user && user.username === 'admin';
  const canDelete = (isOwnProfile || isAdmin) && user;
  const canSponsor = user && !isOwnProfile;

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
                  <CardTitle className="text-2xl">{profile.organizationName}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-gray-600">{profile.sportType}</span>
                    <span className="text-gray-600">{profile.organizationType}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {canSponsor && (
                    <Button
                      onClick={() => setShowSponsorForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Offer Partnership
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      onClick={() => setShowShareOptions(true)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
                          deleteProfileMutation.mutate();
                        }
                      }}
                      disabled={deleteProfileMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteProfileMutation.isPending ? "Deleting..." : "Delete Profile"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600 mb-4">
                    {profile.description || "No description provided."}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{profile.location}</span>
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
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Funding Goal</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {profile.fundingGoal && 
                     profile.fundingGoal !== null && 
                     profile.fundingGoal !== "" && 
                     profile.fundingGoal !== "0" &&
                     !isNaN(parseFloat(profile.fundingGoal.toString())) ? 
                      `$${parseFloat(profile.fundingGoal.toString()).toLocaleString()}` : 
                      'Not specified'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Seeking sponsorship to support team activities and growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Offer Form */}
          {showSponsorForm && (
            <Card>
              <CardHeader>
                <CardTitle>Send Sponsorship Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message to Team
                    </label>
                    <Textarea
                      value={sponsorshipMessage}
                      onChange={(e) => setSponsorshipMessage(e.target.value)}
                      placeholder="Introduce your company and explain why you'd like to sponsor this team..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSponsorshipOffer}
                      disabled={sponsorshipMutation.isPending}
                      className="btn-primary"
                    >
                      {sponsorshipMutation.isPending ? "Sending..." : "Send Offer"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSponsorForm(false)}
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