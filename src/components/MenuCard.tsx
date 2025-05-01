import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { MealPlan } from "@/pages/Menu";
import { useToast } from "@/components/ui/use-toast";
import { Coins, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface MenuCardProps {
  plan: MealPlan;
}

const MenuCard: React.FC<MenuCardProps> = ({ plan }) => {
  const { addToCart } = useCart();
  const { subscription, tokens } = useSubscription();
  const { toast } = useToast();

  // Check if user has subscription and tokens
  if (!subscription?.active) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Subscribe to Order</h3>
            <p className="text-gray-500 mb-4">
              Get your meal subscription plan to start ordering delicious food.
            </p>
            <Link to="/subscription">
              <Button className="bg-campus-green hover:bg-campus-green/90">
                View Plans
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokens <= 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tokens Available</h3>
            <p className="text-gray-500 mb-4">
              You're subscribed but need more tokens to order meals.
            </p>
            <Link to="/tokens">
              <Button className="bg-campus-green hover:bg-campus-green/90">
                Get More Tokens
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }


  const handleAddToCart = () => {
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
          >
            <Coins className="mr-2 h-4 w-4" /> Order with Token
          </Button>
        </div>

      </CardFooter>
    </Card>
  );
};

export default MenuCard;