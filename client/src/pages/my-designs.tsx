import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Share, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Design {
  id: number;
  uniqueId: string;
  name: string;
  productId: number | null;
  elements: string;
  createdAt: string;
  userId: number | null;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

export default function MyDesigns() {
  const { toast } = useToast();
  const [shareEmail, setShareEmail] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const { data: designs = [], isLoading } = useQuery<Design[]>({
    queryKey: ["/api/designs"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteDesignMutation = useMutation({
    mutationFn: async (designId: number) => {
      return apiRequest("DELETE", `/api/designs/${designId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Design deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete design",
        variant: "destructive",
      });
    },
  });

  const shareDesignMutation = useMutation({
    mutationFn: async ({ designId, email }: { designId: string; email: string }) => {
      return apiRequest("POST", "/api/designs/share", { designId, email });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Design link sent successfully!",
      });
      setIsShareDialogOpen(false);
      setShareEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send design link",
        variant: "destructive",
      });
    },
  });

  const copyDesignLink = (uniqueId: string) => {
    const link = `${window.location.origin}/design-tool?loadDesign=${uniqueId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Success",
      description: "Design link copied to clipboard!",
    });
  };

  const editDesign = (uniqueId: string) => {
    window.location.href = `/design-tool?loadDesign=${uniqueId}`;
  };

  const handleShareDesign = () => {
    if (!selectedDesign || !shareEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    shareDesignMutation.mutate({
      designId: selectedDesign.uniqueId,
      email: shareEmail,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">My Designs</h1>
              <p className="text-gray-600 mt-1">Manage and share your custom apparel designs</p>
            </div>
            <Button onClick={() => window.location.href = '/design-tool'}>
              Create New Design
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {designs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Edit className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designs yet</h3>
            <p className="text-gray-600 mb-6">Create your first custom apparel design to get started</p>
            <Button onClick={() => window.location.href = '/design-tool'}>
              Create Your First Design
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => {
              const product = products.find(p => p.id === design.productId);
              
              return (
                <Card key={design.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{design.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {product?.name || 'Custom Product'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {format(new Date(design.createdAt), "MMM dd")}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Design Preview */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                      <div className="relative w-16 h-20 bg-gray-300 rounded-t-lg rounded-b-sm">
                        <div className="absolute inset-2 bg-black/10 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-600">Design</span>
                        </div>
                      </div>
                    </div>

                    {/* Design ID */}
                    <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Design ID:</span> {design.uniqueId}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editDesign(design.uniqueId)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyDesignLink(design.uniqueId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDesign(design)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Share Design</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={handleShareDesign}
                              disabled={shareDesignMutation.isPending}
                              className="w-full"
                            >
                              {shareDesignMutation.isPending ? "Sending..." : "Send Design Link"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDesignMutation.mutate(design.id)}
                        disabled={deleteDesignMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}