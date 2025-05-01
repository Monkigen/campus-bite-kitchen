
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import OrderQRCode from "@/components/OrderQRCode";
import { Coins, AlertCircle, CalendarDays, RefreshCw } from "lucide-react";

const TokensPage = () => {
  const { currentUser } = useAuth();
  const { subscription, tokens, loading, refreshSubscription } = useSubscription();
  const [showQRExample, setShowQRExample] = useState(false);
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Coins size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="mb-6">Please sign in to view your tokens and subscription.</p>
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
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-8">
          <div className="flex flex-col items-center justify-center">
            <RefreshCw size={48} className="animate-spin text-campus-green mb-4" />
            <p>Loading your subscription details...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Tokens & Subscription</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Token Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coins className="mr-2" /> Your Tokens
            </CardTitle>
            <CardDescription>Use tokens to order meals before 8:10 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-6xl font-bold text-campus-green">{tokens}</div>
              <div className="text-xl ml-2">tokens</div>
            </div>
            
            {tokens <= 0 && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start gap-2 mt-2">
                <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">You have no tokens available</p>
                  <p className="text-sm mt-1">
                    Subscribe to a meal plan to receive tokens for ordering meals.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full">
              {tokens > 0 && (
                <Button 
                  className="w-full mb-3 bg-campus-green hover:bg-campus-green/90"
                  onClick={() => setShowQRExample(true)}
                >
                  View QR Code Demo
                </Button>
              )}
              <Link to="/subscription" className="w-full">
                <Button variant="outline" className="w-full">
                  Get More Tokens
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2" /> Subscription Details
            </CardTitle>
            <CardDescription>
              {subscription?.active 
                ? `Your ${subscription?.plan} is currently active`
                : "You don't have an active subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan:</span>
                  <span>{subscription.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {subscription.active ? "Active" : "Expired"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Start Date:</span>
                  <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">End Date:</span>
                  <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500">
                    Remember to place your orders before 8:10 AM to use your tokens for the day's meals.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-6">You haven't subscribed to any meal plan yet.</p>
                <Link to="/subscription">
                  <Button className="bg-campus-green hover:bg-campus-green/90">
                    Browse Subscription Plans
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={refreshSubscription}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Subscription Data
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* QR Code Modal Example */}
      {showQRExample && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <OrderQRCode 
              orderId="example-order-123" 
              onClose={() => setShowQRExample(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensPage;
