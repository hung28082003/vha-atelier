import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateUser } from '../../store/slices/adminSlice';
import { useDispatch } from 'react-redux';

const UserModal = ({ isOpen, onClose, user = null }) => {
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
      name: '',
      email: '',
      role: 'user',
      isActive: true,
      isEmailVerified: false
    }
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('role', user.role || 'user');
      setValue('isActive', user.isActive !== false);
      setValue('isEmailVerified', user.isEmailVerified || false);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(updateUser({ userId: user._id, userData: data })).unwrap();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa người dùng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                {...register('name', { required: 'Họ và tên là bắt buộc' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('email', { 
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò *
              </label>
              <select
                {...register('role', { required: 'Vai trò là bắt buộc' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">Người dùng</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Tài khoản hoạt động
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('isEmailVerified')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Email đã xác thực
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
