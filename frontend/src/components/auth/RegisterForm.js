import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerUser } from '../../store/slices/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/login', { 
        state: { 
          message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.' 
        } 
      });
    } catch (error) {
      // Error is handled by the slice
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-earth-900 mb-2">
          Tạo tài khoản mới
        </h2>
        <p className="text-earth-600">
          Tham gia VHA Atelier ngay hôm nay
        </p>
      </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-earth-700 mb-2">
                  Tên
                </label>
                <input
                  {...register('firstName', {
                    required: 'Tên là bắt buộc',
                    minLength: {
                      value: 2,
                      message: 'Tên phải có ít nhất 2 ký tự',
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                  placeholder="Tên"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-warm-rust">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-earth-700 mb-2">
                  Họ
                </label>
                <input
                  {...register('lastName', {
                    required: 'Họ là bắt buộc',
                    minLength: {
                      value: 2,
                      message: 'Họ phải có ít nhất 2 ký tự',
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                  placeholder="Họ"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-warm-rust">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
                type="email"
                className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-warm-rust">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-earth-700 mb-2">
                Số điện thoại (tùy chọn)
              </label>
              <input
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
                type="tel"
                className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-warm-rust">{errors.phone.message}</p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-earth-700 mb-2">
                Giới tính (tùy chọn)
              </label>
              <select
                {...register('gender')}
                className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-earth-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-earth-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-earth-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-warm-rust">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-earth-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Xác nhận mật khẩu là bắt buộc',
                    validate: (value) =>
                      value === password || 'Mật khẩu xác nhận không khớp',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300 bg-earth-50"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-earth-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-earth-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-warm-rust">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-warm-rust/10 border border-warm-rust/20 rounded-xl p-4">
              <p className="text-sm text-warm-rust">{error}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-warm-terracotta focus:ring-warm-terracotta border-earth-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-earth-600">
              Tôi đồng ý với{' '}
              <Link to="/terms" className="text-warm-terracotta hover:text-warm-rust">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link to="/privacy" className="text-warm-terracotta hover:text-warm-rust">
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-warm-terracotta hover:bg-warm-rust focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-terracotta transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng ký...
              </div>
            ) : (
              'Tạo tài khoản'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-earth-600">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-medium text-warm-terracotta hover:text-warm-rust transition-colors duration-300"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
    </div>
  );
};

export default RegisterForm;
