
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/CartItem";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ShoppingCart, ArrowLeft, AlertCircle, Clock, Coins } from "lucide-react";
import { createOrder } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import OrderQRCode from "@/components/OrderQRCode";

const Cart = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { tokens, canPlaceOrder, checkOrderTimeValidity, useToken } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to complete your order",
        variant: "destructive",
      });
      navigate("/auth", { state: { redirect: "/cart" } });
      return;
    }

    if (!canPlaceOrder) {
      if (tokens <= 0) {
        toast({
          title: "No tokens available",
          description: "You need to subscribe to get tokens for ordering meals.",
          variant: "destructive",
        });
        navigate("/subscription");
      } else {
        toast({
          title: "Order time expired",
          description: "Orders can only be placed before 8:10 AM.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setProcessing(true);
      
      // Create order object
      const orderData = {
        items: cart,
        subtotal,
        status: "pending",
        createdAt: new Date().toISOString(),
        usingTokens: true,
      };

      // For this demo, simulate the order creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const orderId = "demo-" + Math.random().toString(36).substring(2, 10);
      
      // Use a token for this order
      const tokenUsed = await useToken();
      
      if (!tokenUsed) {
        throw new Error("Failed to use token for this order");
      }
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed.`,
      });
      
      setCompletedOrder(orderId);
      clearCart();
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: error.message || "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // If order is completed, show QR code
  if (completedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Order Successful!</h1>
        <div className="max-w-md mx-auto">
          <OrderQRCode orderId={completedOrder} />
          <div className="mt-8 text-center">
            <p className="mb-4 text-gray-600">
              Your order has been placed successfully. Show this QR code to receive your meal.
            </p>
            <Link to="/menu">
              <Button className="bg-campus-green hover:bg-campus-green/90">
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center">
                  <ShoppingCart size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven't added any items to your cart yet.
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

          {/* Back to Menu Link */}
          <div className="mt-6">
            <Link to="/menu" className="inline-flex items-center text-campus-green hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items in cart</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens required</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between">
                  <span>Your available tokens</span>
                  <span className={tokens > 0 ? "text-campus-green font-bold" : "text-red-500 font-bold"}>
                    {tokens}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center font-semibold">
                  <Coins className="mr-2 h-4 w-4 text-campus-green" />
                  <span>Pay with meal token</span>
                </div>
                
                {/* Order time check */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {checkOrderTimeValidity() ? (
                    <span className="text-green-600">Order before 8:10 AM: Available</span>
                  ) : (
                    <span className="text-red-500">Order before 8:10 AM: Expired</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-campus-green hover:bg-campus-green/90"
                disabled={cart.length === 0 || processing || !canPlaceOrder}
                onClick={handleCheckout}
              >
                {processing ? "Processing..." : "Place Order with Token"}
              </Button>
            </CardFooter>
          </Card>

          {!currentUser && cart.length > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">You'll need to sign in before ordering.</p>
                <p className="text-gray-600 mt-1">
                  <Link to="/auth" className="text-campus-green hover:underline">
                    Sign in
                  </Link>{" "}
                  or create an account to complete your order.
                </p>
              </div>
            </div>
          )}
          
          {currentUser && tokens <= 0 && cart.length > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">You don't have any meal tokens</p>
                <p className="text-gray-600 mt-1">
                  <Link to="/subscription" className="text-campus-green hover:underline">
                    Subscribe to a meal plan
                  </Link>{" "}
                  to receive tokens for ordering.
                </p>
              </div>
            </div>
          )}
          
          {currentUser && tokens > 0 && !checkOrderTimeValidity() && cart.length > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Order time has expired</p>
                <p className="text-gray-600 mt-1">
                  Orders can only be placed before 8:10 AM for the day's meals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
