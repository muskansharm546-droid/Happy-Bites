import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  Star,
  Percent,
  CheckCircle,
  Truck,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { TESTIMONIALS } from '../data/mockData';

const HERO_SPRINKLES = [
  // Top left zone
  { top: '6%', left: '3%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-45', color: 'bg-pink-400' },
  { top: '12%', left: '8%', width: 'w-3', height: 'h-1.5', rotate: '-rotate-25', color: 'bg-amber-300' },
  { top: '19%', left: '3%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-emerald-400' },
  { top: '26%', left: '7%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-12', color: 'bg-sky-400' },
  { top: '7%', left: '15%', width: 'w-3.5', height: 'h-1.5', rotate: '-rotate-60', color: 'bg-purple-400' },
  { top: '15%', left: '20%', width: 'w-2', height: 'h-2', rotate: 'rotate-45', color: 'bg-orange-400' },
  { top: '29%', left: '13%', width: 'w-3', height: 'h-1.5', rotate: 'rotate-75', color: 'bg-rose-400' },

  // Top center zone
  { top: '4%', left: '30%', width: 'w-3.5', height: 'h-1.5', rotate: '-rotate-35', color: 'bg-yellow-300' },
  { top: '10%', left: '38%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-pink-300' },
  { top: '3%', left: '48%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-30', color: 'bg-teal-300' },
  { top: '8%', left: '58%', width: 'w-3', height: 'h-1.5', rotate: '-rotate-50', color: 'bg-amber-400' },
  { top: '13%', left: '50%', width: 'w-2', height: 'h-2', rotate: 'rotate-12', color: 'bg-sky-300' },

  // Top right zone
  { top: '6%', right: '27%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-65', color: 'bg-pink-400' },
  { top: '4%', right: '17%', width: 'w-3', height: 'h-1.5', rotate: '-rotate-15', color: 'bg-emerald-300' },
  { top: '10%', right: '10%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-yellow-300' },
  { top: '7%', right: '3%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-45', color: 'bg-sky-400' },
  { top: '15%', right: '5%', width: 'w-3.5', height: 'h-1.5', rotate: '-rotate-40', color: 'bg-orange-400' },
  { top: '22%', right: '12%', width: 'w-3', height: 'h-1.5', rotate: 'rotate-80', color: 'bg-purple-300' },

  // Mid right & edges
  { top: '36%', right: '3%', width: 'w-2', height: 'h-2', rotate: 'rotate-45', color: 'bg-rose-400' },
  { top: '48%', right: '2%', width: 'w-4', height: 'h-1.5', rotate: '-rotate-20', color: 'bg-amber-300' },
  { top: '60%', right: '4%', width: 'w-3', height: 'h-1.5', rotate: 'rotate-35', color: 'bg-teal-400' },
  { top: '72%', right: '2%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-yellow-400' },

  // Mid left & edges
  { top: '42%', left: '2%', width: 'w-3.5', height: 'h-1.5', rotate: 'rotate-50', color: 'bg-emerald-300' },
  { top: '55%', left: '3%', width: 'w-2', height: 'h-2', rotate: 'rotate-45', color: 'bg-pink-400' },
  { top: '68%', left: '1%', width: 'w-4', height: 'h-1.5', rotate: '-rotate-30', color: 'bg-amber-300' },
  { top: '80%', left: '4%', width: 'w-3', height: 'h-1.5', rotate: 'rotate-70', color: 'bg-sky-400' },

  // Bottom left & center
  { bottom: '8%', left: '8%', width: 'w-3.5', height: 'h-1.5', rotate: '-rotate-45', color: 'bg-purple-400' },
  { bottom: '15%', left: '17%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-orange-400' },
  { bottom: '6%', left: '24%', width: 'w-4', height: 'h-1.5', rotate: 'rotate-20', color: 'bg-rose-400' },
  { bottom: '13%', left: '33%', width: 'w-3', height: 'h-1.5', rotate: '-rotate-60', color: 'bg-yellow-300' },
  { bottom: '4%', left: '44%', width: 'w-2', height: 'h-2', rotate: 'rotate-45', color: 'bg-emerald-400' },
  { bottom: '10%', left: '54%', width: 'w-3.5', height: 'h-1.5', rotate: 'rotate-40', color: 'bg-sky-300' },

  // Bottom right zone
  { bottom: '16%', right: '29%', width: 'w-2', height: 'h-2', rotate: 'rotate-0', color: 'bg-pink-400' },
  { bottom: '6%', right: '21%', width: 'w-4', height: 'h-1.5', rotate: '-rotate-35', color: 'bg-amber-400' },
  { bottom: '12%', right: '13%', width: 'w-3', height: 'h-1.5', rotate: 'rotate-65', color: 'bg-teal-300' },
  { bottom: '5%', right: '5%', width: 'w-3.5', height: 'h-1.5', rotate: '-rotate-15', color: 'bg-rose-400' },
  { bottom: '20%', right: '7%', width: 'w-2', height: 'h-2', rotate: 'rotate-45', color: 'bg-purple-300' },
];

export const HomePage: React.FC = () => {
  const { products, categories, navigateTo, setSelectedCategoryId } = useApp();

  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero banner mode: default to the official illustrated banner
  const [heroBannerMode, setHeroBannerMode] = useState<'illustrated' | 'chocolate'>('illustrated');

  const bestSellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const trendingProducts = products.filter((p) => p.rating >= 4.8 || p.isTrending).slice(0, 8);
  const dealProducts = products.filter((p) => p.discountPercent >= 15 || p.isDeal).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Style Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Small Bites. Big Happiness.</span>
            </span>
            <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
              Official Happy Bites Visual Edition
            </span>
          </div>

          <div className="inline-flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold text-stone-600 shadow-xs">
            <button
              onClick={() => setHeroBannerMode('illustrated')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                heroBannerMode === 'illustrated'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'hover:text-stone-900'
              }`}
            >
              <span>✨ Illustrated Banner</span>
            </button>
            <button
              onClick={() => setHeroBannerMode('chocolate')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                heroBannerMode === 'chocolate'
                  ? 'bg-[#2C1810] text-amber-200 shadow-sm'
                  : 'hover:text-stone-900'
              }`}
            >
              <span>🍫 Chocolate & Sprinkles</span>
            </button>
          </div>
        </div>

        {heroBannerMode === 'illustrated' ? (
          /* Official Illustrated Hero Banner */
          <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-amber-900/30 bg-[#FFF5EB] group">
            {/* The cropped image to smoothly hide the static navbar header in the mockup */}
            <div className="relative overflow-hidden w-full -mt-[6.8%] sm:-mt-[6.2%] lg:-mt-[5.8%]">
              <img
                src="/assets/aistudio/babykobasepsndh_4d052486.png"
                alt="Happy Bites - Small Bites. Big Happiness."
                className="w-full h-auto object-cover block select-none"
              />

              {/* Interactive Clickable Hotspot over "Shop Now" button in the graphic */}
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  navigateTo('shop');
                }}
                className="absolute left-[7.5%] sm:left-[12%] bottom-[16%] sm:bottom-[23%] px-4 sm:px-8 py-2 sm:py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-full text-xs sm:text-base shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2 group/btn cursor-pointer"
                title="Shop Happy Bites Snacks Now"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {/* Interactive Hotspot over the smiling bowl to open snack categories */}
              <div
                onClick={() => navigateTo('categories')}
                className="absolute right-[10%] bottom-[10%] w-[45%] h-[62%] cursor-pointer group/bowl"
                title="Explore All Categories"
              >
                <div className="opacity-0 group-hover/bowl:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1.5 rounded-full absolute bottom-4 right-10 shadow-lg flex items-center gap-1.5 pointer-events-none">
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explore 12 Snack Categories</span>
                </div>
              </div>
            </div>

            {/* Bottom Value Badges Strip matching the artwork's 3 pillars */}
            <div className="grid grid-cols-3 divide-x divide-stone-200 border-t border-amber-900/10 bg-amber-50/70 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-extrabold text-xs sm:text-sm text-stone-800">Premium Quality</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-extrabold text-xs sm:text-sm text-stone-800">Irresistible Taste</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-extrabold text-xs sm:text-sm text-stone-800">Fast & Fresh Delivery</span>
              </div>
            </div>
          </div>
        ) : (
          /* Chocolate & Sprinkles Hero Banner */
          <div className="relative overflow-hidden bg-gradient-to-br from-[#2C1810] via-[#4A2810] to-[#201008] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 rounded-3xl sm:rounded-[2.5rem] shadow-2xl">
            {/* Glow ambient circles */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Colorful Confectionery Candy Sprinkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {HERO_SPRINKLES.map((s, idx) => (
                <span
                  key={idx}
                  className={`absolute ${s.width} ${s.height} ${s.color} ${s.rotate} rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.6)] opacity-90 transition-transform duration-300 hover:scale-125`}
                  style={{
                    top: s.top,
                    bottom: s.bottom,
                    left: s.left,
                    right: s.right,
                  }}
                />
              ))}
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-amber-500/20 border border-orange-500/40 text-amber-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>Happiness in Every Bite! • 30 Min Express Delivery</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.15]">
                    Welcome to <br />
                    <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                      Happy Bites
                    </span>
                  </h1>
                  <p className="text-base sm:text-xl text-amber-100/90 font-medium">
                    Your Favourite Snacks, Just a Click Away!
                  </p>
                </div>

                <p className="text-sm sm:text-base text-amber-200/75 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Order gourmet chocolates, crunchy chips, authentic desi namkeen, midnight noodles, cold beverages, and fresh bakery treats delivered to your door in 30 minutes!
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      navigateTo('shop');
                    }}
                    className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl text-sm sm:text-base transition shadow-xl shadow-orange-500/30 flex items-center gap-2 group active:scale-95 cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigateTo('categories')}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-amber-100 border border-white/20 font-bold rounded-2xl text-sm sm:text-base transition backdrop-blur-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>12 Categories</span>
                  </button>
                </div>

                {/* Quick stats badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-amber-900/40 text-left max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-amber-300">500+</p>
                    <p className="text-[11px] text-amber-200/70">Snacks & Treats</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-orange-400">30 Min</p>
                    <p className="text-[11px] text-amber-200/70">Doorstep Delivery</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400">4.9 ★</p>
                    <p className="text-[11px] text-amber-200/70">Customer Love</p>
                  </div>
                </div>
              </div>

              {/* Right Hero Visual Cards */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md">
                  {/* Main Photo Banner with the new Happy Bites artwork */}
                  <div className="relative rounded-3xl overflow-hidden border-4 border-amber-900/60 shadow-2xl aspect-4/3 sm:aspect-square group/card">
                    <img
                      src="/assets/aistudio/babykobasepsndh_4d052486.png"
                      alt="Happy Bites Signature treats"
                      className="w-full h-full object-cover object-right transform group-hover/card:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                        Official Mascot & Treats
                      </span>
                      <p className="text-lg font-black text-white">Small Bites. Big Happiness.</p>
                      <p className="text-xs text-amber-200/80">Fresh cookies, chocolates & snack bowls</p>
                    </div>
                  </div>

                  {/* Floating Promo Pill 1 */}
                  <div className="absolute -top-4 -left-4 bg-white text-stone-900 p-3 rounded-2xl shadow-xl border border-amber-200 flex items-center gap-2.5 animate-bounce-slow">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-stone-900">Code: HAPPYBITES50</p>
                      <p className="text-[10px] text-emerald-600 font-bold">Flat ₹50 OFF</p>
                    </div>
                  </div>

                  {/* Floating Promo Pill 2 */}
                  <div className="absolute -bottom-4 -right-4 bg-[#3D2115] text-amber-100 p-3 rounded-2xl shadow-xl border border-amber-800 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-white">Free Express Drop</p>
                      <p className="text-[10px] text-amber-300">Orders above ₹499</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Featured Categories Quick Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Layers className="w-4 h-4" />
              <span>Explore The Snackverse</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
              Shop by Categories
            </h2>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All 12 Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                navigateTo('shop');
              }}
              className="group cursor-pointer bg-white rounded-2xl border border-stone-200/90 hover:border-orange-400 p-3 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-between"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-amber-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-orange-600 transition line-clamp-1">
                {cat.name}
              </h3>
              {cat.badge && (
                <span className="mt-1 text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                  {cat.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Daily Flash Deals Banner with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2C1810] via-[#3E2114] to-[#251209] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-900/50">
          {/* Subtle Warm Glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-amber-900/40">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/20 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-orange-500/30">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span>Special Discounts & Flash Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Today’s Craving Specials – Up to 25% OFF
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80">
                Hurry up! Fresh discounts refresh when the timer strikes zero.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2">
              <div className="bg-[#1E0F0A]/90 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-center min-w-[58px] border border-amber-500/30 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase font-bold text-amber-200/90 tracking-wider">Hours</span>
              </div>
              <span className="text-2xl font-bold text-orange-400/80">:</span>
              <div className="bg-[#1E0F0A]/90 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-center min-w-[58px] border border-amber-500/30 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase font-bold text-amber-200/90 tracking-wider">Mins</span>
              </div>
              <span className="text-2xl font-bold text-orange-400/80">:</span>
              <div className="bg-[#1E0F0A]/90 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-center min-w-[58px] border border-amber-500/30 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase font-bold text-amber-200/90 tracking-wider">Secs</span>
              </div>
            </div>
          </div>

          {/* Deal Products Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-stone-900">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best-Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
              Best-Selling Products
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryId(null);
              navigateTo('shop');
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>See All Best Sellers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Promotional Banner (Hamper & Midnight Munchies) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#3D1C06] to-[#5C2B0B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-amber-900/60 shadow-lg">
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-800/80">
                Gift Hamper Specials
              </span>
              <h3 className="text-2xl font-black font-heading leading-tight">
                Cadbury Silk Royal Celebration Box
              </h3>
              <p className="text-xs text-amber-200/80">
                Make your loved ones smile with gold embossed hampers filled with assorted Silk chocolate bars.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCategoryId('gift-hampers');
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <span>Explore Hampers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&auto=format&fit=crop&q=80"
              alt="Hampers"
              className="absolute -right-10 -bottom-10 w-60 h-60 object-cover rounded-full opacity-60 md:opacity-90 pointer-events-none"
            />
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-stone-800 shadow-lg">
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/80">
                Late Night Cravings
              </span>
              <h3 className="text-2xl font-black font-heading leading-tight">
                Midnight Munchies Snack Pack
              </h3>
              <p className="text-xs text-stone-300">
                Binge watch favorite: Pringles, spicy noodles, chips, and chilled soda delivered till 2 AM!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <span>Order Midnight Pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&auto=format&fit=crop&q=80"
              alt="Midnight snacks"
              className="absolute -right-10 -bottom-10 w-60 h-60 object-cover rounded-full opacity-60 md:opacity-90 pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* 6. Trending Munchies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              <TrendingUp className="w-4 h-4" />
              <span>Viral Hits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
              Trending Snack Delights
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryId(null);
              navigateTo('shop');
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Browse All Snacks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full">
            Real Reviews From Real Foodies
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
            Loved by Over 50,000 Snackers
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            See what our happy customers have to say about their fast deliveries and fresh snacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">{t.name}</h4>
                  <p className="text-[11px] text-stone-500">{t.location}</p>
                </div>
                <span className="ml-auto text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  {t.favorite}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
