
import React from "react";
import { useCart, CartItem as CartItemType } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex border-b border-gray-200 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
          </div>
          <p className="text-right font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              className="h-8 w-8 rounded-r-none"
            >
              <Minus size={14} />
            </Button>
            <span className="px-3 py-1">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 rounded-l-none"
            >
              <Plus size={14} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
