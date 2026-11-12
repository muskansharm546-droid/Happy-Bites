import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle,
  Plus,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    user,
    addAddress,
    placeOrder,
    navigateTo,
    showToast,
  } = useApp();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.[0]?.id || ''
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(
    !user || !user.addresses || user.addresses.length === 0
  );

  // New Address form inputs
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400050');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-800 font-heading">
          No snacks in cart!
        </h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Snacks
        </button>
      </div>
    );
  }

  // Handle saving new address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !pincode) {
      showToast('Please fill all required address fields', 'warning');
      return;
    }

    addAddress({
      fullName,
      phone,
      email: email || 'customer@happybites.com',
      street,
      landmark,
      city,
      state,
      pincode,
      isDefault: true,
      type: addressType,
    });

    setShowNewAddressForm(false);
  };

  // Handle final order submission
  const handlePlaceOrderSubmit = () => {
    let chosenAddress: Address;

    if (user?.addresses && user.addresses.length > 0 && !showNewAddressForm) {
      chosenAddress =
        user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];
    } else {
      if (!fullName || !phone || !street || !pincode) {
        showToast('Please provide delivery address details', 'warning');
        return;
      }
      chosenAddress = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        email: email || 'customer@happybites.com',
        street,
        landmark,
        city,
        state,
        pincode,
        isDefault: true,
        type: addressType,
      };
    }

    setIsProcessing(true);

    setTimeout(() => {
      const placed = placeOrder(
        paymentMethod,
        chosenAddress,
        paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid'
      );
      setIsProcessing(false);
      navigateTo('order-confirmation', placed.id);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
          Checkout & Express Delivery
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your order to receive your snacks in 30 minutes!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Delivery Address */}
          <section className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-black text-lg text-[#2C1810] font-heading flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Delivery Address</span>
              </h2>
              {user?.addresses && user.addresses.length > 0 && !showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {user?.addresses && user.addresses.length > 0 && !showNewAddressForm ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                      (selectedAddressId === addr.id || (!selectedAddressId && addr.isDefault))
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-stone-900">{addr.fullName}</span>
                      <span className="text-[10px] bg-stone-100 uppercase font-bold text-stone-600 px-1.5 py-0.5 rounded-sm">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">{addr.street}</p>
                    <p className="text-xs text-stone-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-stone-500 mt-1 font-mono">{addr.phone}</p>

                    {(selectedAddressId === addr.id || (!selectedAddressId && addr.isDefault)) && (
                      <div className="absolute top-3 right-3 text-orange-600">
                        <CheckCircle className="w-4 h-4 fill-orange-600 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muskan Sharma"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (for delivery rider) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Flat / House No. / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Flat 402, Sunshine Heights, 14th Main Road"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Metro Station"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      required
                      value={`${city}, ${state}`}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400050"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Address Label:</span>
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer capitalize">
                      <input
                        type="radio"
                        name="addrType"
                        checked={addressType === type}
                        onChange={() => setAddressType(type)}
                        className="accent-orange-600"
                      />
                      <span>{type}</span>
                    </label>
                  ))}

                  {user?.addresses && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="ml-auto text-xs text-stone-500 hover:underline"
                    >
                      Use Saved Address
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Step 2: Payment Options */}
          <section className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-black text-lg text-[#2C1810] font-heading flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Payment Method</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Secured
              </span>
            </div>

            {/* Payment Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {/* Option 1: UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <QrCode className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-bold text-stone-800">UPI / QR</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Fastest</span>
              </button>

              {/* Option 2: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-bold text-stone-800">Cards & NetBanking</span>
                <span className="text-[10px] text-stone-500">RuPay / Visa</span>
              </button>

              {/* Option 3: COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold text-stone-800">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500">Pay at Door</span>
              </button>
            </div>

            {/* Payment Details Sub-section */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Scan QR code with GPay, PhonePe, Paytm, or BHIM</span>
                    <span className="text-orange-600">Simulated Sandbox</span>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-200">
                    {/* Simulated QR Box */}
                    <div className="w-24 h-24 bg-stone-900 rounded-xl p-2 flex flex-col items-center justify-center text-white shrink-0">
                      <QrCode className="w-16 h-16 text-white" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400">HAPPY BITES UPI</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-bold text-stone-900">
                        Scan and pay ₹{cartTotal}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Or enter your UPI ID below:
                      </p>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Credit or Debit Card</span>
                    <span className="text-emerald-600 font-semibold">Test Sandbox Ready</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-stone-800">
                    💵 Pay in Cash or Scan QR upon Arrival
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Our delivery executive will arrive in 30 minutes with your snacks. You can pay via cash, Google Pay, or PhonePe at your doorstep.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Confirm Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] font-heading flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-stone-500">
                {cart.length} items
              </span>
            </h3>

            {/* Item list in summary */}
            <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-stone-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-stone-800 truncate">{product.name}</p>
                      <p className="text-stone-400">Qty: {quantity} • {product.weight}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900 shrink-0 ml-2">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-800">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-800">₹{deliveryCharge}</span>
                )}
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase block">Total Payable</span>
                <span className="text-2xl font-black text-[#2C1810] font-heading">
                  ₹{cartTotal}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-md">
                30 Mins Express
              </span>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrderSubmit}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-base transition shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 group active:scale-98 disabled:opacity-60"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Delicious Order...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Place Order • ₹{cartTotal}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
