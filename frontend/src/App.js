import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProfile } from './store/slices/authSlice';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

// Main App Component
function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  // Load user profile on app start if authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, accessToken]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-earth">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main Layout Routes */}
          <Route path="/*" element={
            <>
              {/* Header */}
              <header className="glass-effect sticky top-0 z-50">
                <div className="container-custom">
                  <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-4">
                      <Link to="/" className="text-3xl font-black text-gradient animate-fade-in tracking-tight hover:text-warm-terracotta transition-colors duration-300">
                        VHA Atelier
                      </Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-12">
                      <Link to="/" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                        Trang Chủ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/products?category=women" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                        Nữ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/products?category=men" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                        Nam
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/products?category=accessories" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                        Phụ Kiện
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link to="/products?sale=true" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                        Khuyến Mãi
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </nav>
                    <div className="flex items-center space-x-6">
                      <button className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                      <button className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <Link to="/cart" className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110 relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        <span className="absolute top-0 right-0 w-4 h-4 bg-warm-terracotta text-white text-xs rounded-full flex items-center justify-center font-bold transform translate-x-1 -translate-y-1">3</span>
                      </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </Link>
                  <Link to="/profile" className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">
                  Đăng nhập
                </Link>
              )}
                    </div>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  {/* Add more routes here */}
                </Routes>
              </main>

              {/* Footer */}
              <footer className="bg-earth-900 text-earth-100 py-16">
                <div className="container-custom">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="text-2xl font-black text-gradient mb-6 tracking-tight">VHA Atelier</h3>
                      <p className="text-earth-300 mb-6 leading-relaxed">
                        Khám phá phong cách thời trang hoàn hảo với VHA Atelier. 
                        Chúng tôi mang đến những xu hướng mới nhất và trải nghiệm mua sắm tuyệt vời.
                      </p>
                      <div className="flex space-x-4">
                        <a href="https://facebook.com" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-warm-terracotta transition-colors duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        <a href="https://instagram.com" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-warm-terracotta transition-colors duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H7.721c-.49 0-.875.385-.875.875v7.558c0 .49.385.875.875.875h8.558c.49 0 .875-.385.875-.875V8.082c0-.49-.385-.875-.875-.875z"/>
                          </svg>
                        </a>
                        <a href="https://youtube.com" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-warm-terracotta transition-colors duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-earth-100 mb-6 tracking-tight">Cửa Hàng</h4>
                      <ul className="space-y-3">
                        <li><a href="/products?category=women" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Nữ</a></li>
                        <li><a href="/products?category=men" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Nam</a></li>
                        <li><a href="/products?category=accessories" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Phụ Kiện</a></li>
                        <li><a href="/products?sale=true" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Khuyến Mãi</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-earth-100 mb-6 tracking-tight">Hỗ Trợ</h4>
                      <ul className="space-y-3">
                        <li><a href="/contact" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Liên Hệ</a></li>
                        <li><a href="/size-guide" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Hướng Dẫn Size</a></li>
                        <li><a href="/shipping" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Vận Chuyển</a></li>
                        <li><a href="/returns" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Đổi Trả</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-earth-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="flex space-x-6 mb-4 md:mb-0">
                        <a href="/about" className="text-earth-400 hover:text-warm-terracotta transition-colors duration-300">Về Chúng Tôi</a>
                        <a href="/careers" className="text-earth-400 hover:text-warm-terracotta transition-colors duration-300">Tuyển Dụng</a>
                        <a href="/privacy" className="text-earth-400 hover:text-warm-terracotta transition-colors duration-300">Bảo Mật</a>
                        <a href="/terms" className="text-earth-400 hover:text-warm-terracotta transition-colors duration-300">Điều Khoản</a>
                      </div>
                      <p className="text-earth-400">
                        © 2024 VHA Atelier. Tất cả quyền được bảo lưu. Được xây dựng với ❤️ tại Việt Nam.
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          } />
        </Routes>
        
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#faf9f7',
                      color: '#2a221f',
                      border: '1px solid #e8e4dd',
                    },
                    success: {
                      iconTheme: {
                        primary: '#8a9a8b',
                        secondary: '#faf9f7',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#b85450',
                        secondary: '#faf9f7',
                      },
                    },
                  }}
                />

                {/* AI Chatbot Widget */}
                <ChatbotWidget />
              </div>
            </Router>
          );
        }

// Root App Component with Provider
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;