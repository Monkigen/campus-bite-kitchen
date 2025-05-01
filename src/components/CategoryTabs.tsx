
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory, 
  onChange 
}) => {
  return (
    <Tabs value={activeCategory} onValueChange={onChange} className="w-full">
      <TabsList className="flex w-full justify-center gap-4 pb-2 mb-6 scrollbar-hide">
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            className={`rounded-full px-8 py-2 text-base font-medium ${
              activeCategory === category 
                ? "bg-campus-green text-white" 
                : "border-2 border-campus-green text-campus-green"
            }`}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
