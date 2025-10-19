import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, addProductReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
      setSelectedImage(0);
    }
  }, [currentProduct]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Vui lòng chọn size');
      return;
    }

    if (!selectedColor) {
      toast.error('Vui lòng chọn màu sắc');
      return;
    }

    dispatch(addToCart({
      product: currentProduct._id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      price: currentProduct.price
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (isAuthenticated && selectedSize && selectedColor) {
      navigate('/cart');
    }
  };

  const onSubmitReview = async (data) => {
    try {
      await dispatch(addProductReview({
        productId: currentProduct._id,
        reviewData: data
      })).unwrap();
      
      reset();
      setShowReviewForm(false);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-terracotta"></div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Sản phẩm không tồn tại</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-earth-600">
            <li><a href="/" className="hover:text-warm-terracotta transition-colors duration-300">Trang chủ</a></li>
            <li className="text-earth-400">/</li>
            <li><a href="/products" className="hover:text-warm-terracotta transition-colors duration-300">Sản phẩm</a></li>
            <li className="text-earth-400">/</li>
            <li className="text-earth-900 font-medium">{currentProduct.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <img
                src={currentProduct.images?.[selectedImage]?.url || currentProduct.primaryImage?.url || '/placeholder-product.jpg'}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-warm-terracotta'
                        : 'border-earth-200 hover:border-earth-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-black text-earth-900 mb-4 tracking-tight">
                {currentProduct.name}
              </h1>
              
              <div className="flex items-center mb-6">
                {currentProduct.averageRating > 0 && (
                  <div className="flex items-center mr-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < Math.floor(currentProduct.averageRating)
                              ? 'text-warm-ochre'
                              : 'text-earth-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-earth-600">
                      ({currentProduct.reviews?.length || 0} đánh giá)
                    </span>
                  </div>
                )}
                <span className="text-sm text-earth-600">
                  SKU: {currentProduct.sku}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-black text-warm-terracotta">
                    {currentProduct.price.toLocaleString('vi-VN')} VNĐ
                  </span>
                  {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                    <span className="text-xl text-earth-500 line-through">
                      {currentProduct.originalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  )}
                </div>
                
                {currentProduct.stock > 0 ? (
                  <div className="flex items-center text-warm-sage">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Còn hàng ({currentProduct.stock} sản phẩm)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-warm-rust">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Hết hàng</span>
                  </div>
                )}
              </div>

              <p className="text-earth-700 mb-8 leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Size Selection */}
              {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-earth-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                          selectedSize === size
                            ? 'border-warm-terracotta bg-warm-terracotta text-white'
                            : 'border-earth-300 text-earth-700 hover:border-warm-terracotta'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {currentProduct.colors && currentProduct.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-earth-900 mb-3">Màu sắc</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                          selectedColor === color
                            ? 'border-warm-terracotta bg-warm-terracotta text-white'
                            : 'border-earth-300 text-earth-700 hover:border-warm-terracotta'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-earth-900 mb-3">Số lượng</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-earth-300 rounded-lg flex items-center justify-center hover:bg-earth-100 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-earth-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                    className="w-10 h-10 border border-earth-300 rounded-lg flex items-center justify-center hover:bg-earth-100 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0 || !selectedSize || !selectedColor}
                  className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock === 0 || !selectedSize || !selectedColor}
                  className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-earth-900">Đánh giá sản phẩm</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn btn-primary btn-sm"
                >
                  Viết đánh giá
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && isAuthenticated && (
              <form onSubmit={handleSubmit(onSubmitReview)} className="mb-8 p-6 bg-earth-50 rounded-xl">
                <h3 className="text-lg font-bold text-earth-900 mb-4">Viết đánh giá của bạn</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Đánh giá
                  </label>
                  <select
                    {...register('rating', { required: 'Vui lòng chọn đánh giá' })}
                    className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent"
                  >
                    <option value="">Chọn đánh giá</option>
                    <option value="5">5 sao - Tuyệt vời</option>
                    <option value="4">4 sao - Tốt</option>
                    <option value="3">3 sao - Bình thường</option>
                    <option value="2">2 sao - Không tốt</option>
                    <option value="1">1 sao - Rất tệ</option>
                  </select>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-warm-rust">{errors.rating.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    {...register('comment', { required: 'Vui lòng nhập nhận xét' })}
                    rows={4}
                    className="w-full px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  />
                  {errors.comment && (
                    <p className="mt-1 text-sm text-warm-rust">{errors.comment.message}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn btn-primary">
                    Gửi đánh giá
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn btn-secondary"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
              <div className="space-y-6">
                {currentProduct.reviews.map((review, index) => (
                  <div key={index} className="border-b border-earth-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-warm-terracotta rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {review.user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-earth-900">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className={`w-4 h-4 ${
                                  starIndex < review.rating
                                    ? 'text-warm-ochre'
                                    : 'text-earth-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-earth-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-earth-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-earth-600">Chưa có đánh giá nào cho sản phẩm này.</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="mt-4 btn btn-primary"
                  >
                    Viết đánh giá đầu tiên
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
