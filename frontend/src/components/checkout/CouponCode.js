import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CouponCode = ({ onCouponApplied, appliedCoupon, onRemoveCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplying(true);
    try {
      // TODO: Implement coupon validation API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCoupon = {
        code: couponCode.toUpperCase(),
        discount: 10,
        type: 'percentage', // 'percentage' or 'fixed'
        minOrderAmount: 500000,
        maxDiscount: 100000,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      onCouponApplied(mockCoupon);
      setCouponCode('');
      toast.success('Áp dụng mã giảm giá thành công!');
    } catch (error) {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    toast.success('Đã xóa mã giảm giá');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mã giảm giá</h3>
      
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  Mã giảm giá: {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-700">
                  Giảm {appliedCoupon.discount}%
                  {appliedCoupon.maxDiscount && ` (tối đa ${appliedCoupon.maxDiscount.toLocaleString()}đ)`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã giảm giá"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isApplying}
            />
          </div>
          <button
            type="submit"
            disabled={isApplying || !couponCode.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
          </button>
        </form>
      )}

      {/* Available Coupons */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Mã giảm giá có sẵn:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">WELCOME10</span>
            <span className="text-gray-600">Giảm 10% cho đơn hàng đầu tiên</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">SAVE20</span>
            <span className="text-gray-600">Giảm 20% cho đơn hàng từ 1 triệu</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">FREESHIP</span>
            <span className="text-gray-600">Miễn phí vận chuyển</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCode;
