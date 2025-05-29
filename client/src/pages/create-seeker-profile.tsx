import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-provider";
import { Users, ArrowLeft } from "lucide-react";
import { insertSeekerProfileSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const COUNTRIES = [
  "Australia", "New Zealand", "United Kingdom", "Canada", "Germany", "Netherlands",
  "United States", "France", "Italy", "Spain", "Japan", "South Korea", "China",
  "Brazil", "Argentina", "Mexico", "South Africa", "India", "Sweden", "Norway",
  "Denmark", "Finland", "Belgium", "Austria", "Switzerland", "Ireland", "Portugal",
  "Poland", "Czech Republic", "Hungary", "Greece", "Turkey", "Russia", "Ukraine",
  "Israel", "Egypt", "Morocco", "Nigeria", "Kenya", "Ghana", "Thailand", "Vietnam",
  "Singapore", "Malaysia", "Philippines", "Indonesia", "Pakistan", "Bangladesh",
  "Sri Lanka", "Nepal", "Myanmar", "Cambodia", "Laos", "Mongolia", "Kazakhstan"
].sort();

const formSchema = insertSeekerProfileSchema.extend({
  fundingGoal: z.string().min(1, "Funding goal is required"),
  isAnonymous: z.boolean().default(false),
});

export default function CreateSeekerProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Show authentication forms if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Team Profile</h1>
            <p className="text-gray-600">Sign in to create your team sponsorship profile</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => setLocation("/login")}
              className="w-full"
            >
              Sign In to Continue
            </Button>
            
            <div className="text-center">
              <span className="text-gray-500">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => setLocation("/register")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.id,
      organizationName: "",
      organizationType: "",
      sportType: "",
      location: "",
      country: "",
      contactName: "",
      contactPhone: "",
      description: "",
      fundingGoal: "",
      website: "",
      logoUrl: "",
      socialMedia: null,
      isAnonymous: false,
      isActive: true,
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: any) => {
      const profileData = {
        ...data,
        fundingGoal: data.fundingGoal, // Keep as string for decimal field
      };
      return apiRequest("POST", "/api/seeker-profiles", profileData);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/seeker-profiles"] });
      const profile = response;
      
      if (profile.isAnonymous && profile.shareableToken) {
        const shareableLink = `${window.location.origin}/shared/${profile.shareableToken}`;
        toast({
          title: "Success! Anonymous Profile Created",
          description: `Team profile created. Share this link: ${shareableLink}`,
          duration: 10000,
        });
      } else {
        toast({
          title: "Success!",
          description: "Team profile created successfully.",
        });
      }
      setLocation("/sponsorship");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create team profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/sponsorship")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sponsorship
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-black text-black mb-4">
              Create Team Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Set up your team's profile to connect with potential sponsors and showcase your achievements.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Information
            </CardTitle>
            <CardDescription>
              Tell sponsors about your team, goals, and what makes you special.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team/Organization Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your team name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="school_team">School Team</SelectItem>
                            <SelectItem value="club_team">Club Team</SelectItem>
                            <SelectItem value="amateur_team">Amateur Team</SelectItem>
                            <SelectItem value="semi_professional">Semi-Professional</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="individual_athlete">Individual Athlete</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wrestling">Wrestling</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="baseball">Baseball</SelectItem>
                            <SelectItem value="track_field">Track & Field</SelectItem>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State/Province" {...field} />
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
                        <FormLabel>Country *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person *</FormLabel>
                        <FormControl>
                          <Input placeholder="Coach or team representative" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsorship Goal (USD) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5000" 
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-1">
                          Typical amounts: Youth teams $500-2,000 • High school $1,000-5,000 • Club/Adult $2,000-10,000+
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourteam.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Logo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourteam.com/logo.png" {...field} />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload your team logo to showcase your identity to potential sponsors. Use a high-quality PNG or SVG with transparent background.
                        </p>
                        {field.value && (
                          <div className="mt-2">
                            <label className="text-sm font-medium text-gray-500">Logo Preview:</label>
                            <div className="mt-1 p-4 border rounded-lg bg-gray-50">
                              <img 
                                src={field.value} 
                                alt="Team Logo" 
                                className="h-16 w-auto object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell sponsors about your team's history, achievements, goals, and what makes you special..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">
                        Include: Team history & achievements • Competition level • Number of members • What sponsorship will fund • Community impact • Your team's unique story
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Anonymous Profile
                        </FormLabel>
                        <div className="text-sm text-gray-500">
                          Hide your team name from public view. Only other details will be visible to potential sponsors.
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/sponsorship")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProfileMutation.isPending}
                    className="flex-1"
                  >
                    {createProfileMutation.isPending ? "Creating..." : "Create Team Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}