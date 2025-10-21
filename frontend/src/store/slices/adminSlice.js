import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminAPI from '../../services/adminAPI';
import toast from 'react-hot-toast';

// Async thunks
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi lấy thống kê dashboard';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUsers(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUser(userId, userData);
      toast.success('Cập nhật người dùng thành công');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật người dùng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      toast.success('Xóa người dùng thành công');
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi xóa người dùng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getProducts = createAsyncThunk(
  'admin/getProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getProducts(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createProduct(productData);
      toast.success('Tạo sản phẩm thành công');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tạo sản phẩm';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateProduct(productId, productData);
      toast.success('Cập nhật sản phẩm thành công');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật sản phẩm';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteProduct(productId);
      toast.success('Xóa sản phẩm thành công');
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi xóa sản phẩm';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getOrders = createAsyncThunk(
  'admin/getOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getOrders(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, { status, notes });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật đơn hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getSystemSettings = createAsyncThunk(
  'admin/getSystemSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSystemSettings();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi lấy cài đặt hệ thống';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateSystemSettings = createAsyncThunk(
  'admin/updateSystemSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateSystemSettings(settings);
      toast.success('Cập nhật cài đặt thành công');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật cài đặt';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // Dashboard
  dashboardStats: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    monthlyStats: []
  },
  
  // Users
  users: [],
  usersPagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  
  // Products
  products: [],
  productsPagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  
  // Orders
  orders: [],
  ordersPagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  
  // System Settings
  systemSettings: {
    siteName: 'VHA Atelier',
    siteDescription: 'Thời trang cao cấp',
    maintenanceMode: false,
    allowRegistration: true,
    chatbotEnabled: true,
    chatbotWelcomeMessage: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    emailNotifications: true,
    smsNotifications: false
  },
  
  // UI State
  loading: {
    dashboard: false,
    users: false,
    products: false,
    orders: false,
    settings: false
  },
  
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      const { section, loading } = action.payload;
      state.loading[section] = loading;
    }
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading.dashboard = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload;
      });

    // Users
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      });

    // Products
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading.products = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload.products;
        state.productsPagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product._id !== action.payload);
      });

    // Orders
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading.orders = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });

    // System Settings
    builder
      .addCase(getSystemSettings.pending, (state) => {
        state.loading.settings = true;
      })
      .addCase(getSystemSettings.fulfilled, (state, action) => {
        state.loading.settings = false;
        state.systemSettings = action.payload;
      })
      .addCase(getSystemSettings.rejected, (state, action) => {
        state.loading.settings = false;
        state.error = action.payload;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload;
      });
  }
});

export const { clearError, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
