import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-provider";
import { Users, ArrowLeft } from "lucide-react";
import { insertSeekerProfileSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const formSchema = insertSeekerProfileSchema.extend({
  fundingGoal: z.string().min(1, "Funding goal is required"),
});

export default function CreateSeekerProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    setLocation("/login");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.id,
      organizationName: "",
      organizationType: "",
      sportType: "",
      location: "",
      contactName: "",
      contactPhone: "",
      description: "",
      fundingGoal: "",
      website: "",
      socialMedia: null,
      isActive: true,
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const profileData = {
        ...data,
        fundingGoal: parseFloat(data.fundingGoal),
      };
      const response = await fetch("/api/seeker-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error("Failed to create profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seeker-profiles"] });
      toast({
        title: "Success!",
        description: "Team profile created successfully.",
      });
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
                          <Input placeholder="City, State/Province, Country" {...field} />
                        </FormControl>
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
                      <FormMessage />
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