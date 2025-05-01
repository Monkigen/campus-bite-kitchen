
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { MealPlan } from "@/pages/Menu";
import { useToast } from "@/components/ui/use-toast";
import { Coins, AlertCircle } from "lucide-react";

interface MenuCardProps {
  plan: MealPlan;
}

const MenuCard: React.FC<MenuCardProps> = ({ plan }) => {
  const { addToCart } = useCart();
  const { tokens, canPlaceOrder, checkOrderTimeValidity } = useSubscription();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!canPlaceOrder) {
      if (tokens <= 0) {
        toast({
          title: "No tokens available",
          description: "You need to subscribe to get tokens for ordering meals.",
          variant: "destructive",
        });
        return;
      }
      
      if (!checkOrderTimeValidity()) {
        toast({
          title: "Order time expired",
          description: "Orders can only be placed before 8:10 AM.",
          variant: "destructive",
        });
        return;
      }
    }
    
    addToCart({
      id: plan.id,
      name: plan.title,
      description: plan.description,
      price: plan.price,
      category: plan.type,
      image: plan.images[0].url
    });
    
    toast({
      title: "Added to cart",
      description: "This will use 1 token when you complete your order.",
    });
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-xl h-full flex flex-col animate-fade-in">
      <div className="bg-soft-green p-6 rounded-t-xl">
        <h3 className="font-bold text-2xl mb-4 text-center">{plan.title}</h3>
        <div className="grid grid-cols-2 gap-6">
          {plan.days.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <p className="font-semibold text-gray-700">{day.day}</p>
              <div className="rounded-full overflow-hidden w-32 h-32 bg-white">
                <img
                  src={day.image}
                  alt={`${day.day} meal`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardContent className="pt-4 flex-grow">
        <p className="text-gray-600 text-base mt-1">{plan.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4 gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="text-2xl font-bold text-campus-green">₹{plan.price}</div>
          <Button 
            onClick={handleAddToCart} 
            className="bg-campus-green hover:bg-campus-green/90"
            disabled={!canPlaceOrder}
          >
            <Coins className="mr-2 h-4 w-4" /> Order with Token
          </Button>
        </div>
        
        {!canPlaceOrder && (
          <div className="w-full text-sm flex items-start gap-2 bg-yellow-50 p-2 rounded-md border border-yellow-200">
            <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
            <span>
              {tokens <= 0 
                ? "You need to subscribe to get tokens for ordering."
                : "Orders can only be placed before 8:10 AM."}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
