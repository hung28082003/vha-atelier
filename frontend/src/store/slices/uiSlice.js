import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Loading states
  isLoading: false,
  loadingMessage: '',
  
  // Modal states
  modals: {
    login: false,
    register: false,
    forgotPassword: false,
    productQuickView: false,
    sizeGuide: false,
    imageGallery: false,
    confirmDialog: false,
  },
  
  // Sidebar states
  sidebars: {
    mobileMenu: false,
    filters: false,
    cart: false,
    wishlist: false,
  },
  
  // Toast notifications
  toasts: [],
  
  // Search
  search: {
    isOpen: false,
    query: '',
    results: [],
    isSearching: false,
  },
  
  // Theme and appearance
  theme: {
    mode: 'light', // 'light' | 'dark'
    primaryColor: 'earth',
    fontSize: 'medium', // 'small' | 'medium' | 'large'
  },
  
  // Layout
  layout: {
    headerHeight: 80,
    sidebarWidth: 300,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  },
  
  // Page states
  pages: {
    currentPage: 'home',
    previousPage: null,
    pageTitle: 'VHA Atelier',
    breadcrumbs: [],
  },
  
  // User interface preferences
  preferences: {
    animationsEnabled: true,
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
  },
  
  // Error states
  errors: {
    global: null,
    network: null,
    validation: {},
  },
  
  // Success messages
  success: {
    message: null,
    type: 'info', // 'success' | 'info' | 'warning'
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
    },
    
    // Modal actions
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Sidebar actions
    openSidebar: (state, action) => {
      const sidebarName = action.payload;
      if (state.sidebars.hasOwnProperty(sidebarName)) {
        state.sidebars[sidebarName] = true;
      }
    },
    
    closeSidebar: (state, action) => {
      const sidebarName = action.payload;
      if (state.sidebars.hasOwnProperty(sidebarName)) {
        state.sidebars[sidebarName] = false;
      }
    },
    
    closeAllSidebars: (state) => {
      Object.keys(state.sidebars).forEach(sidebar => {
        state.sidebars[sidebar] = false;
      });
    },
    
    toggleSidebar: (state, action) => {
      const sidebarName = action.payload;
      if (state.sidebars.hasOwnProperty(sidebarName)) {
        state.sidebars[sidebarName] = !state.sidebars[sidebarName];
      }
    },
    
    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Search actions
    openSearch: (state) => {
      state.search.isOpen = true;
    },
    
    closeSearch: (state) => {
      state.search.isOpen = false;
      state.search.query = '';
      state.search.results = [];
    },
    
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    
    setSearchResults: (state, action) => {
      state.search.results = action.payload;
    },
    
    setSearching: (state, action) => {
      state.search.isSearching = action.payload;
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    
    toggleTheme: (state) => {
      state.theme.mode = state.theme.mode === 'light' ? 'dark' : 'light';
    },
    
    // Layout actions
    setLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    
    setScreenSize: (state, action) => {
      const { isMobile, isTablet, isDesktop } = action.payload;
      state.layout.isMobile = isMobile;
      state.layout.isTablet = isTablet;
      state.layout.isDesktop = isDesktop;
    },
    
    // Page actions
    setCurrentPage: (state, action) => {
      state.pages.previousPage = state.pages.currentPage;
      state.pages.currentPage = action.payload.page;
      state.pages.pageTitle = action.payload.title || state.pages.pageTitle;
      state.pages.breadcrumbs = action.payload.breadcrumbs || [];
    },
    
    setPageTitle: (state, action) => {
      state.pages.pageTitle = action.payload;
    },
    
    setBreadcrumbs: (state, action) => {
      state.pages.breadcrumbs = action.payload;
    },
    
    // Preferences actions
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // Error actions
    setError: (state, action) => {
      const { type, message, field } = action.payload;
      if (field) {
        state.errors.validation[field] = message;
      } else if (type === 'global') {
        state.errors.global = message;
      } else if (type === 'network') {
        state.errors.network = message;
      }
    },
    
    clearError: (state, action) => {
      const { type, field } = action.payload || {};
      if (field) {
        delete state.errors.validation[field];
      } else if (type === 'global') {
        state.errors.global = null;
      } else if (type === 'network') {
        state.errors.network = null;
      } else {
        // Clear all errors
        state.errors.global = null;
        state.errors.network = null;
        state.errors.validation = {};
      }
    },
    
    // Success actions
    setSuccess: (state, action) => {
      state.success = {
        message: action.payload.message,
        type: action.payload.type || 'success',
      };
    },
    
    clearSuccess: (state) => {
      state.success = {
        message: null,
        type: 'info',
      };
    },
    
    // Reset actions
    resetUI: (state) => {
      return { ...initialState, theme: state.theme, preferences: state.preferences };
    },
  },
});

export const {
  // Loading
  setLoading,
  clearLoading,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Sidebars
  openSidebar,
  closeSidebar,
  closeAllSidebars,
  toggleSidebar,
  
  // Toasts
  addToast,
  removeToast,
  clearToasts,
  
  // Search
  openSearch,
  closeSearch,
  setSearchQuery,
  setSearchResults,
  setSearching,
  
  // Theme
  setTheme,
  toggleTheme,
  
  // Layout
  setLayout,
  setScreenSize,
  
  // Pages
  setCurrentPage,
  setPageTitle,
  setBreadcrumbs,
  
  // Preferences
  updatePreferences,
  
  // Errors
  setError,
  clearError,
  
  // Success
  setSuccess,
  clearSuccess,
  
  // Reset
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
