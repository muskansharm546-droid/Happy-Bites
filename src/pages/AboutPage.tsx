import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
          The Happy Bites Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2C1810] font-heading">
          Happiness in Every Bite!
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Born out of a deep passion for late-night munchies, afternoon tea breaks, and sweet festive indulgences, Happy Bites is India’s favorite online snacks & confectionery destination.
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-3xl overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80"
          alt="Chocolates"
          className="w-full h-64 object-cover rounded-2xl"
        />
        <img
          src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80"
          alt="Chips"
          className="w-full h-64 object-cover rounded-2xl"
        />
      </div>

      {/* Our Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">30-Min Delivery</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We partner with hyper-local hubs to ensure your cravings are satisfied almost instantly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Cold-Chain Packaging</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every chocolate bar and dessert is packed with food-safe cooling packs so it never melts in transit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">100% Authentic Brands</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Directly sourced from Cadbury, Nestlé, Haldirams, Lay’s, Amul, and top artisan bakers.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 rounded-3xl text-center shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black font-heading">
          Ready for a bite of pure joy?
        </h2>
        <p className="text-amber-100 text-xs sm:text-sm max-w-md mx-auto">
          Explore our range of over 500 hand-picked snacks, chocolates, and festive gift boxes.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-white text-[#2C1810] font-black rounded-2xl text-xs sm:text-sm hover:bg-amber-50 transition shadow-md"
        >
          Explore All Snacks &rarr;
        </button>
      </div>
    </div>
  );
};
