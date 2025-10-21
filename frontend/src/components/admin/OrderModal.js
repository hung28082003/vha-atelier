import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateOrderStatus } from '../../store/slices/adminSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const OrderModal = ({ isOpen, onClose, order = null }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(order?.status || 'pending');
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
  ];

  const handleStatusUpdate = async () => {
    if (!order) return;
    
    setIsLoading(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId: order._id, 
        statusData: { status: newStatus, notes } 
      })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      onClose();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  const getStatusInfo = (status) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết đơn hàng #{order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Mã đơn hàng:</span>
                  <p className="text-sm text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                  <p className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tổng tiền:</span>
                  <p className="text-sm text-gray-900 font-semibold">
                    {order.totalAmount?.toLocaleString()}đ
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phương thức thanh toán:</span>
                  <p className="text-sm text-gray-900">
                    {order.paymentMethod === 'qr_code' ? 'QR Code' : 'COD'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tên:</span>
                  <p className="text-sm text-gray-900">{order.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{order.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                  <p className="text-sm text-gray-900">{order.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-900">
                {order.shippingAddress?.fullName}<br />
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size} | Màu: {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.price?.toLocaleString()}đ
                    </p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cập nhật trạng thái</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái hiện tại
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusInfo(order.status).color}`}>
                  {getStatusInfo(order.status).label}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thêm ghi chú cho đơn hàng..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={isLoading || newStatus === order.status}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;