import React, { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Plus,
  Trash2,
  Check,
  Edit2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const {
    user,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    navigateTo,
    showToast,
  } = useApp();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Add address modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPincode, setAddrPincode] = useState('400050');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-stone-800">You are not signed in</h2>
        <button
          onClick={() => navigateTo('login')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setIsEditingInfo(false);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrPincode) {
      showToast('Please fill all required address details', 'warning');
      return;
    }

    addAddress({
      fullName: addrName || user.name,
      phone: addrPhone || user.phone,
      email: user.email,
      street: addrStreet,
      landmark: addrLandmark,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      isDefault: user.addresses.length === 0,
      type: addrType,
    });

    setShowAddAddress(false);
    setAddrStreet('');
    setAddrLandmark('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#4A2810] to-[#2C1810] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white text-2xl font-black flex items-center justify-center border-4 border-white/20 shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading">{user.name}</h1>
            <p className="text-xs text-amber-200/80">{user.email}</p>
            <p className="text-xs text-amber-200/60 font-mono mt-0.5">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('my-orders')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Details Form */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-bold text-base text-[#2C1810] font-heading flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-orange-600" />
            <span>Personal Information</span>
          </h2>
          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingInfo ? 'Cancel' : 'Edit Info'}</span>
          </button>
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleSaveInfo} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">Full Name</span>
              <span className="font-bold text-stone-800 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Email Address</span>
              <span className="font-bold text-stone-800 text-sm">{user.email}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Mobile Phone</span>
              <span className="font-bold text-stone-800 text-sm">{user.phone}</span>
            </div>
          </div>
        )}
      </section>

      {/* Saved Addresses Section */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="font-bold text-base text-[#2C1810] font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Saved Delivery Addresses</span>
            </h2>
            <p className="text-xs text-stone-400">Where you receive your 30-min snack deliveries</p>
          </div>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="px-3.5 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold hover:bg-orange-100 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form onSubmit={handleAddAddressSubmit} className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3 text-xs">
            <h3 className="font-bold text-stone-800">Add a New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Contact Name</label>
                <input
                  type="text"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Flat / Building / Street Address *</label>
              <input
                type="text"
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                placeholder="Flat 302, Green Valley Apartments"
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Landmark</label>
                <input
                  type="text"
                  value={addrLandmark}
                  onChange={(e) => setAddrLandmark(e.target.value)}
                  placeholder="Opposite Mall"
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">City & State</label>
                <input
                  type="text"
                  value={`${addrCity}, ${addrState}`}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">PIN Code *</label>
                <input
                  type="text"
                  value={addrPincode}
                  onChange={(e) => setAddrPincode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <span className="font-semibold text-stone-600">Type:</span>
              {(['home', 'work', 'other'] as const).map((t) => (
                <label key={t} className="flex items-center gap-1 cursor-pointer capitalize">
                  <input
                    type="radio"
                    name="profileAddrType"
                    checked={addrType === t}
                    onChange={() => setAddrType(t)}
                    className="accent-orange-600"
                  />
                  <span>{t}</span>
                </label>
              ))}

              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 text-stone-500 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </div>
          </form>
        )}

        {/* List of saved addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-orange-400 bg-orange-50/30'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-stone-900">{addr.fullName}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-md uppercase">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-stone-600 line-clamp-2">{addr.street}</p>
                {addr.landmark && (
                  <p className="text-[11px] text-stone-400">Landmark: {addr.landmark}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs font-mono text-stone-500">{addr.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Selected Default
                  </span>
                )}

                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
