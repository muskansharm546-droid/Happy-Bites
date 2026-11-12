import React from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderConfirmationPage: React.FC = () => {
  const { latestOrder, orders, trackOrderId, setTrackOrderId, navigateTo } = useApp();

  const currentOrder =
    latestOrder || (trackOrderId ? orders.find((o) => o.id === trackOrderId) : orders[0]);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">No recent order found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setTrackOrderId(currentOrder.id);
    navigateTo('track-order');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Celebratory Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-3xl text-center shadow-xl space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-200" />
        </div>

        <span className="inline-block text-xs uppercase font-extrabold tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
          Order Confirmed & In Progress
        </span>

        <h1 className="text-3xl font-black font-heading">
          Thank You for Snacking with Happy Bites!
        </h1>

        <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
          Your order <span className="font-mono font-bold text-white bg-black/20 px-2 py-0.5 rounded-md">#{currentOrder.id}</span> has been placed successfully. Our kitchen and delivery partner are preparing your snacks!
        </p>
      </div>

      {/* Order Status & Delivery Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-stone-100 text-xs">
          <div>
            <span className="text-stone-400 block mb-1">Estimated Delivery</span>
            <span className="font-bold text-stone-900 text-sm flex items-center gap-1 text-orange-600">
              <Clock className="w-4 h-4" /> 30-45 Minutes
            </span>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Payment Method</span>
            <span className="font-bold text-stone-900 text-sm uppercase">
              {currentOrder.paymentMethod} •{' '}
              <span className="text-emerald-600 font-semibold">{currentOrder.paymentStatus}</span>
            </span>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Total Paid</span>
            <span className="font-bold text-[#2C1810] text-base">
              ₹{currentOrder.total}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Delivering To</span>
          </h3>
          <p className="text-sm font-bold text-stone-800">{currentOrder.address.fullName}</p>
          <p className="text-xs text-stone-600">{currentOrder.address.street}</p>
          <p className="text-xs text-stone-500">
            {currentOrder.address.city}, {currentOrder.address.state} - {currentOrder.address.pincode}
          </p>
          <p className="text-xs text-stone-500 font-mono mt-0.5">{currentOrder.address.phone}</p>
        </div>

        {/* Ordered Items summary */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-orange-600" />
            <span>Items in this Order ({currentOrder.items.length})</span>
          </h3>
          <div className="divide-y divide-stone-100">
            {currentOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-lg border border-stone-100"
                  />
                  <div>
                    <p className="font-bold text-stone-800">{product.name}</p>
                    <p className="text-stone-400">{product.weight} • Qty: {quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-stone-900">
                  ₹{product.price * quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleTrackOrder}
            className="flex-1 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
          >
            <span>Track Order Status Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('shop')}
            className="py-3.5 px-6 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
