import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchNewProducts, fetchOnSaleProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, newProducts } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch featured products on component mount
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchNewProducts(8));
    dispatch(fetchOnSaleProducts(8));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-terracotta/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-warm-ochre/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-warm-sage/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-earth-900 mb-8 animate-slide-up tracking-tight">
              Khám Phá
              <span className="text-gradient block mt-4 p-2 animate-text-reveal font-black">Phong Cách Hoàn Hảo</span>
            </h1>
            <p className="text-xl md:text-2xl text-earth-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
              VHA Atelier mang đến cho bạn những xu hướng thời trang mới nhất với lời khuyên tạo kiểu được hỗ trợ bởi AI. 
              Tìm phong cách hoàn hảo của bạn với trợ lý chatbot thông minh của chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in" style={{animationDelay: '0.6s'}}>
              <Link to="/products" className="btn btn-primary btn-lg group shimmer-effect">
                <span className="flex items-center">
                  Mua Ngay
                  <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg group">
                <span className="flex items-center">
                  Tìm Hiểu Thêm
                  <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding-sm bg-earth-100/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">
              Khám phá những sản phẩm được yêu thích nhất từ bộ sưu tập của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-secondary btn-lg">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-sm">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-terracotta/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-terracotta group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-earth-900 mb-4 group-hover:text-warm-terracotta transition-colors duration-300 tracking-tight">Trợ Lý Tạo Kiểu AI</h3>
              <p className="text-earth-700 leading-relaxed">Nhận lời khuyên thời trang cá nhân hóa từ chatbot thông minh hiểu rõ sở thích phong cách của bạn</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-ochre/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-ochre/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-ochre group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-earth-900 mb-4 group-hover:text-warm-ochre transition-colors duration-300 tracking-tight">Thanh Toán QR</h3>
              <p className="text-earth-700 leading-relaxed">Thanh toán nhanh chóng và an toàn với công nghệ mã QR, giúp việc thanh toán trở nên dễ dàng và nhanh chóng</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-sage/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-sage/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-sage group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-earth-900 mb-4 group-hover:text-warm-sage transition-colors duration-300 tracking-tight">Giao Hàng Nhanh</h3>
              <p className="text-earth-700 leading-relaxed">Giao hàng nhanh chóng trên toàn Việt Nam với theo dõi thời gian thực và bao bì cao cấp</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="section-padding-sm bg-earth-100/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
              Sản Phẩm Mới
            </h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">
              Cập nhật những xu hướng thời trang mới nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
