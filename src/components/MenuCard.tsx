
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { MealPlan } from "@/pages/Menu";

interface MenuCardProps {
  plan: MealPlan;
}

const MenuCard: React.FC<MenuCardProps> = ({ plan }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: plan.id,
      name: plan.title,
      description: plan.description,
      price: plan.price,
      category: plan.type,
      image: plan.images[0].url
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
      <CardFooter className="flex justify-between items-center pt-2 pb-4">
        <div className="text-2xl font-bold text-campus-green">₹{plan.price}</div>
        <Button 
          onClick={handleAddToCart} 
          className="bg-campus-green hover:bg-campus-green/90"
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
