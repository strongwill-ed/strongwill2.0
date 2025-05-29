import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingBag, Award, Users, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders/user", user?.id],
    enabled: !!user,
  });

  const { data: designs = [] } = useQuery({
    queryKey: ["/api/designs/user", user?.id],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
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

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Designs Created",
      value: designs.length,
      icon: Award,
      color: "bg-green-500",
    },
    {
      title: "Member Since",
      value: new Date(user.createdAt || Date.now()).getFullYear(),
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <Badge variant="outline" className="mt-1">
                  {user.role}
                </Badge>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases and order status</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order: any) => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">${order.totalAmount}</p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
              <Link href="/orders">
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Design Portfolio</CardTitle>
              <CardDescription>Your custom designs and creations</CardDescription>
            </CardHeader>
            <CardContent>
              {designs.length > 0 ? (
                <div className="space-y-3">
                  {designs.slice(0, 3).map((design: any) => (
                    <div key={design.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{design.name}</p>
                        <p className="text-sm text-gray-600">{design.productType}</p>
                      </div>
                      <Badge variant="outline">Design</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No designs created yet</p>
              )}
              <Link href="/design-tool">
                <Button variant="outline" className="w-full mt-4">
                  Create New Design
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}