
import React, { useState } from "react";
import MenuCard from "@/components/MenuCard";
import CategoryTabs from "@/components/CategoryTabs";

export interface MealDay {
  day: string;
  image: string;
}

export interface MealPlan {
  id: string;
  title: string;
  type: string;
  description: string;
  price: number;
  images: { url: string }[];
  days: MealDay[];
}

// Meal plan data
const mealPlans: MealPlan[] = [
  {
    id: "breakfast-basic",
    title: "Break Fast",
    type: "Breakfast",
    description: "Break Fast with the best quality food in the town at the best price.",
    price: 1149,
    images: [
      { url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=500" }
    ],
    days: [
      { day: "WED", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=500" },
      { day: "THU", image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1613844237766-3163ba95bf31?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a23?q=80&w=500" }
    ]
  },
  {
    id: "breakfast-premium",
    title: "Break Fast",
    type: "Breakfast",
    description: "Hygene Break fast with the Minimum Cost & best quality food in the town.",
    price: 999,
    images: [
      { url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=500" }
    ],
    days: [
      { day: "WED", image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=500" },
      { day: "THU", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1613844237766-3163ba95bf31?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1526285759704-71853e88dc99?q=80&w=500" }
    ]
  },
  {
    id: "breakfast-deluxe",
    title: "Break Fast",
    type: "Breakfast",
    description: "Quality Break Fast using the best quality food in the town at the best price.",
    price: 1349,
    images: [
      { url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=500" }
    ],
    days: [
      { day: "WED", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500" },
      { day: "THU", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1613844237766-3163ba95bf31?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1649191742450-6cee3098b451?q=80&w=500" }
    ]
  },
  {
    id: "lunch-standard",
    title: "Lunch",
    type: "Lunch",
    description: "Quality Break Fast using the best quality food in the town at the best price.",
    price: 1949,
    images: [
      { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500" }
    ],
    days: [
      { day: "MON", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500" },
      { day: "TUE", image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=500" },
      { day: "WED", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500" },
      { day: "THU", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500" }
    ]
  },
  {
    id: "lunch-premium",
    title: "Lunch",
    type: "Lunch",
    description: "Quality Break Fast using the best quality food in the town at the best price.",
    price: 1449,
    images: [
      { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500" }
    ],
    days: [
      { day: "MON", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500" },
      { day: "TUE", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500" },
      { day: "WED", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500" },
      { day: "THU", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=500" }
    ]
  },
  {
    id: "custom-plan",
    title: "Custom Meal Plan",
    type: "Custom",
    description: "Design your own meal plan with your favorite dishes and preferred schedule.",
    price: 1699,
    images: [
      { url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=500" }
    ],
    days: [
      { day: "MON", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=500" },
      { day: "WED", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500" },
      { day: "FRI", image: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?q=80&w=500" },
      { day: "SAT", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=500" }
    ]
  }
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  
  // Define the meal plan categories
  const categories = ["Breakfast", "Lunch", "Custom"];

  // Filter plans by category
  const filteredPlans = activeCategory 
    ? mealPlans.filter(plan => plan.type === activeCategory) 
    : mealPlans;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      
      {/* Category Tabs */}
      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory} 
        onChange={setActiveCategory} 
      />

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPlans.map(plan => (
          <MenuCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No meal plans found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
