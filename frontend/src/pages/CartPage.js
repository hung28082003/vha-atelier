import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
// import { isAuthenticated } from '../store/slices/authSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, itemCount, totalAmount, isEmpty, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-earth-600 mb-6">Bạn cần đăng nhập để xem giỏ hàng</p>
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-terracotta"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-earth-50">
        <div className="container-custom py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-earth-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-earth-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-earth-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <p className="text-earth-600">
            {itemCount} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-earth-900">Sản phẩm</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-warm-rust hover:text-warm-terracotta transition-colors duration-300"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-earth-200 rounded-xl hover:shadow-md transition-shadow duration-300">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.primaryImage?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-earth-900 mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-earth-600">
                        {item.size && (
                          <span>Size: <span className="font-medium">{item.size}</span></span>
                        )}
                        {item.color && (
                          <span>Màu: <span className="font-medium">{item.color}</span></span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-warm-terracotta mt-2">
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 border border-earth-300 rounded-lg flex items-center justify-center hover:bg-earth-100 transition-colors duration-300"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium text-earth-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 border border-earth-300 rounded-lg flex items-center justify-center hover:bg-earth-100 transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-earth-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-sm text-warm-rust hover:text-warm-terracotta transition-colors duration-300 mt-1"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-earth-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-earth-600">Tạm tính ({itemCount} sản phẩm)</span>
                  <span className="font-medium">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Phí vận chuyển</span>
                  <span className="font-medium text-warm-sage">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Thuế VAT</span>
                  <span className="font-medium">0 VNĐ</span>
                </div>
                <div className="border-t border-earth-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-earth-900">Tổng cộng</span>
                    <span className="text-xl font-black text-warm-terracotta">
                      {totalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn btn-primary btn-lg mb-4"
              >
                Thanh toán
              </button>

              <Link
                to="/products"
                className="w-full btn btn-secondary btn-lg text-center block"
              >
                Tiếp tục mua sắm
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-earth-50 rounded-xl">
                <div className="flex items-center justify-center space-x-2 text-sm text-earth-600">
                  <svg className="w-5 h-5 text-warm-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
