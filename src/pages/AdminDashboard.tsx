import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  Search,
  Filter,
  DollarSign,
  Users,
  Tag,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatus, Coupon } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateOrderStatus,
    addCoupon,
    user,
    login,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons'>('overview');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    user?.role === 'admin'
  );
  const [adminPin, setAdminPin] = useState('');

  // Product Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Happy Bites');
  const [categoryId, setCategoryId] = useState('chocolates');
  const [price, setPrice] = useState(99);
  const [originalPrice, setOriginalPrice] = useState(120);
  const [weight, setWeight] = useState('100g');
  const [stockCount, setStockCount] = useState(50);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80');

  // Search in tables
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(50);
  const [newCouponMin, setNewCouponMin] = useState(299);
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percent'>('fixed');

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => (ord.status !== 'Cancelled' ? sum + ord.total : sum), 0);
  const totalOrdersCount = orders.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 20 || !p.inStock);

  // Handle Admin PIN Login
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'admin' || adminPin === '1234' || adminPin === '') {
      setIsAdminAuthenticated(true);
      login('admin@happybites.com', 'admin');
      showToast('Admin access granted!', 'success');
    } else {
      showToast('Incorrect PIN (Default: 1234 or leave blank)', 'error');
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discountPercent =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const selectedCat = categories.find((c) => c.id === categoryId);

    addProduct({
      name,
      brand,
      categoryId,
      categoryName: selectedCat?.name || 'Snacks',
      price,
      originalPrice,
      discountPercent,
      rating: 4.8,
      reviewCount: 1,
      description: description || 'Delicious, fresh, premium quality snack by Happy Bites.',
      weight,
      inStock: stockCount > 0,
      stockCount,
      isVeg: true,
      image,
      tags: [selectedCat?.name || 'Snacks', brand],
      ingredients: ['Natural Ingredients', 'Spices & Cocoa'],
      nutrition: {
        calories: '450 kcal',
        carbs: '50g',
        sugar: '20g',
        protein: '6g',
        fat: '15g',
      },
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  // Edit Product Submit
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const discountPercent =
      editingProduct.originalPrice > editingProduct.price
        ? Math.round(
            ((editingProduct.originalPrice - editingProduct.price) /
              editingProduct.originalPrice) *
              100
          )
        : 0;

    updateProduct({
      ...editingProduct,
      discountPercent,
    });

    setEditingProduct(null);
  };

  const resetForm = () => {
    setName('');
    setBrand('Happy Bites');
    setPrice(99);
    setOriginalPrice(120);
    setWeight('100g');
    setStockCount(50);
    setDescription('');
  };

  // If not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#2C1810] font-heading">
            Happy Bites Admin Portal
          </h2>
          <p className="text-xs text-stone-500">
            Secure access to inventory, orders, customers, and pricing.
          </p>
        </div>

        <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Passcode / PIN
            </label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
            />
            <p className="text-[10px] text-stone-400 mt-1">Hint: Type 1234 or click Unlock below</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // Filtered products in admin
  const filteredAdminProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered orders in admin
  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white bg-purple-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin Mode
            </span>
            <span className="text-xs text-stone-400">Live Inventory Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading mt-1">
            Store Command Center
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Snack</span>
          </button>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
          >
            Lock
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
            ₹
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Total Revenue</span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold">+18% this week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Total Orders</span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              {totalOrdersCount}
            </h3>
            <span className="text-[10px] text-orange-600 font-bold">100% Fulfilled</span>
          </div>
        </div>

        {/* In-Stock Products */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Active Products</span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              {inStockCount} / {products.length}
            </h3>
            <span className="text-[10px] text-blue-600 font-bold">Across 12 Categories</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Low Stock Alerts</span>
            <h3 className="text-xl sm:text-2xl font-black text-rose-600 font-heading">
              {lowStockProducts.length} Items
            </h3>
            <span className="text-[10px] text-rose-600 font-bold">Needs restock</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#2C1810] text-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Overview & Low Stock
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#2C1810] text-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Products Management</span>
          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full">
            {products.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#2C1810] text-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Customer Orders</span>
          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'coupons'
              ? 'bg-[#2C1810] text-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Discount Coupons
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2C1810] font-heading flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Inventory & Low Stock Alerts ({lowStockProducts.length})</span>
              </h3>
              <span className="text-xs text-stone-400">Stock &lt; 20 units</span>
            </div>

            <div className="divide-y divide-stone-100">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg border border-stone-100"
                    />
                    <div>
                      <p className="font-bold text-stone-800">{p.name}</p>
                      <p className="text-stone-400">{p.categoryName} • {p.weight}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-md text-[11px] ${
                        p.stockCount <= 10
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {p.stockCount} units left
                    </span>

                    <button
                      onClick={() => toggleProductStock(p.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded-lg"
                    >
                      {p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, category..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAdminProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded-lg border border-stone-100"
                        />
                        <span className="font-bold text-stone-800 line-clamp-1 max-w-[200px]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-stone-600">{p.categoryName}</td>
                    <td className="p-3 font-bold text-stone-900">
                      ₹{p.price}
                      {p.originalPrice > p.price && (
                        <span className="text-[10px] text-stone-400 line-through ml-1.5">
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-stone-700 font-mono">{p.stockCount}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-base text-[#2C1810] font-heading">
              Manage Orders & Status Updates
            </h3>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="text-xs border border-stone-200 rounded-xl px-3 py-1.5 bg-stone-50 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Order Confirmed">Order Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-900">
                      Order #{ord.id}
                    </span>
                    <span className="text-stone-400 ml-2">({ord.createdAt})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1810] text-sm">
                      Total: ₹{ord.total}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="text-xs text-stone-600 flex flex-wrap gap-2">
                  {ord.items.map((item) => (
                    <span
                      key={item.product.id}
                      className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-[11px]"
                    >
                      {item.product.name} (x{item.quantity})
                    </span>
                  ))}
                </div>

                {/* Destination & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                  <p className="text-stone-500">
                    <span className="font-bold text-stone-700">{ord.address.fullName}</span> • {ord.address.city} ({ord.address.phone})
                  </p>

                  {/* Status Updater */}
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[11px] font-semibold">Change Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-white border border-stone-300 text-stone-800 text-xs font-bold rounded-xl px-2.5 py-1 outline-hidden"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Coupon */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] font-heading">
              Create New Promo Coupon
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MONSOON30"
                  className="w-full px-3 py-2 uppercase font-mono bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as 'fixed' | 'percent')}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="fixed">Flat Amount (₹)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (newCouponCode.trim()) {
                    addCoupon({
                      code: newCouponCode.trim(),
                      discountType: newCouponType,
                      value: newCouponValue,
                      minOrder: newCouponMin,
                      description: `${newCouponType === 'fixed' ? `Flat ₹${newCouponValue} OFF` : `${newCouponValue}% OFF`} on orders above ₹${newCouponMin}`,
                      expiry: 'Valid for next 14 days',
                    });
                    setNewCouponCode('');
                  }
                }}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition mt-2"
              >
                Add Voucher
              </button>
            </div>
          </div>

          {/* Active Coupons List */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] font-heading">
              Active Store Coupons ({coupons.length})
            </h3>
            <div className="space-y-2.5">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-amber-950 text-sm">{c.code}</span>
                    <p className="text-stone-500 text-[11px]">{c.description}</p>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded-md">
                    Min: ₹{c.minOrder}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#2C1810] font-heading">
              Add New Snack or Food Product
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cadbury Silk Fruit & Nut 150g"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">M.R.P (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Net Weight / Quantity</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 150g or Pack of 2"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#2C1810] font-heading">
              Edit Product: {editingProduct.name}
            </h3>

            <form onSubmit={handleEditProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">M.R.P (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Net Weight</label>
                  <input
                    type="text"
                    value={editingProduct.weight}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, weight: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
