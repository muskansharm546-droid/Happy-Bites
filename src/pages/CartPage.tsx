import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    navigateTo,
    setSelectedProductId,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 bg-amber-100/70 text-orange-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
            Your Cart is Empty!
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Looks like you haven’t added any delicious bites to your cart yet. Explore our chocolates, wafers, or hot ramen!
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-orange-500/25 inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Start Shopping Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
            Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
          </h1>
          <p className="text-xs text-stone-500 mt-1">Review your snacks before 30-minute delivery</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1 font-semibold transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-orange-600" />
            {amountNeededForFreeDelivery === 0 ? (
              <span className="text-emerald-700">🎉 Congratulations! You have qualified for FREE Express Delivery!</span>
            ) : (
              <span>Add ₹{amountNeededForFreeDelivery} more to get FREE Express Delivery!</span>
            )}
          </span>
          <span>{Math.round(freeDeliveryProgress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${freeDeliveryProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Grid: Cart Items (Left) & Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Item List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 hover:border-orange-300 transition"
            >
              {/* Product Thumbnail */}
              <img
                src={product.image}
                alt={product.name}
                onClick={() => setSelectedProductId(product.id)}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-100 cursor-pointer shrink-0"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h3
                  onClick={() => setSelectedProductId(product.id)}
                  className="font-bold text-sm sm:text-base text-stone-900 truncate cursor-pointer hover:text-orange-600 transition"
                >
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 mb-2">{product.weight}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold text-[#2C1810] text-sm sm:text-base">
                    ₹{product.price * quantity}
                  </span>
                  <span className="text-xs text-stone-400">
                    (₹{product.price} each)
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold transition shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center font-bold transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 pt-2"
          >
            <span>&larr; Add more delicious snacks</span>
          </button>
        </div>

        {/* Right: Order Summary & Coupon Promo */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon box */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#2C1810] flex items-center gap-1.5 font-heading">
              <Tag className="w-4 h-4 text-orange-600" />
              <span>Apply Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs text-emerald-900 font-mono tracking-wider">
                      {appliedCoupon.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-0.5"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HAPPYBITES50"
                  className="flex-1 px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#2C1810] hover:bg-[#4A2810] text-white rounded-xl text-xs font-bold transition"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick Available Coupon Chips */}
            <div className="pt-2 border-t border-stone-100">
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">
                Available Coupons
              </p>
              <div className="flex flex-wrap gap-1.5">
                {coupons.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => applyCoupon(c.code)}
                    className="text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 px-2 py-1 rounded-lg transition"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] font-heading">
              Bill Details
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900">₹{deliveryCharge}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-400">
                <span>Packaging & Handling Charges</span>
                <span className="line-through text-stone-400">₹20</span>
                <span className="text-emerald-600 font-bold ml-1">FREE</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-stone-500 uppercase">To Pay</span>
                <span className="text-2xl font-black text-[#2C1810] font-heading">
                  ₹{cartTotal}
                </span>
              </div>

              {discountAmount > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  Saved ₹{discountAmount}
                </span>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe and Secure Payments • 100% Authentic Products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
