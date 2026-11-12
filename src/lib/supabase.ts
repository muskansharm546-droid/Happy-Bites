import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order } from '../types';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if real credentials have been provided
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Create client lazily or when configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves placed order to the Supabase backend 'orders' table.
 */
export async function saveOrderToSupabase(order: Order): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn(
      '[Supabase] Supabase is not configured yet. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
    return {
      success: false,
      error: 'Supabase credentials not configured yet in environment.',
    };
  }

  try {
    const payload = {
      order_id: order.id,
      customer_name: order.address.fullName,
      customer_email: order.address.email,
      customer_phone: order.address.phone,
      items: order.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
      subtotal: order.subtotal,
      delivery_charge: order.deliveryCharge,
      discount: order.discount,
      total_amount: order.total,
      coupon_code: order.couponCode || null,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: {
        street: order.address.street,
        landmark: order.address.landmark || '',
        city: order.address.city,
        state: order.address.state,
        pincode: order.address.pincode,
        type: order.address.type,
      },
      created_at: new Date().toISOString(),
      estimated_delivery: order.estimatedDelivery,
    };

    const { data, error } = await supabase.from('orders').insert([payload]).select();

    if (error) {
      console.error('[Supabase] Error inserting order:', error);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Order successfully saved to Supabase:', data);
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error saving order:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Fetches orders list from Supabase if configured.
 */
export async function fetchOrdersFromSupabase() {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Error fetching orders:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[Supabase] Unexpected error:', err);
    return [];
  }
}
