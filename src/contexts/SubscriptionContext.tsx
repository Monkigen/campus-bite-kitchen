
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface Subscription {
  plan: string;
  tokens: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface SubscriptionContextProps {
  subscription: Subscription | null;
  tokens: number;
  loading: boolean;
  canPlaceOrder: boolean;
  useToken: () => Promise<boolean>;
  checkOrderTimeValidity: () => boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [tokens, setTokens] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Check if the current time allows for placing orders (before 8:10 AM)
  const checkOrderTimeValidity = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    // Orders can be placed before 8:10 AM
    return hour < 8 || (hour === 8 && minutes < 10);
  };

  // Check if user can place an order (has tokens and subscription is active)
  const canPlaceOrder = tokens > 0 && subscription?.active === true && checkOrderTimeValidity();

  // Use a token for an order
  const useToken = async (): Promise<boolean> => {
    if (!currentUser || tokens <= 0 || !subscription?.active) {
      return false;
    }

    try {
      const newTokenCount = tokens - 1;
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { tokens: newTokenCount });
      setTokens(newTokenCount);
      
      toast({
        title: "Token used",
        description: `You have ${newTokenCount} tokens remaining.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error using token:", error);
      toast({
        title: "Error",
        description: "Failed to use token. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setTokens(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        if (userData.subscription) {
          // Check if subscription is still active
          const endDate = new Date(userData.subscription.endDate);
          const now = new Date();
          
          if (endDate < now && userData.subscription.active) {
            // Subscription has expired, update it
            await updateDoc(userRef, {
              "subscription.active": false
            });
            userData.subscription.active = false;
            
            toast({
              title: "Subscription expired",
              description: "Your subscription has expired. Please renew to continue ordering meals.",
              variant: "destructive",
            });
          }
          
          setSubscription(userData.subscription);
          setTokens(userData.tokens || 0);
        } else {
          setSubscription(null);
          setTokens(userData.tokens || 0);
        }
      } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          tokens: 0,
          createdAt: new Date().toISOString(),
        });
        
        setSubscription(null);
        setTokens(0);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load subscription data on mount and when user changes
  useEffect(() => {
    refreshSubscription();
  }, [currentUser]);

  const value = {
    subscription,
    tokens,
    loading,
    canPlaceOrder,
    useToken,
    checkOrderTimeValidity,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
