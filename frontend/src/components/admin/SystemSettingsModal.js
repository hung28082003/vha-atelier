import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getSystemSettings, updateSystemSettings } from '../../store/slices/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SystemSettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { systemSettings } = useSelector(state => state.admin);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      siteName: 'VHA Atelier',
      siteDescription: 'Thời trang cao cấp',
      contactEmail: 'contact@vha-atelier.com',
      contactPhone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      businessHours: {
        monday: '9:00 - 18:00',
        tuesday: '9:00 - 18:00',
        wednesday: '9:00 - 18:00',
        thursday: '9:00 - 18:00',
        friday: '9:00 - 18:00',
        saturday: '9:00 - 17:00',
        sunday: 'Nghỉ'
      },
      features: {
        enableRegistration: true,
        enableGuestCheckout: true,
        enableWishlist: true,
        enableReviews: true,
        enableChatbot: true
      }
    }
  });

  useEffect(() => {
    if (isOpen && systemSettings) {
      setValue('siteName', systemSettings.siteName || 'VHA Atelier');
      setValue('siteDescription', systemSettings.siteDescription || 'Thời trang cao cấp');
      setValue('contactEmail', systemSettings.contactEmail || 'contact@vha-atelier.com');
      setValue('contactPhone', systemSettings.contactPhone || '0123456789');
      setValue('address', systemSettings.address || '123 Đường ABC, Quận 1, TP.HCM');
      setValue('socialMedia.facebook', systemSettings.socialMedia?.facebook || '');
      setValue('socialMedia.instagram', systemSettings.socialMedia?.instagram || '');
      setValue('socialMedia.twitter', systemSettings.socialMedia?.twitter || '');
      setValue('features.enableRegistration', systemSettings.features?.enableRegistration !== false);
      setValue('features.enableGuestCheckout', systemSettings.features?.enableGuestCheckout !== false);
      setValue('features.enableWishlist', systemSettings.features?.enableWishlist !== false);
      setValue('features.enableReviews', systemSettings.features?.enableReviews !== false);
      setValue('features.enableChatbot', systemSettings.features?.enableChatbot !== false);
    }
  }, [isOpen, systemSettings, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(updateSystemSettings(data)).unwrap();
      toast.success('Cập nhật cài đặt hệ thống thành công!');
      onClose();
    } catch (error) {
      toast.error('Lỗi khi cập nhật cài đặt hệ thống');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Cài đặt hệ thống
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên website *
                </label>
                <input
                  {...register('siteName', { required: 'Tên website là bắt buộc' })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.siteName && (
                  <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả website
                </label>
                <input
                  {...register('siteDescription')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ *
                </label>
                <input
                  {...register('contactEmail', { 
                    required: 'Email liên hệ là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  {...register('contactPhone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mạng xã hội</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  {...register('socialMedia.facebook')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  {...register('socialMedia.instagram')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  {...register('socialMedia.twitter')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tính năng</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  {...register('features.enableRegistration')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Cho phép đăng ký tài khoản mới
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('features.enableGuestCheckout')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Cho phép mua hàng không cần đăng ký
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('features.enableWishlist')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Bật tính năng yêu thích
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('features.enableReviews')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Bật tính năng đánh giá sản phẩm
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('features.enableChatbot')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Bật AI Chatbot hỗ trợ khách hàng
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettingsModal;
