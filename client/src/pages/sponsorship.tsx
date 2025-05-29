import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { Users, Building2, Handshake, MessageSquare, DollarSign, Calendar } from "lucide-react";
import type { SeekerProfile, SponsorProfile, SponsorshipAgreement } from "@shared/schema";

export default function SponsorshipPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();

  const { data: seekerProfiles = [] } = useQuery({
    queryKey: ["/api/seeker-profiles"],
  });

  const { data: sponsorProfiles = [] } = useQuery({
    queryKey: ["/api/sponsor-profiles"],
  });

  const { data: agreements = [] } = useQuery({
    queryKey: ["/api/sponsorship-agreements"],
  });

  const activeAgreements = agreements.filter(
    (agreement: SponsorshipAgreement) => agreement.status === "active"
  );

  const totalSponsorshipValue = activeAgreements.reduce(
    (total: number, agreement: SponsorshipAgreement) => 
      total + parseFloat(agreement.amount), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-black mb-4">
            Sponsorship Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect teams seeking sponsorship with businesses ready to support athletic excellence.
            Build partnerships that drive success both on and off the field.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="seekers">Teams Seeking</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="agreements">Partnerships</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seekerProfiles.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Seeking sponsorship
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sponsorProfiles.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready to sponsor
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Partnerships</CardTitle>
                  <Handshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeAgreements.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Current agreements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalSponsorshipValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    In active sponsorships
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    For Teams & Athletes
                  </CardTitle>
                  <CardDescription>
                    Create your profile and connect with sponsors who align with your values and goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Showcase your team's achievements and potential</li>
                      <li>• Set clear sponsorship goals and requirements</li>
                      <li>• Connect directly with interested sponsors</li>
                      <li>• Manage sponsorship credits and agreements</li>
                    </ul>
                  </div>
                  <Link href="/create-seeker-profile">
                    <Button className="w-full mt-4">
                      Create Team Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    For Businesses
                  </CardTitle>
                  <CardDescription>
                    Discover talented teams and athletes to sponsor while building your brand presence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Find teams that match your brand values</li>
                      <li>• Set flexible sponsorship terms and budgets</li>
                      <li>• Track ROI and engagement metrics</li>
                      <li>• Build lasting community relationships</li>
                    </ul>
                  </div>
                  <Link href="/create-sponsor-profile">
                    <Button className="w-full mt-4">
                      Become a Sponsor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seekers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Teams Seeking Sponsorship</h2>
              <Link href="/create-seeker-profile">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Create Team Profile
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seekerProfiles.map((profile: SeekerProfile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {profile.isAnonymous ? "Anonymous Team" : profile.organizationName}
                      <Badge variant={profile.isActive ? "default" : "secondary"}>
                        {profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {profile.sportType} • {profile.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.logoUrl && !profile.isAnonymous && (
                        <div className="text-center">
                          <label className="text-xs font-medium text-gray-500 block mb-2">Team Logo</label>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <img 
                              src={profile.logoUrl} 
                              alt={`${profile.organizationName} Logo`}
                              className="h-12 w-auto mx-auto object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {profile.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Goal: ${profile.fundingGoal ? parseFloat(profile.fundingGoal).toLocaleString() : 'Not specified'}
                        </span>
                        <span className="text-gray-500">
                          {profile.organizationType}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation(`/team-profile/${profile.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {seekerProfiles.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No teams registered yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Be the first team to create a profile and start seeking sponsorship.
                  </p>
                  <Link href="/create-seeker-profile">
                    <Button>Create Team Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Sponsors</h2>
              <Link href="/create-sponsor-profile">
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Become a Sponsor
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsorProfiles.map((profile: SponsorProfile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {profile.companyName}
                      <Badge variant={profile.isActive ? "default" : "secondary"}>
                        {profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {profile.industry} • {profile.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.logoUrl && (
                        <div className="text-center">
                          <label className="text-xs font-medium text-gray-500 block mb-2">Logo for Your Apparel</label>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <img 
                              src={profile.logoUrl} 
                              alt={`${profile.companyName} Logo`}
                              className="h-12 w-auto mx-auto object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {profile.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Budget: ${parseFloat(profile.sponsorshipBudget).toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          {profile.preferredSports?.join(", ")}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation(`/sponsor-profile/${profile.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sponsorProfiles.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No sponsors registered yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Join as a sponsor to support local teams and build your brand presence.
                  </p>
                  <Button>Become a Sponsor</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agreements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Partnerships</h2>
            </div>

            <div className="space-y-4">
              {activeAgreements.map((agreement: SponsorshipAgreement) => (
                <Card key={agreement.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Partnership Agreement #{agreement.id}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">{agreement.status}</Badge>
                        <Badge variant="secondary">
                          ${parseFloat(agreement.totalAmount).toLocaleString()}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Duration: {agreement.duration} months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Benefits Provided</h4>
                        <p className="text-sm text-gray-600">
                          {agreement.benefits}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <p className="text-sm text-gray-600">
                          {agreement.requirements}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Terms</h4>
                        <p className="text-sm text-gray-600">
                          {agreement.terms}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activeAgreements.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Handshake className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active partnerships yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Partnerships will appear here once teams and sponsors create agreements.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}