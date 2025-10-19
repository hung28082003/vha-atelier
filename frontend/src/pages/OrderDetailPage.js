import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrder } from '../store/slices/orderSlice';

const OrderDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-terracotta"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Đơn hàng không tồn tại</h2>
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-primary"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-earth-600 hover:text-warm-terracotta transition-colors duration-300 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách đơn hàng
          </button>
          
          <h1 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
            Chi tiết đơn hàng
          </h1>
          <p className="text-earth-600">
            Mã đơn hàng: <span className="font-bold">{currentOrder.orderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4">Trạng thái đơn hàng</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                    {getStatusText(currentOrder.status)}
                  </div>
                </div>
                <div className="text-sm text-earth-600">
                  Đặt hàng lúc: {new Date(currentOrder.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-6">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-earth-200 rounded-xl">
                    <div className="w-20 h-20 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.primaryImage?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-earth-900 mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-earth-600 mb-2">
                        {item.size && (
                          <span>Size: <span className="font-medium">{item.size}</span></span>
                        )}
                        {item.color && (
                          <span>Màu: <span className="font-medium">{item.color}</span></span>
                        )}
                        <span>Số lượng: <span className="font-medium">{item.quantity}</span></span>
                      </div>
                      <div className="text-lg font-bold text-warm-terracotta">
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-earth-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-6">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-earth-900 mb-2">Người nhận</h3>
                  <p className="text-earth-700">
                    {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                  </p>
                  <p className="text-earth-700">{currentOrder.shippingAddress.email}</p>
                  <p className="text-earth-700">{currentOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <h3 className="font-bold text-earth-900 mb-2">Địa chỉ giao hàng</h3>
                  <p className="text-earth-700">
                    {currentOrder.shippingAddress.street}
                  </p>
                  <p className="text-earth-700">
                    {currentOrder.shippingAddress.ward}, {currentOrder.shippingAddress.district}
                  </p>
                  <p className="text-earth-700">
                    {currentOrder.shippingAddress.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {currentOrder.notes && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-earth-900 mb-4">Ghi chú đơn hàng</h2>
                <p className="text-earth-700">{currentOrder.notes}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-earth-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-earth-600">Mã đơn hàng</span>
                  <span className="font-medium">{currentOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Ngày đặt</span>
                  <span className="font-medium">
                    {new Date(currentOrder.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Phương thức thanh toán</span>
                  <span className="font-medium">
                    {currentOrder.paymentMethod === 'qr' ? 'QR Code' : currentOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Trạng thái thanh toán</span>
                  <span className={`font-medium ${
                    currentOrder.paymentStatus === 'paid' ? 'text-warm-sage' : 
                    currentOrder.paymentStatus === 'pending' ? 'text-warm-ochre' : 'text-warm-rust'
                  }`}>
                    {currentOrder.paymentStatus === 'paid' ? 'Đã thanh toán' :
                     currentOrder.paymentStatus === 'pending' ? 'Chờ thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>

              <div className="border-t border-earth-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-earth-600">Tạm tính</span>
                  <span className="font-medium">{currentOrder.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Phí vận chuyển</span>
                  <span className="font-medium text-warm-sage">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Thuế VAT</span>
                  <span className="font-medium">0 VNĐ</span>
                </div>
                <div className="border-t border-earth-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-earth-900">Tổng cộng</span>
                    <span className="text-xl font-black text-warm-terracotta">
                      {currentOrder.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {currentOrder.status === 'pending' && (
                  <button className="w-full btn btn-secondary">
                    Hủy đơn hàng
                  </button>
                )}
                {currentOrder.status === 'delivered' && (
                  <button className="w-full btn btn-primary">
                    Đánh giá sản phẩm
                  </button>
                )}
                <button
                  onClick={() => navigate('/products')}
                  className="w-full btn btn-outline"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
