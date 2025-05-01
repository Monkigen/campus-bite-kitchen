
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/CartItem";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, ArrowLeft, AlertCircle } from "lucide-react";
import { createOrder } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const TAX_RATE = 0.08;
  const DELIVERY_FEE = 2.99;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + (subtotal > 0 ? DELIVERY_FEE : 0);

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

    try {
      setProcessing(true);
      
      // Create order object
      const orderData = {
        items: cart,
        subtotal,
        tax,
        deliveryFee: DELIVERY_FEE,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Call Firebase function to create order
      // In a real app, we'd use the Firebase function
      // const orderId = await createOrder(currentUser.uid, orderData);
      
      // For this demo, simulate the order creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const orderId = "demo-" + Math.random().toString(36).substring(2, 10);
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed.`,
      });
      
      clearCart();
      navigate("/orders");
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
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${subtotal > 0 ? DELIVERY_FEE.toFixed(2) : '0.00'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-campus-green hover:bg-campus-green/90"
                disabled={cart.length === 0 || processing}
                onClick={handleCheckout}
              >
                {processing ? "Processing..." : "Checkout"}
              </Button>
            </CardFooter>
          </Card>

          {!currentUser && cart.length > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">You'll need to sign in before checkout.</p>
                <p className="text-gray-600 mt-1">
                  <Link to="/auth" className="text-campus-green hover:underline">
                    Sign in
                  </Link>{" "}
                  or create an account to complete your order.
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
