import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, DollarSign, Globe, Share2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SeekerProfile } from "@shared/schema";

export default function SharedTeamProfile() {
  const [, params] = useRoute("/shared/:token");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: profile, isLoading, error } = useQuery<SeekerProfile>({
    queryKey: ["/api/seeker-profiles/share", params?.token],
    enabled: !!params?.token,
  });

  const handleSponsorContact = () => {
    toast({
      title: "Contact Information",
      description: `To sponsor this team, contact: ${profile?.contactName} at ${profile?.contactPhone || 'contact info not provided'}`,
    });
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Shareable link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Share Link",
        description: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Team Profile Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                This shared profile link may be invalid or expired.
              </p>
              <Button onClick={() => setLocation("/sponsorship")}>
                View All Teams
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/sponsorship")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sponsorship
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.isAnonymous ? "Anonymous Team" : profile.organizationName}
              </h1>
              <p className="text-gray-600 mt-1">Seeking Sponsorship</p>
            </div>
            <Button onClick={handleShareProfile} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organization Type</label>
                    <p className="capitalize">{profile.organizationType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sport</label>
                    <p className="capitalize">{profile.sportType}</p>
                  </div>
                  {profile.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <p>{profile.contactName}</p>
                  </div>
                </div>
                
                {profile.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">About the Team</label>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{profile.description}</p>
                  </div>
                )}

                {profile.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-4 w-4" />
                      {profile.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sponsorship Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    ${parseFloat(profile.fundingGoal || "0").toLocaleString()}
                  </p>
                  <p className="text-gray-500 mt-1">USD</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interested in Sponsoring?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  This team is actively seeking sponsorship opportunities. Get in touch to discuss partnership possibilities.
                </p>
                
                <Button onClick={handleSponsorContact} className="w-full">
                  Contact Team
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation("/create-sponsor-profile")}
                    className="w-full"
                  >
                    Become a Sponsor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  <Badge variant={profile.isActive ? "default" : "secondary"}>
                    {profile.isActive ? "Actively Seeking" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}