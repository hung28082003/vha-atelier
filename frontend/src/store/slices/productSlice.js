import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, categoriesAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Products async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải danh sách sản phẩm';
      return rejectWithValue(message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProduct(id);
      return response.data.data.product;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải thông tin sản phẩm';
      return rejectWithValue(message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getFeaturedProducts(limit);
      return response.data.data.products;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải sản phẩm nổi bật';
      return rejectWithValue(message);
    }
  }
);

export const fetchNewProducts = createAsyncThunk(
  'products/fetchNewProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getNewProducts(limit);
      return response.data.data.products;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải sản phẩm mới';
      return rejectWithValue(message);
    }
  }
);

export const fetchOnSaleProducts = createAsyncThunk(
  'products/fetchOnSaleProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getOnSaleProducts(limit);
      return response.data.data.products;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải sản phẩm khuyến mãi';
      return rejectWithValue(message);
    }
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  'products/fetchTopSellingProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getTopSellingProducts(limit);
      return response.data.data.products;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải sản phẩm bán chạy';
      return rejectWithValue(message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.searchProducts(query, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Tìm kiếm thất bại';
      return rejectWithValue(message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, params }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProductsByCategory(categoryId, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải sản phẩm theo danh mục';
      return rejectWithValue(message);
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.addReview(productId, reviewData);
      toast.success('Thêm đánh giá thành công!');
      return response.data.data.product;
    } catch (error) {
      const message = error.response?.data?.message || 'Thêm đánh giá thất bại';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Categories async thunks
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategories(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải danh mục';
      return rejectWithValue(message);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'products/fetchCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategory(id);
      return response.data.data.category;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải thông tin danh mục';
      return rejectWithValue(message);
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'products/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategoryTree();
      return response.data.data.categories;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải cây danh mục';
      return rejectWithValue(message);
    }
  }
);

export const fetchFeaturedCategories = createAsyncThunk(
  'products/fetchFeaturedCategories',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getFeaturedCategories(limit);
      return response.data.data.categories;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải danh mục nổi bật';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  // Products
  products: [],
  currentProduct: null,
  featuredProducts: [],
  newProducts: [],
  onSaleProducts: [],
  topSellingProducts: [],
  searchResults: {
    products: [],
    pagination: null,
  },
  categoryProducts: {
    products: [],
    pagination: null,
  },
  
  // Categories
  categories: [],
  categoryTree: [],
  featuredCategories: [],
  currentCategory: null,
  
  // UI state
  isLoading: false,
  isSearching: false,
  error: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  },
  
  // Filters
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    sort: '-createdAt',
  },
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = {
        products: [],
        pagination: null,
      };
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = {
        products: [],
        pagination: null,
      };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        sort: '-createdAt',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      
      // Fetch New Products
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.newProducts = action.payload;
      })
      
      // Fetch On Sale Products
      .addCase(fetchOnSaleProducts.fulfilled, (state, action) => {
        state.onSaleProducts = action.payload;
      })
      
      // Fetch Top Selling Products
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.topSellingProducts = action.payload;
      })
      
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })
      
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryProducts = action.payload;
      })
      
      // Add Product Review
      .addCase(addProductReview.fulfilled, (state, action) => {
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      
      // Fetch Category
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })
      
      // Fetch Category Tree
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.categoryTree = action.payload;
      })
      
      // Fetch Featured Categories
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.featuredCategories = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentProduct,
  clearSearchResults,
  clearCategoryProducts,
  setFilters,
  clearFilters,
  setPagination,
} = productSlice.actions;

export default productSlice.reducer;
