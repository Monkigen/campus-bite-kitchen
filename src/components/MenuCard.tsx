
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart, MenuItem } from "@/contexts/CartContext";
import { PlusCircle } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <Card className="overflow-hidden border border-gray-200 h-full flex flex-col animate-fade-in">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-campus-orange text-white px-2 py-1 rounded-full text-xs font-medium">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-campus-green hover:bg-campus-green/90 gap-2"
        >
          <PlusCircle size={16} />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
