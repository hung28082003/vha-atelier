const sendEmail = require('../utils/sendEmail');
const Order = require('../models/Order');
const User = require('../models/User');

// Email templates
const emailTemplates = {
  // Order confirmation email
  orderConfirmation: (order, user) => ({
    subject: `Xác nhận đơn hàng #${order.orderNumber} - VHA Atelier`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #c67b5c, #8a9a8b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VHA Atelier</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Xác nhận đơn hàng thành công</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #2a221f; margin-bottom: 20px;">Xin chào ${user.firstName} ${user.lastName}!</h2>
          
          <p style="color: #5d5146; line-height: 1.6; margin-bottom: 20px;">
            Cảm ơn bạn đã đặt hàng tại VHA Atelier! Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.
          </p>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2a221f; margin-top: 0;">Thông tin đơn hàng</h3>
            <p><strong>Mã đơn hàng:</strong> ${order.orderNumber}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #2a221f;">Sản phẩm đã đặt</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #e8e4dd; padding: 15px 0;">
                <p style="margin: 0; font-weight: bold;">${item.name}</p>
                <p style="margin: 5px 0; color: #7a6b5c;">Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2a221f; margin-top: 0;">Địa chỉ giao hàng</h3>
            <p style="margin: 0;">${order.shippingAddress.fullName}</p>
            <p style="margin: 0;">${order.shippingAddress.phone}</p>
            <p style="margin: 0;">${order.shippingAddress.address}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
          </div>
          
          <p style="color: #5d5146; line-height: 1.6;">
            Chúng tôi sẽ gửi email cập nhật khi đơn hàng được xử lý và giao hàng. 
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" 
               style="background: #c67b5c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Xem chi tiết đơn hàng
            </a>
          </div>
        </div>
        
        <div style="background: #2a221f; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 VHA Atelier. Tất cả quyền được bảo lưu.</p>
          <p style="margin: 10px 0 0 0;">Được xây dựng với ❤️ tại Việt Nam</p>
        </div>
      </div>
    `
  }),

  // Order status update email
  orderStatusUpdate: (order, user, newStatus) => ({
    subject: `Cập nhật đơn hàng #${order.orderNumber} - VHA Atelier`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #c67b5c, #8a9a8b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VHA Atelier</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Cập nhật trạng thái đơn hàng</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #2a221f; margin-bottom: 20px;">Xin chào ${user.firstName} ${user.lastName}!</h2>
          
          <p style="color: #5d5146; line-height: 1.6; margin-bottom: 20px;">
            Đơn hàng #${order.orderNumber} của bạn đã được cập nhật trạng thái.
          </p>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #2a221f; margin-top: 0;">Trạng thái hiện tại</h3>
            <div style="background: #c67b5c; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold;">
              ${getStatusText(newStatus)}
            </div>
          </div>
          
          ${getStatusMessage(newStatus, order)}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" 
               style="background: #c67b5c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Xem chi tiết đơn hàng
            </a>
          </div>
        </div>
        
        <div style="background: #2a221f; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 VHA Atelier. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    `
  }),

  // Payment confirmation email
  paymentConfirmation: (order, user) => ({
    subject: `Xác nhận thanh toán #${order.orderNumber} - VHA Atelier`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #8a9a8b, #c67b5c); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VHA Atelier</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Thanh toán thành công</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #2a221f; margin-bottom: 20px;">Xin chào ${user.firstName} ${user.lastName}!</h2>
          
          <p style="color: #5d5146; line-height: 1.6; margin-bottom: 20px;">
            Chúng tôi đã nhận được thanh toán cho đơn hàng #${order.orderNumber}. Cảm ơn bạn!
          </p>
          
          <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8a9a8b;">
            <h3 style="color: #2a221f; margin-top: 0;">Thông tin thanh toán</h3>
            <p><strong>Số tiền:</strong> ${order.total.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Phương thức:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
            <p><strong>Thời gian:</strong> ${new Date(order.paymentDetails.paidAt).toLocaleString('vi-VN')}</p>
            ${order.paymentDetails.transactionId ? `<p><strong>Mã giao dịch:</strong> ${order.paymentDetails.transactionId}</p>` : ''}
          </div>
          
          <p style="color: #5d5146; line-height: 1.6;">
            Đơn hàng của bạn đang được xử lý và sẽ được giao hàng trong thời gian sớm nhất. 
            Chúng tôi sẽ gửi email cập nhật khi đơn hàng được giao.
          </p>
        </div>
        
        <div style="background: #2a221f; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 VHA Atelier. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    `
  }),

  // Welcome email for new users
  welcomeEmail: (user) => ({
    subject: 'Chào mừng đến với VHA Atelier!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #c67b5c, #8a9a8b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VHA Atelier</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Chào mừng bạn!</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #2a221f; margin-bottom: 20px;">Xin chào ${user.firstName} ${user.lastName}!</h2>
          
          <p style="color: #5d5146; line-height: 1.6; margin-bottom: 20px;">
            Cảm ơn bạn đã đăng ký tài khoản tại VHA Atelier! Chúng tôi rất vui được chào đón bạn.
          </p>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2a221f; margin-top: 0;">Những gì bạn có thể làm:</h3>
            <ul style="color: #5d5146; line-height: 1.8;">
              <li>Khám phá bộ sưu tập thời trang đa dạng</li>
              <li>Nhận tư vấn từ AI Style Assistant</li>
              <li>Thanh toán nhanh chóng với QR Code</li>
              <li>Theo dõi đơn hàng trực tuyến</li>
              <li>Tích lũy điểm thưởng và nhận ưu đãi</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="background: #c67b5c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Bắt đầu mua sắm
            </a>
          </div>
        </div>
        
        <div style="background: #2a221f; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 VHA Atelier. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    `
  })
};

// Helper functions
const getPaymentMethodText = (method) => {
  const methods = {
    'qr_code': 'QR Code',
    'cod': 'Thanh toán khi nhận hàng (COD)',
    'bank_transfer': 'Chuyển khoản ngân hàng'
  };
  return methods[method] || method;
};

const getStatusText = (status) => {
  const statuses = {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy',
    'returned': 'Đã trả hàng'
  };
  return statuses[status] || status;
};

const getStatusMessage = (status, order) => {
  const messages = {
    'confirmed': `
      <p style="color: #5d5146; line-height: 1.6;">
        Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị. 
        Chúng tôi sẽ thông báo khi đơn hàng được gửi đi.
      </p>
    `,
    'processing': `
      <p style="color: #5d5146; line-height: 1.6;">
        Đơn hàng của bạn đang được xử lý và đóng gói. 
        Chúng tôi sẽ gửi hàng trong thời gian sớm nhất.
      </p>
    `,
    'shipped': `
      <p style="color: #5d5146; line-height: 1.6;">
        Đơn hàng của bạn đã được gửi đi! 
        ${order.trackingNumber ? `Mã theo dõi: <strong>${order.trackingNumber}</strong>` : ''}
        <br>Dự kiến giao hàng: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('vi-VN') : '2-3 ngày làm việc'}
      </p>
    `,
    'delivered': `
      <p style="color: #5d5146; line-height: 1.6;">
        Đơn hàng của bạn đã được giao thành công! 
        Cảm ơn bạn đã mua sắm tại VHA Atelier.
      </p>
    `,
    'cancelled': `
      <p style="color: #5d5146; line-height: 1.6;">
        Đơn hàng của bạn đã bị hủy. 
        Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong vòng 3-5 ngày làm việc.
      </p>
    `
  };
  return messages[status] || '';
};

// Email service functions
const sendOrderConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order || !order.user) return false;

    const emailData = emailTemplates.orderConfirmation(order, order.user);
    await sendEmail({
      email: order.user.email,
      subject: emailData.subject,
      message: emailData.html
    });

    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

const sendOrderStatusUpdate = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order || !order.user) return false;

    const emailData = emailTemplates.orderStatusUpdate(order, order.user, newStatus);
    await sendEmail({
      email: order.user.email,
      subject: emailData.subject,
      message: emailData.html
    });

    return true;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return false;
  }
};

const sendPaymentConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order || !order.user) return false;

    const emailData = emailTemplates.paymentConfirmation(order, order.user);
    await sendEmail({
      email: order.user.email,
      subject: emailData.subject,
      message: emailData.html
    });

    return true;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
};

const sendWelcomeEmail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    const emailData = emailTemplates.welcomeEmail(user);
    await sendEmail({
      email: user.email,
      subject: emailData.subject,
      message: emailData.html
    });

    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPaymentConfirmation,
  sendWelcomeEmail,
  emailTemplates
};
