
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, ShoppingBag, ClipboardList } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
}

// Sample order data
const sampleOrders: Order[] = [
  {
    id: "order-001",
    items: [
      { id: "1", name: "Classic Cheeseburger", price: 8.99, quantity: 2 },
      { id: "3", name: "Crispy Chicken Tenders", price: 7.99, quantity: 1 }
    ],
    subtotal: 25.97,
    tax: 2.08,
    deliveryFee: 2.99,
    total: 31.04,
    status: "delivered",
    createdAt: "2023-05-01T14:30:00Z"
  },
  {
    id: "order-002",
    items: [
      { id: "2", name: "Veggie Delight Pizza", price: 10.99, quantity: 1 },
      { id: "4", name: "Grilled Chicken Salad", price: 9.49, quantity: 1 }
    ],
    subtotal: 20.48,
    tax: 1.64,
    deliveryFee: 2.99,
    total: 25.11,
    status: "pending",
    createdAt: "2023-05-02T18:15:00Z"
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "preparing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "delivering":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          // Normally, we'd fetch from Firebase
          // const ordersData = await getUserOrders(currentUser.uid);
          // setOrders(ordersData);
          
          // For demo purposes, use sample data
          await new Promise(resolve => setTimeout(resolve, 1000));
          setOrders(sampleOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="mb-6">Please sign in to view your order history.</p>
            <Link to="/auth">
              <Button className="bg-campus-green hover:bg-campus-green/90">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Separator />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle className="text-lg">
                    <span className="text-campus-green">Order #{order.id}</span>
                  </CardTitle>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">
                      {formatDate(order.createdAt)}
                    </span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex">
                        <span className="text-gray-500">{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Receipt size={16} className="mr-2" />
                  View Receipt
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <ShoppingBag size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders. Start by exploring our menu!
              </p>
              <Link to="/menu">
                <Button className="bg-campus-green hover:bg-campus-green/90">
                  Browse Menu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
