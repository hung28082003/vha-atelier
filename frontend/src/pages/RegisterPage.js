import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-warm-terracotta hover:text-warm-rust transition-colors duration-300 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trở về trang chủ
          </Link>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Additional Help */}
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
      </div>
    </div>
  );
};

export default RegisterPage;
