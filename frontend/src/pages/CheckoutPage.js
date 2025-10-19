import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrder, generatePaymentQR } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, itemCount, totalAmount, isEmpty } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { paymentQR, isProcessingPayment } = useSelector((state) => state.orders);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.street || '',
      city: user?.address?.city || '',
      district: user?.address?.district || '',
      ward: user?.address?.ward || '',
      paymentMethod: 'qr',
      notes: '',
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (isEmpty) {
      navigate('/cart');
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, isEmpty, navigate]);

  const onSubmit = async (data) => {
    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          street: data.address,
          city: data.city,
          district: data.district,
          ward: data.ward,
        },
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        totalAmount: totalAmount,
      };

      const order = await dispatch(createOrder(orderData)).unwrap();
      setCreatedOrder(order);
      setOrderCreated(true);
      setCurrentStep(2);

      // Generate payment QR if payment method is QR
      if (data.paymentMethod === 'qr') {
        await dispatch(generatePaymentQR({
          orderId: order._id,
          paymentMethod: 'qr'
        })).unwrap();
      }

    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handlePaymentComplete = () => {
    navigate(`/orders/${createdOrder._id}`);
  };

  if (!isAuthenticated || isEmpty) {
    return null;
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-earth-900 mb-4 tracking-tight">
            Thanh toán
          </h1>
          <p className="text-earth-600">
            Hoàn tất đơn hàng của bạn
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-warm-terracotta' : 'text-earth-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-warm-terracotta text-white' : 'bg-earth-200 text-earth-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Thông tin</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-warm-terracotta' : 'bg-earth-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-warm-terracotta' : 'text-earth-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-warm-terracotta text-white' : 'bg-earth-200 text-earth-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-earth-900 mb-6">Thông tin giao hàng</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Họ *
                      </label>
                      <input
                        {...register('lastName', { required: 'Họ là bắt buộc' })}
                        type="text"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập họ"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Tên *
                      </label>
                      <input
                        {...register('firstName', { required: 'Tên là bắt buộc' })}
                        type="text"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập tên"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.firstName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
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
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        {...register('phone', { 
                          required: 'Số điện thoại là bắt buộc',
                          pattern: {
                            value: /^[0-9]{10,11}$/,
                            message: 'Số điện thoại không hợp lệ'
                          }
                        })}
                        type="tel"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                      type="text"
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-warm-rust">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Tỉnh/Thành phố *
                      </label>
                      <input
                        {...register('city', { required: 'Tỉnh/Thành phố là bắt buộc' })}
                        type="text"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập tỉnh/thành phố"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <input
                        {...register('district', { required: 'Quận/Huyện là bắt buộc' })}
                        type="text"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập quận/huyện"
                      />
                      {errors.district && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.district.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Phường/Xã *
                      </label>
                      <input
                        {...register('ward', { required: 'Phường/Xã là bắt buộc' })}
                        type="text"
                        className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                        placeholder="Nhập phường/xã"
                      />
                      {errors.ward && (
                        <p className="mt-1 text-sm text-warm-rust">{errors.ward.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-earth-900 mb-6">Phương thức thanh toán</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-earth-300 rounded-xl cursor-pointer hover:border-warm-terracotta transition-colors duration-300">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="qr"
                        className="w-5 h-5 text-warm-terracotta focus:ring-warm-terracotta"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-warm-terracotta mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-medium text-earth-900">Thanh toán QR Code</span>
                        </div>
                        <p className="text-sm text-earth-600 mt-1">Quét mã QR để thanh toán nhanh chóng</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-earth-900 mb-6">Ghi chú đơn hàng</h2>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary btn-lg"
                >
                  Tiếp tục thanh toán
                </button>
              </form>
            )}

            {currentStep === 2 && orderCreated && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-warm-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-warm-sage" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-earth-900 mb-2">Đơn hàng đã được tạo!</h2>
                  <p className="text-earth-600">Mã đơn hàng: <span className="font-bold">{createdOrder.orderNumber}</span></p>
                </div>

                {paymentQR && (
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-earth-900 mb-4">Quét mã QR để thanh toán</h3>
                    <div className="bg-white p-6 rounded-xl border-2 border-earth-200 inline-block mb-4">
                      <img
                        src={paymentQR.qrCodeImage}
                        alt="QR Code"
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="bg-earth-50 rounded-xl p-4 mb-6">
                      <h4 className="font-bold text-earth-900 mb-2">Thông tin thanh toán:</h4>
                      <div className="text-sm text-earth-700 space-y-1">
                        <p><span className="font-medium">Ngân hàng:</span> {paymentQR.paymentDetails.bankName}</p>
                        <p><span className="font-medium">Số tài khoản:</span> {paymentQR.paymentDetails.bankAccountNumber}</p>
                        <p><span className="font-medium">Tên tài khoản:</span> {paymentQR.paymentDetails.bankAccountName}</p>
                        <p><span className="font-medium">Số tiền:</span> <span className="font-bold text-warm-terracotta">{paymentQR.paymentDetails.amount.toLocaleString('vi-VN')} VNĐ</span></p>
                        <p><span className="font-medium">Nội dung:</span> VHAAT-{paymentQR.paymentDetails.orderCode}</p>
                      </div>
                    </div>
                    <p className="text-sm text-earth-600 mb-6">
                      {paymentQR.paymentDetails.instructions}
                    </p>
                    <button
                      onClick={handlePaymentComplete}
                      className="btn btn-primary btn-lg"
                    >
                      Tôi đã thanh toán
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-earth-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.primaryImage?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-earth-900 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-earth-600">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` • Màu: ${item.color}`}
                      </div>
                      <div className="text-sm font-bold text-warm-terracotta">
                        {item.quantity} × {item.price.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-earth-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-earth-600">Tạm tính</span>
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
                <div className="border-t border-earth-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-earth-900">Tổng cộng</span>
                    <span className="text-xl font-black text-warm-terracotta">
                      {totalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
