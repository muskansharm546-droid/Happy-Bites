import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo, categories, setSelectedCategoryId, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribedCode, setSubscribedCode] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribedCode('HAPPYBITES50');
      showToast('Welcome to the Happy Bites club! Use code HAPPYBITES50 for ₹50 off.', 'success');
    }
  };

  const copyCoupon = () => {
    if (subscribedCode) {
      navigator.clipboard.writeText(subscribedCode);
      showToast('Coupon copied to clipboard!', 'info');
    }
  };

  return (
    <footer className="bg-[#2C1810] text-[#FEF3E2] pt-14 pb-8 border-t-4 border-orange-500">
      {/* 4 Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-[#3D2115] p-5 sm:p-6 rounded-3xl border border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">30 Min Delivery</h4>
              <p className="text-xs text-amber-200/70">Lightning fast to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Authentic</h4>
              <p className="text-xs text-amber-200/70">Direct from verified brand houses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Chilled Packaging</h4>
              <p className="text-xs text-amber-200/70">Zero chocolate melting guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Instant Support</h4>
              <p className="text-xs text-amber-200/70">7 days a week customer care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer inline-flex group"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md bg-[#FFF8F0] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/happy_bites_logo_6b2fcaa4.png"
                alt="Happy Bites Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-heading">
              Happy<span className="text-orange-500">Bites</span>
            </span>
          </div>

          <p className="text-sm text-amber-100/80 leading-relaxed max-w-sm">
            Happiness in Every Bite! Your one-stop destination for chocolates, crispy snacks, traditional Indian namkeen, cold drinks, fresh pastries, and luxury snack hampers.
          </p>

          {/* Newsletter Box */}
          <div className="bg-[#3D2115] p-4 rounded-2xl border border-amber-900/60 max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
              🎉 Get ₹50 OFF Your Order
            </span>
            <p className="text-xs text-amber-200/70 mb-3">
              Subscribe to unlock instant coupons & secret deals.
            </p>

            {subscribedCode ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Coupon Unlocked!</span>
                  <span className="text-sm font-mono font-bold text-white tracking-wider">{subscribedCode}</span>
                </div>
                <button
                  onClick={copyCoupon}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#24130B] border border-amber-900 text-white text-xs px-3 py-2 rounded-xl flex-1 outline-hidden focus:border-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <span>Claim</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Categories Column (12 Categories) */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-heading">
            Categories
          </h4>
          <ul className="space-y-2 text-xs text-amber-200/80">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    navigateTo('shop');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigateTo('categories')}
                className="text-orange-400 font-bold hover:underline"
              >
                View all 12 categories &rarr;
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-heading">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs text-amber-200/80">
            <li>
              <button onClick={() => navigateTo('track-order')} className="hover:text-orange-400 transition">
                Track Your Order
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('my-orders')} className="hover:text-orange-400 transition">
                Order History & Invoices
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-orange-400 transition">
                About Happy Bites
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-orange-400 transition">
                Contact & Support
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('faq')} className="hover:text-orange-400 transition">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('admin')} className="text-amber-400 hover:underline">
                Admin Store Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-heading">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-xs text-amber-200/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Happy Bites Hub, Central Snack Depot, Bandra West, Mumbai 400050</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>+91 1800-HAPPY-BITES (Toll Free)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>support@happybites.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Open 7:00 AM – 2:00 AM (Midnight Deliveries)</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
