import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for user operations
export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/orders', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  }
);

export const getWishlist = createAsyncThunk(
  'user/getWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/wishlist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách yêu thích');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'user/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/wishlist/${productId}`);
      return { productId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào danh sách yêu thích');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'user/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/wishlist/${productId}`);
      return { productId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi danh sách yêu thích');
    }
  }
);

export const getUserAddresses = createAsyncThunk(
  'user/getAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/addresses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách địa chỉ');
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm địa chỉ');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật địa chỉ');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return { addressId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  }
);

const initialState = {
  profile: null,
  orders: [],
  wishlist: [],
  addresses: [],
  loading: {
    profile: false,
    orders: false,
    wishlist: false,
    addresses: false,
    updateProfile: false,
    changePassword: false
  },
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.orders = [];
      state.wishlist = [];
      state.addresses = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Get Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.profile = { ...state.profile, ...action.payload.data };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading.changePassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.changePassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error = action.payload;
      });

    // Get Orders
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading.orders = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.data.orders;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.payload;
      });

    // Get Wishlist
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading.wishlist = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading.wishlist = false;
        state.wishlist = action.payload.data;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading.wishlist = false;
        state.error = action.payload;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Add product to wishlist (you might want to fetch the full product data)
        // For now, we'll just add the productId
        if (!state.wishlist.find(item => item._id === action.payload.productId)) {
          state.wishlist.push({ _id: action.payload.productId });
        }
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(item => item._id !== action.payload.productId);
      });

    // Get Addresses
    builder
      .addCase(getUserAddresses.pending, (state) => {
        state.loading.addresses = true;
        state.error = null;
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.loading.addresses = false;
        state.addresses = action.payload.data;
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.loading.addresses = false;
        state.error = action.payload;
      });

    // Add Address
    builder
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload.data);
      });

    // Update Address
    builder
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr._id === action.payload.data._id);
        if (index !== -1) {
          state.addresses[index] = action.payload.data;
        }
      });

    // Delete Address
    builder
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload.addressId);
      });
  }
});

export const { clearUserError, clearUserData } = userSlice.actions;
export default userSlice.reducer;
