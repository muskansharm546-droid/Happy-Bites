import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Phone,
  AlertCircle,
  XCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, trackOrderId, setTrackOrderId, cancelOrder, navigateTo } = useApp();
  const [searchInput, setSearchInput] = useState(trackOrderId || '');

  // Active tracked order
  const currentOrder =
    orders.find((o) => o.id.toLowerCase() === (trackOrderId || searchInput).trim().toLowerCase()) ||
    orders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackOrderId(searchInput.trim());
    }
  };

  const STAGES: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
    {
      status: 'Order Placed',
      label: 'Order Placed',
      icon: '📝',
      desc: 'Order received and logged in our system',
    },
    {
      status: 'Order Confirmed',
      label: 'Order Confirmed',
      icon: '✅',
      desc: 'Happy Bites hub confirmed item availability',
    },
    {
      status: 'Preparing',
      label: 'Preparing & Packing',
      icon: '📦',
      desc: 'Snacks packed with temperature chilling pack',
    },
    {
      status: 'Shipped',
      label: 'Dispatched',
      icon: '🛵',
      desc: 'Handed over to express courier rider',
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Delivery',
      icon: '⚡',
      desc: 'Delivery partner is within 2 km of your location',
    },
    {
      status: 'Delivered',
      label: 'Delivered',
      icon: '🎉',
      desc: 'Enjoy your delicious snacks!',
    },
  ];

  const currentStageIndex = currentOrder
    ? STAGES.findIndex((s) => s.status === currentOrder.status)
    : -1;

  const canCancel =
    currentOrder &&
    (currentOrder.status === 'Order Placed' || currentOrder.status === 'Order Confirmed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
            Live Order Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your delicious bites from the hub straight to your doorstep
          </p>
        </div>

        {/* Order ID Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. HB-89421)"
              className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {/* Orders selector pills */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-stone-400 font-semibold shrink-0">Recent Orders:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setTrackOrderId(ord.id);
                setSearchInput(ord.id);
              }}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition shrink-0 border ${
                currentOrder?.id === ord.id
                  ? 'bg-[#2C1810] text-amber-300 border-[#2C1810]'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              #{ord.id} ({ord.status})
            </button>
          ))}
        </div>
      )}

      {currentOrder ? (
        <div className="space-y-6">
          {/* Main Status Hero Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Tracking Order #{currentOrder.id}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] font-heading">
                    {currentOrder.status}
                  </h2>
                  {currentOrder.status === 'Cancelled' ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-md">
                      Cancelled
                    </span>
                  ) : currentOrder.status === 'Delivered' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                      Completed
                    </span>
                  ) : (
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping"></span>
                      On the Way
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-stone-400 text-xs block">Estimated Arrival</span>
                <span className="text-sm font-bold text-orange-600 flex items-center sm:justify-end gap-1">
                  <Clock className="w-4 h-4" /> {currentOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* 6-Stage Timeline (Only show if not cancelled) */}
            {currentOrder.status !== 'Cancelled' ? (
              <div className="relative py-4">
                {/* Connecting bar for desktop */}
                <div className="hidden md:block absolute top-1/2 left-6 right-6 h-1.5 bg-stone-100 -translate-y-1/2 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        0,
                        (currentStageIndex / (STAGES.length - 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>

                {/* Stages Steps */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.status}
                        className="flex md:flex-col items-center md:items-center text-left md:text-center gap-3 md:gap-2"
                      >
                        {/* Icon bubble */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base transition-all duration-300 shadow-md ${
                            isCurrent
                              ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white ring-4 ring-orange-200 scale-110'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-400 border border-stone-200'
                          }`}
                        >
                          {isDone ? (
                            isCurrent ? (
                              <span>{stage.icon}</span>
                            ) : (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            )
                          ) : (
                            <span className="opacity-50">{stage.icon}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div>
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCurrent
                                ? 'text-orange-600 font-extrabold'
                                : isDone
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1 hidden md:block">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>This order was cancelled. Any online payment will be refunded within 24 hours.</span>
              </div>
            )}

            {/* Rider & Contact Box (if order is active / dispatched) */}
            {currentOrder.deliveryPerson &&
              currentOrder.status !== 'Cancelled' &&
              currentOrder.status !== 'Delivered' && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                      🛵
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-semibold uppercase">
                        Assigned Delivery Executive
                      </p>
                      <h4 className="text-sm font-bold text-stone-900">
                        {currentOrder.deliveryPerson.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Vehicle: {currentOrder.deliveryPerson.vehicle}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${currentOrder.deliveryPerson.phone}`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Delivery Partner</span>
                  </a>
                </div>
              )}

            {/* Cancel Order Action */}
            {canCancel && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <p className="text-xs text-stone-500">
                  Made a mistake? You can cancel before preparation begins.
                </p>
                <button
                  onClick={() => cancelOrder(currentOrder.id, 'Cancelled by customer')}
                  className="px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Order Details & Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] font-heading flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              <span>Order Details</span>
            </h3>

            {/* Items */}
            <div className="divide-y divide-stone-100">
              {currentOrder.items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-stone-100"
                    />
                    <div>
                      <p className="font-bold text-stone-800">{product.name}</p>
                      <p className="text-stone-400">Qty: {quantity} • {product.weight}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Destination & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold mb-1">Destination</span>
                <p className="font-bold text-stone-800">{currentOrder.address.fullName}</p>
                <p className="text-stone-600">{currentOrder.address.street}</p>
                <p className="text-stone-500">{currentOrder.address.city} - {currentOrder.address.pincode}</p>
              </div>

              <div>
                <span className="text-stone-400 block font-semibold mb-1">Payment & Total</span>
                <p className="text-stone-700">Mode: <span className="font-bold uppercase">{currentOrder.paymentMethod}</span></p>
                <p className="text-stone-700">Status: <span className="font-bold text-emerald-600">{currentOrder.paymentStatus}</span></p>
                <p className="text-base font-black text-[#2C1810] mt-1 font-heading">
                  Total Paid: ₹{currentOrder.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <p className="text-sm font-semibold text-stone-600">No order found with ID "{searchInput}"</p>
        </div>
      )}
    </div>
  );
};
