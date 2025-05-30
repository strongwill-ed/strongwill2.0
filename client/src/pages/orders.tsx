import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Package, Calendar, DollarSign, ArrowLeft } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your orders</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <Link href="/profile">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${order.totalAmount}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status || 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Payment Status:</span>
                          <span className="ml-2 font-medium">{order.paymentStatus || 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Shipping Address:</span>
                          <span className="ml-2 font-medium">
                            {order.shippingAddress || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                              <div>
                                <p className="font-medium">{item.productName || `Item ${index + 1}`}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                  {item.size && ` • Size: ${item.size}`}
                                  {item.color && ` • Color: ${item.color}`}
                                </p>
                              </div>
                              <span className="font-medium">${item.unitPrice || item.productPrice || '0.00'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Need help? <Link href="/contact" className="text-black hover:underline">Contact Support</Link>
                      </div>
                      <div className="flex space-x-2">
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/sponsorship-order/${order.id}`)}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            Apply Sponsorship
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}