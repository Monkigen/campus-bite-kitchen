
import React, { useEffect, useState } from "react";
import { getMenuItems } from "@/lib/firebase";
import MenuCard from "@/components/MenuCard";
import CategoryTabs from "@/components/CategoryTabs";
import { MenuItem } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

// Temp menu data until Firebase is set up with real data
const tempMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheese, lettuce, tomato, and our special sauce",
    price: 8.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500"
  },
  {
    id: "2",
    name: "Veggie Delight Pizza",
    description: "Fresh bell peppers, mushrooms, onions, and olives on our signature crust",
    price: 10.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=500"
  },
  {
    id: "3",
    name: "Crispy Chicken Tenders",
    description: "Hand-breaded chicken tenders served with your choice of dipping sauce",
    price: 7.99,
    category: "Chicken",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=500"
  },
  {
    id: "4",
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken, avocado, and balsamic vinaigrette",
    price: 9.49,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500"
  },
  {
    id: "5",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni pizza with our signature tomato sauce and mozzarella",
    price: 11.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=500"
  },
  {
    id: "6",
    name: "Buffalo Chicken Wrap",
    description: "Spicy buffalo chicken with lettuce, tomato, and ranch in a flour tortilla",
    price: 8.49,
    category: "Wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500"
  }
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Try to fetch items from Firebase
        // const items = await getMenuItems();
        // if (items.length > 0) {
        //   setMenuItems(items);
        // } else {
          // If no items are found or for demo purposes, use tempMenuItems
          setMenuItems(tempMenuItems);
        // }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to load menu items. Please try again.");
        // Fallback to temp data
        setMenuItems(tempMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Extract unique categories
  const categories = [...new Set(menuItems.map(item => item.category))];

  // Filter items by category
  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      
      {/* Category Tabs */}
      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory} 
        onChange={setActiveCategory} 
      />

      {error && (
        <div className="text-red-500 text-center mb-6">{error}</div>
      )}

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
