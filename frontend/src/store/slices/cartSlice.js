import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Cart async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải giỏ hàng';
      return rejectWithValue(message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(itemData);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      toast.success('Cập nhật giỏ hàng thành công!');
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể cập nhật giỏ hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể xóa giỏ hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const mergeCarts = createAsyncThunk(
  'cart/mergeCarts',
  async (guestCartItems, { rejectWithValue }) => {
    try {
      const response = await cartAPI.mergeCarts(guestCartItems);
      toast.success('Gộp giỏ hàng thành công!');
      return response.data.data.cart;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể gộp giỏ hàng';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
  isEmpty: true,
  isLoading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local cart actions for guest users
    addItemLocally: (state, action) => {
      const { product, quantity = 1, size, color, price } = action.payload;
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.product._id === product._id && 
        item.size === size && 
        item.color === color
      );
      
      if (existingItemIndex > -1) {
        // Update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          _id: Date.now().toString(), // Temporary ID
          product,
          quantity,
          size,
          color,
          price,
          addedAt: new Date().toISOString(),
        });
      }
      
      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.isEmpty = state.items.length === 0;
    },
    
    updateItemQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item
          state.items = state.items.filter(item => item._id !== itemId);
        } else {
          item.quantity = quantity;
        }
        
        // Update totals
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        state.isEmpty = state.items.length === 0;
      }
    },
    
    removeItemLocally: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      
      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.isEmpty = state.items.length === 0;
    },
    
    clearCartLocally: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.totalAmount = 0;
      state.isEmpty = true;
    },
    
    setCart: (state, action) => {
      const cart = action.payload;
      state.items = cart.items || [];
      state.itemCount = cart.itemCount || 0;
      state.totalAmount = cart.totalAmount || 0;
      state.isEmpty = cart.isEmpty || true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Merge Carts
      .addCase(mergeCarts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload;
        state.items = cart.items || [];
        state.itemCount = cart.itemCount || 0;
        state.totalAmount = cart.totalAmount || 0;
        state.isEmpty = cart.isEmpty || true;
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  addItemLocally,
  updateItemQuantityLocally,
  removeItemLocally,
  clearCartLocally,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
