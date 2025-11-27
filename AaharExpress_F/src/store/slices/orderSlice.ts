import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timestamp: string;
  shippingDetails: ShippingDetails;
  estimatedDelivery: string;
}

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
      state.activeOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        if (state.activeOrder?.id === order.id) {
          state.activeOrder = { ...order };
        }
      }
    },
    setActiveOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        state.activeOrder = order;
      }
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createOrder,
  updateOrderStatus,
  setActiveOrder,
  clearActiveOrder,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer; 