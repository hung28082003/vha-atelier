import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateOrderStatus } from '../../store/slices/adminSlice';
import { useDispatch } from 'react-redux';

const OrderModal = ({ isOpen, onClose, order = null }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      status: 'pending',
      notes: ''
    }
  });

  useEffect(() => {
    if (order) {
      setValue('status', order.status || 'pending');
      setValue('notes', order.adminNotes || '');
    } else {
      reset();
    }
  }, [order, setValue, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId: order._id, 
        status: data.status, 
        notes: data.notes 
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi tiết đơn hàng #{order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-lg">
                    {order.totalAmount?.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{order.user?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{order.user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SĐT:</span>
                  <span className="font-medium">{order.shippingAddress?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                    <p className="text-sm text-gray-600">
                      Kích thước: {item.size} | Màu: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity} x {item.price?.toLocaleString()}đ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {(item.quantity * item.price)?.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Status Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cập nhật trạng thái</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái mới *
              </label>
              <select
                {...register('status', { required: 'Trạng thái là bắt buộc' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập ghi chú cho khách hàng..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
