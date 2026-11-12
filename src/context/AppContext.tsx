import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  User,
  Address,
  Coupon,
  OrderStatus,
  Review,
} from '../types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  AVAILABLE_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
} from '../data/mockData';
import { saveOrderToSupabase } from '../lib/supabase';

export type PageType =
  | 'home'
  | 'shop'
  | 'categories'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'my-orders'
  | 'profile'
  | 'admin'
  | 'about'
  | 'contact'
  | 'faq'
  | 'login'
  | 'register';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentPage: PageType;
  navigateTo: (page: PageType, param?: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  trackOrderId: string | null;
  setTrackOrderId: (id: string | null) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStock: (productId: string) => void;
  addReviewToProduct: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  cartTotal: number;
  cartItemCount: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (
    paymentMethod: 'cod' | 'upi' | 'card',
    address: Address,
    paymentStatus?: 'Paid' | 'Pending (COD)'
  ) => Order;
  latestOrder: Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // User & Auth
  user: User | null;
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;

  // UI & Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;

  // Quick helper
  quickBuyNow: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('happybites_products');
      if (stored) {
        const removedIds = new Set([
          'prod-5-star-oreo',
          'prod-pringles-sour-cream',
          'prod-premium-california-almonds',
          'prod-artisan-garlic-loaf',
        ]);
        let parsed: Product[] = JSON.parse(stored).filter((p: Product) => !removedIds.has(p.id));
        const imageUpdates: Record<string, string> = {
          'prod-cadbury-silk': '/assets/aistudio/Screenshot_2026-11-06_152918_fa31e7c0.png',
          'prod-kitkat-chunky': '/assets/aistudio/Screenshot_2026-11-06_152928_5ae1faa9.png',
          'prod-kurkure-masala-munch': '/assets/aistudio/Screenshot_2026-11-06_152856_a5693efd.png',
        };
        parsed = parsed.map((p) => (imageUpdates[p.id] ? { ...p, image: imageUpdates[p.id] } : p));
        // Merge in any newly added initial products that might not be in cached localStorage
        INITIAL_PRODUCTS.forEach((initProd) => {
          if (removedIds.has(initProd.id)) return;
          if (!parsed.some((p) => p.id === initProd.id)) {
            parsed.push(initProd);
          }
        });
        return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(CATEGORIES);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('happybites_cart');
      return stored ? JSON.parse(stored) : [
        { product: INITIAL_PRODUCTS[0], quantity: 1 },
        { product: INITIAL_PRODUCTS[4], quantity: 2 },
      ];
    } catch {
      return [];
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem('happybites_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('happybites_wishlist');
      return stored ? JSON.parse(stored) : [INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[3]];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('happybites_orders');
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // User
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('happybites_user');
      if (stored) return JSON.parse(stored);
      // Pre-populate with realistic user for instant seamless experience
      return {
        id: 'user-muskan-1',
        name: 'Muskan Sharma',
        email: 'muskansharm546@gmail.com',
        phone: '+91 98765 43210',
        role: 'customer',
        addresses: INITIAL_ADDRESSES,
        createdAt: '2026-01-10',
      };
    } catch {
      return null;
    }
  });

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('happybites_recent');
      return stored ? JSON.parse(stored) : [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[5]];
    } catch {
      return [];
    }
  });

  // Navigation & Page routing
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackOrderId, setTrackOrderId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('happybites_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('happybites_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('happybites_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('happybites_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('happybites_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('happybites_user');
    }
  }, [user]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('happybites_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('happybites_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('happybites_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigateTo = (page: PageType, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);

    if (page === 'shop' && param) {
      setSelectedCategoryId(param);
    } else if (page === 'track-order' && param) {
      setTrackOrderId(param);
    } else if (page === 'cart' || page === 'home') {
      // Keep state clean
    }
  };

  // Cart calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Free delivery above ₹499, otherwise ₹49
  const deliveryCharge = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49;

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.value;
    } else {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      if (discountAmount > 200) discountAmount = 200; // Cap
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const quickBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigateTo('checkout');
  };

  // Coupon actions
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      showToast('Invalid promo coupon code', 'error');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      showToast(
        `Minimum order of ₹${found.minOrder} required to apply this coupon.`,
        'warning'
      );
      return false;
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Coupon ${coupon.code} created!`, 'success');
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added ${product.name} to Wishlist!`, 'success');
        return [product, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  // Recently viewed
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  // Order actions
  const placeOrder = (
    paymentMethod: 'cod' | 'upi' | 'card',
    address: Address,
    paymentStatus: 'Paid' | 'Pending (COD)' = paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid'
  ): Order => {
    const newOrderId = `HB-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: newOrderId,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge,
      discount: discountAmount,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      status: 'Order Placed',
      paymentMethod,
      paymentStatus,
      address,
      createdAt: `Today, ${timeString}`,
      estimatedDelivery: 'Express Delivery (30-45 minutes)',
      deliveryPerson: {
        name: 'Rohan Sharma',
        phone: '+91 98450 12389',
        vehicle: 'Ather 450X (MH-02-EZ-7712)',
      },
      trackingTimeline: [
        {
          status: 'Order Placed',
          timestamp: timeString,
          note: `Order received and confirmed via ${paymentMethod.toUpperCase()}`,
          done: true,
          current: true,
        },
        {
          status: 'Order Confirmed',
          timestamp: 'Pending',
          note: 'Restaurant & snacks warehouse confirms availability',
          done: false,
          current: false,
        },
        {
          status: 'Preparing',
          timestamp: 'Pending',
          note: 'Packed safely in temperature-regulated bag',
          done: false,
          current: false,
        },
        {
          status: 'Shipped',
          timestamp: 'Pending',
          note: 'Dispatched with delivery rider',
          done: false,
          current: false,
        },
        {
          status: 'Out for Delivery',
          timestamp: 'Pending',
          note: 'Rider is on the way to your door',
          done: false,
          current: false,
        },
        {
          status: 'Delivered',
          timestamp: 'Pending',
          note: 'Customer collects delicious bites',
          done: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setAppliedCoupon(null);
    showToast(`Order #${newOrderId} placed successfully!`, 'success');

    // Asynchronously synchronize order to Supabase backend
    saveOrderToSupabase(newOrder).then((res) => {
      if (res.success) {
        showToast('Order saved to Supabase database!', 'info');
      }
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const stages: OrderStatus[] = [
      'Order Placed',
      'Order Confirmed',
      'Preparing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];
    const targetIdx = stages.indexOf(status);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.trackingTimeline.map((step) => {
          const stepIdx = stages.indexOf(step.status);
          if (step.status === status) {
            return {
              ...step,
              done: true,
              current: true,
              timestamp: timeNow,
              note: note || step.note,
            };
          } else if (stepIdx < targetIdx && targetIdx !== -1) {
            return { ...step, done: true, current: false };
          } else {
            return { ...step, done: false, current: false };
          }
        });

        return {
          ...ord,
          status,
          trackingTimeline: updatedTimeline,
        };
      })
    );
    showToast(`Order ${orderId} updated to "${status}"`, 'info');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: 'Cancelled',
          trackingTimeline: [
            ...ord.trackingTimeline,
            {
              status: 'Cancelled',
              timestamp: 'Just now',
              note: reason || 'Cancelled upon customer request',
              done: true,
              current: true,
            },
          ],
        };
      })
    );
    showToast(`Order ${orderId} cancelled`, 'warning');
  };

  // Product Admin Management
  const addProduct = (newProd: Omit<Product, 'id' | 'reviews'>) => {
    const id = `prod-custom-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      reviews: [],
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" added to catalog!`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Product removed from store!`, 'info');
  };

  const toggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newInStock = !p.inStock;
          showToast(
            `${p.name} is now ${newInStock ? 'In Stock' : 'Out of Stock'}`,
            'info'
          );
          return { ...p, inStock: newInStock };
        }
        return p;
      })
    );
  };

  const addReviewToProduct = (
    productId: string,
    reviewData: Omit<Review, 'id' | 'date'>
  ) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReviews = [newRev, ...p.reviews];
          const newRating = Number(
            (
              newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length
            ).toFixed(1)
          );
          return {
            ...p,
            reviews: newReviews,
            reviewCount: p.reviewCount + 1,
            rating: newRating,
          };
        }
        return p;
      })
    );
    showToast('Your review has been published! Thank you.', 'success');
  };

  // User & Auth
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const isMuskan = email.toLowerCase().includes('muskan');
    const isAdmin = role === 'admin' || email.toLowerCase().includes('admin');

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: isAdmin ? 'Store Administrator' : isMuskan ? 'Muskan Sharma' : 'Valued Foodie',
      email,
      phone: '+91 98765 43210',
      role: isAdmin ? 'admin' : 'customer',
      addresses: INITIAL_ADDRESSES,
      createdAt: '2026-02-01',
    };
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    showToast(`Account created! Welcome to Happy Bites, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    showToast('Profile information updated!', 'success');
  };

  const addAddress = (addrData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = addrData.isDefault
      ? user.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...user.addresses, newAddr];

    setUser({ ...user, addresses: updatedAddresses });
    showToast('Delivery address saved!', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses: updated });
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setUser({ ...user, addresses: updated });
    showToast('Default address updated!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedProductId,
        setSelectedProductId,
        searchQuery,
        setSearchQuery,
        trackOrderId,
        setTrackOrderId,

        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addReviewToProduct,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        deliveryCharge,
        discountAmount,
        cartTotal,
        cartItemCount,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        latestOrder,
        updateOrderStatus,
        cancelOrder,

        user,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,

        recentlyViewed,
        addToRecentlyViewed,

        toasts,
        showToast,
        removeToast,

        quickBuyNow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
