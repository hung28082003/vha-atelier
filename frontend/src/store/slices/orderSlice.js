import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI, paymentAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Orders async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải danh sách đơn hàng';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrder(id);
      return response.data.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải thông tin đơn hàng';
      return rejectWithValue(message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      toast.success('Tạo đơn hàng thành công!');
      return response.data.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Tạo đơn hàng thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getUserOrders(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải đơn hàng của bạn';
      return rejectWithValue(message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await ordersAPI.cancelOrder(id, reason);
      toast.success('Hủy đơn hàng thành công!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Hủy đơn hàng thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const returnOrder = createAsyncThunk(
  'orders/returnOrder',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await ordersAPI.returnOrder(id, reason);
      toast.success('Yêu cầu trả hàng đã được gửi!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Gửi yêu cầu trả hàng thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Payment async thunks
export const generatePaymentQR = createAsyncThunk(
  'orders/generatePaymentQR',
  async ({ orderId, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.generatePaymentQR(orderId, paymentMethod);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tạo mã QR thanh toán';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async ({ orderId, transactionId }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.verifyPayment(orderId, transactionId);
      toast.success('Xác minh thanh toán thành công!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Xác minh thanh toán thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getPaymentStatus = createAsyncThunk(
  'orders/getPaymentStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentStatus(orderId);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải trạng thái thanh toán';
      return rejectWithValue(message);
    }
  }
);

export const getPaymentReceipt = createAsyncThunk(
  'orders/getPaymentReceipt',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentReceipt(orderId);
      return response.data.data.receipt;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải biên lai thanh toán';
      return rejectWithValue(message);
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'orders/cancelPayment',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      await paymentAPI.cancelPayment(orderId, reason);
      toast.success('Hủy thanh toán thành công!');
      return orderId;
    } catch (error) {
      const message = error.response?.data?.message || 'Hủy thanh toán thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  // Orders
  orders: [],
  currentOrder: null,
  userOrders: [],
  
  // Payment
  paymentQR: null,
  paymentStatus: null,
  paymentReceipt: null,
  
  // UI state
  isLoading: false,
  isCreatingOrder: false,
  isProcessingPayment: false,
  error: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  },
  
  // User orders pagination
  userOrdersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearPaymentData: (state) => {
      state.paymentQR = null;
      state.paymentStatus = null;
      state.paymentReceipt = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setUserOrdersPagination: (state, action) => {
      state.userOrdersPagination = { ...state.userOrdersPagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Order
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isCreatingOrder = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.currentOrder = action.payload;
        // Add to user orders
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreatingOrder = false;
        state.error = action.payload;
      })
      
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload.orders;
        state.userOrdersPagination = action.payload.pagination;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        // Update order in user orders
        const orderIndex = state.userOrders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          state.userOrders[orderIndex].status = 'cancelled';
        }
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder._id === orderId) {
          state.currentOrder.status = 'cancelled';
        }
      })
      
      // Return Order
      .addCase(returnOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        // Update order in user orders
        const orderIndex = state.userOrders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          state.userOrders[orderIndex].status = 'returned';
        }
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder._id === orderId) {
          state.currentOrder.status = 'returned';
        }
      })
      
      // Generate Payment QR
      .addCase(generatePaymentQR.pending, (state) => {
        state.isProcessingPayment = true;
        state.error = null;
      })
      .addCase(generatePaymentQR.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentQR = action.payload;
      })
      .addCase(generatePaymentQR.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.error = action.payload;
      })
      
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isProcessingPayment = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        state.currentOrder = action.payload.order;
        state.paymentReceipt = action.payload.receipt;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.error = action.payload;
      })
      
      // Get Payment Status
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatus = action.payload;
      })
      
      // Get Payment Receipt
      .addCase(getPaymentReceipt.fulfilled, (state, action) => {
        state.paymentReceipt = action.payload;
      })
      
      // Cancel Payment
      .addCase(cancelPayment.fulfilled, (state, action) => {
        const orderId = action.payload;
        // Update order status
        if (state.currentOrder && state.currentOrder._id === orderId) {
          state.currentOrder.paymentStatus = 'failed';
          state.currentOrder.status = 'cancelled';
        }
        // Clear payment data
        state.paymentQR = null;
        state.paymentStatus = null;
      });
  },
});

export const {
  clearError,
  clearCurrentOrder,
  clearPaymentData,
  setPagination,
  setUserOrdersPagination,
} = orderSlice.actions;

export default orderSlice.reducer;
