
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Clock, BadgeCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-white py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Campus<span className="text-campus-orange">Bite</span> Kitchen
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 animate-fade-in">
            Delicious, fresh meals delivered right to your dorm or campus location. No more waiting in long cafeteria lines!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Link to="/menu">
              <Button size="lg" className="bg-campus-green hover:bg-campus-green/90">
                Explore Our Menu
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CampusBite?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="bg-campus-green/10 p-4 rounded-full mb-4">
                <UtensilsCrossed size={32} className="text-campus-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Delicious Food</h3>
              <p className="text-gray-600">
                Our menu is crafted by professional chefs using fresh, quality ingredients for meals that satisfy.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="bg-campus-orange/10 p-4 rounded-full mb-4">
                <Clock size={32} className="text-campus-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery to your dorm or anywhere on campus, so you can focus on what matters most.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="bg-campus-yellow/10 p-4 rounded-full mb-4">
                <BadgeCheck size={32} className="text-campus-yellow" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Meal Plans</h3>
              <p className="text-gray-600">
                Save with our flexible meal subscription plans designed specifically for busy students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-campus-green/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order Your First Meal?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Join hundreds of satisfied students enjoying convenient, delicious meals delivered across campus.
          </p>
          <Link to="/menu">
            <Button size="lg" className="bg-campus-green hover:bg-campus-green/90">
              Browse Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Campus<span className="text-campus-orange">Bite</span></h2>
              <p className="text-sm text-gray-400 mt-1">Delicious food delivered on campus</p>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/menu" className="hover:text-campus-orange transition-colors">Menu</Link>
              <Link to="/orders" className="hover:text-campus-orange transition-colors">Orders</Link>
              <Link to="/auth" className="hover:text-campus-orange transition-colors">Sign In</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CampusBite Kitchen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
