import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, clearFilters, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, pagination, isLoading } = useSelector((state) => state.products);
  
  const [currentFilters, setCurrentFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    // Fetch categories
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    
    // Fetch products with current filters
    dispatch(fetchProducts(currentFilters));
  }, [dispatch, currentFilters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setCurrentFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      sort: '-createdAt',
      search: '',
    });
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ ...currentFilters, page }));
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
            Sản Phẩm
          </h1>
          <p className="text-earth-600">
            Khám phá bộ sưu tập thời trang đa dạng của chúng tôi
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-earth-900">Bộ lọc</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-warm-terracotta hover:text-warm-rust transition-colors duration-300"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  value={currentFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                  placeholder="Tìm sản phẩm..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={currentFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Khoảng giá
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={currentFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                    placeholder="Từ"
                  />
                  <input
                    type="number"
                    value={currentFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                    placeholder="Đến"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={currentFilters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                  placeholder="Nhập thương hiệu..."
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Sắp xếp
                </label>
                <select
                  value={currentFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                >
                  <option value="-createdAt">Mới nhất</option>
                  <option value="createdAt">Cũ nhất</option>
                  <option value="price">Giá thấp đến cao</option>
                  <option value="-price">Giá cao đến thấp</option>
                  <option value="-averageRating">Đánh giá cao nhất</option>
                  <option value="-salesCount">Bán chạy nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-earth-600">
                Hiển thị {products.length} sản phẩm
                {pagination.totalProducts && ` trong tổng số ${pagination.totalProducts} sản phẩm`}
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-square bg-earth-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-earth-200 rounded mb-2"></div>
                      <div className="h-3 bg-earth-200 rounded mb-4 w-2/3"></div>
                      <div className="h-6 bg-earth-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 border border-earth-300 rounded-lg text-earth-700 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        Trước
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === pagination.currentPage;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                              isCurrentPage
                                ? 'bg-warm-terracotta text-white'
                                : 'border border-earth-300 text-earth-700 hover:bg-earth-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 border border-earth-300 rounded-lg text-earth-700 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
