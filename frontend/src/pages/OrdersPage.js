import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../store/slices/orderSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersPagination, isLoading } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warm-ochre bg-warm-ochre/10';
      case 'confirmed':
        return 'text-warm-sage bg-warm-sage/10';
      case 'shipped':
        return 'text-warm-terracotta bg-warm-terracotta/10';
      case 'delivered':
        return 'text-warm-sage bg-warm-sage/10';
      case 'cancelled':
        return 'text-warm-rust bg-warm-rust/10';
      default:
        return 'text-earth-600 bg-earth-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-earth-600 mb-6">Bạn cần đăng nhập để xem đơn hàng</p>
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

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
            Đơn hàng của tôi
          </h1>
          <p className="text-earth-600">
            Quản lý và theo dõi đơn hàng của bạn
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-earth-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-earth-900 mb-4">Chưa có đơn hàng nào</h2>
            <p className="text-earth-600 mb-8">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Order Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-earth-900">
                          Đơn hàng #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-earth-600">
                          Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-4 mb-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="w-16 h-16 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.primaryImage?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 bg-earth-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-earth-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-earth-600">
                      <span>{order.items.length} sản phẩm</span>
                      <span>•</span>
                      <span>Tổng: <span className="font-bold text-warm-terracotta">{order.totalAmount.toLocaleString('vi-VN')} VNĐ</span></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-6">
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Xem chi tiết
                    </Link>
                    {order.status === 'pending' && (
                      <button className="btn btn-secondary btn-sm">
                        Hủy đơn hàng
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="btn btn-outline btn-sm">
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {userOrdersPagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    disabled={!userOrdersPagination.hasPrev}
                    className="px-4 py-2 border border-earth-300 rounded-lg text-earth-700 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Trước
                  </button>
                  
                  {[...Array(userOrdersPagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === userOrdersPagination.currentPage;
                    
                    return (
                      <button
                        key={page}
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
                    disabled={!userOrdersPagination.hasNext}
                    className="px-4 py-2 border border-earth-300 rounded-lg text-earth-700 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
