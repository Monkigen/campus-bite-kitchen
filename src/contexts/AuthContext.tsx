
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut, getCurrentUser } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | undefined>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<User | undefined>;
  signInWithEmail: (email: string, password: string) => Promise<User | undefined>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return user;
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "There was an error signing in with Google.",
        variant: "destructive",
      });
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const user = await signUpWithEmail(email, password, name);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      return user;
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return user;
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "There was an error signing in.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error signing out.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithEmail: handleSignInWithEmail,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
