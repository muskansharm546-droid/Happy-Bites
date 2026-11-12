import React from 'react';
import {
  Package,
  Clock,
  ArrowRight,
  RotateCcw,
  MapPin,
  CheckCircle2,
  FileText,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyOrdersPage: React.FC = () => {
  const { orders, navigateTo, setTrackOrderId, addToCart, showToast } = useApp();

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach(({ product, quantity }) => {
      addToCart(product, quantity);
    });
    showToast(`Items from Order #${order.id} added back to cart!`, 'success');
    navigateTo('cart');
  };

  const handleTrack = (orderId: string) => {
    setTrackOrderId(orderId);
    navigateTo('track-order');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-600" />
          <span>My Orders & Snack History</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review previous food deliveries, track live shipments, or re-order your favorites with 1 click.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-4">
          <p className="text-sm font-semibold text-stone-700">You haven’t placed any orders yet.</p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
          >
            Start Snacking
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4 hover:border-orange-300 transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-stone-900">
                      Order #{ord.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 mt-0.5 block">{ord.createdAt}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-400 block">Total Amount</span>
                  <span className="text-lg font-black text-[#2C1810] font-heading">
                    ₹{ord.total}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {ord.items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-stone-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-800 text-sm">{product.name}</p>
                        <p className="text-stone-400">{product.weight} • Qty: {quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-stone-900">
                      ₹{product.price * quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-100 text-xs">
                <div className="text-stone-500">
                  <p className="font-semibold text-stone-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Delivered to: {ord.address.street}, {ord.address.city}</span>
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Paid via {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(ord)}
                    className="px-4 py-2 border border-stone-200 hover:border-orange-300 hover:bg-orange-50 text-stone-700 hover:text-orange-600 rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Order</span>
                  </button>

                  <button
                    onClick={() => handleTrack(ord.id)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
