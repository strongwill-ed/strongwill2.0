import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-provider";
import { Building2, ArrowLeft } from "lucide-react";
import { insertSponsorProfileSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const formSchema = insertSponsorProfileSchema.extend({
  sponsorshipBudget: z.string().min(1, "Sponsorship budget is required"),
  preferredSports: z.array(z.string()).min(1, "Select at least one sport"),
});

const sportsOptions = [
  { id: "wrestling", label: "Wrestling" },
  { id: "basketball", label: "Basketball" },
  { id: "soccer", label: "Soccer" },
  { id: "baseball", label: "Baseball" },
  { id: "track_field", label: "Track & Field" },
  { id: "football", label: "Football" },
  { id: "volleyball", label: "Volleyball" },
  { id: "swimming", label: "Swimming" },
  { id: "tennis", label: "Tennis" },
  { id: "golf", label: "Golf" },
];

export default function CreateSponsorProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Show loading or redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to create a sponsor profile.</p>
          <Button onClick={() => setLocation("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.id,
      companyName: "",
      industry: "",
      contactName: "",
      contactPhone: "",
      description: "",
      sponsorshipBudget: "",
      targetAudience: "",
      logoUrl: "",
      website: "",
      socialMedia: null,
      preferredSports: [],
      isActive: true,
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: any) => {
      const profileData = {
        ...data,
        sponsorshipBudget: parseFloat(data.sponsorshipBudget),
      };
      return apiRequest("/api/sponsor-profiles", {
        method: "POST",
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sponsor-profiles"] });
      toast({
        title: "Success!",
        description: "Sponsor profile created successfully.",
      });
      setLocation("/sponsorship");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create sponsor profile. Please try again.",
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
              Create Sponsor Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Set up your business profile to discover and sponsor talented teams and athletes.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Business Information
            </CardTitle>
            <CardDescription>
              Tell teams about your company, values, and sponsorship goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance & Banking</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="real_estate">Real Estate</SelectItem>
                            <SelectItem value="automotive">Automotive</SelectItem>
                            <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="sports_fitness">Sports & Fitness</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                          <Input placeholder="Marketing manager or representative" {...field} />
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
                    name="sponsorshipBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsorship Budget (USD) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="10000" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Young adults 18-35" {...field} />
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
                          <Input placeholder="https://yourcompany.com" {...field} />
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
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourcompany.com/logo.png" {...field} />
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
                      <FormLabel>Company Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell teams about your company's mission, values, and why you want to sponsor athletes..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredSports"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Preferred Sports *</FormLabel>
                        <FormDescription className="text-sm text-gray-600">
                          Select the sports you're interested in sponsoring.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {sportsOptions.map((sport) => (
                          <FormField
                            key={sport.id}
                            control={form.control}
                            name="preferredSports"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={sport.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(sport.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, sport.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== sport.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {sport.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
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
                    {createProfileMutation.isPending ? "Creating..." : "Create Sponsor Profile"}
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