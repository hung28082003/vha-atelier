const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate QR code for payment
const generatePaymentQR = async (orderData) => {
  try {
    // Create payment data object
    const paymentData = {
      orderNumber: orderData.orderNumber,
      amount: orderData.total,
      accountNumber: process.env.BANK_ACCOUNT_NUMBER,
      accountName: process.env.BANK_ACCOUNT_NAME,
      bankName: process.env.BANK_NAME,
      content: `VHA-${orderData.orderNumber}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(paymentData), {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#2a221f', // Earth tone dark
        light: '#faf9f7' // Earth tone light
      },
      width: 300
    });

    return {
      qrCodeDataURL,
      paymentData,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Không thể tạo mã QR thanh toán');
  }
};

// Generate QR code for bank transfer
const generateBankTransferQR = async (orderData) => {
  try {
    // Create bank transfer data
    const transferData = {
      bankName: process.env.BANK_NAME,
      accountNumber: process.env.BANK_ACCOUNT_NUMBER,
      accountName: process.env.BANK_ACCOUNT_NAME,
      amount: orderData.total,
      content: `VHA-${orderData.orderNumber}`,
      orderNumber: orderData.orderNumber
    };

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(transferData), {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#c67b5c', // Warm terracotta
        light: '#faf9f7' // Earth tone light
      },
      width: 300
    });

    return {
      qrCodeDataURL,
      transferData,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
  } catch (error) {
    console.error('Error generating bank transfer QR code:', error);
    throw new Error('Không thể tạo mã QR chuyển khoản');
  }
};

// Generate payment instructions
const generatePaymentInstructions = (orderData, paymentMethod) => {
  const instructions = {
    qr_code: {
      title: 'Thanh toán bằng QR Code',
      steps: [
        '1. Mở ứng dụng ngân hàng trên điện thoại',
        '2. Chọn chức năng "Quét mã QR"',
        '3. Quét mã QR bên dưới',
        '4. Kiểm tra thông tin thanh toán',
        '5. Xác nhận thanh toán',
        '6. Lưu lại biên lai giao dịch'
      ],
      note: 'Mã QR có hiệu lực trong 15 phút. Vui lòng thanh toán trong thời gian này.'
    },
    bank_transfer: {
      title: 'Chuyển khoản ngân hàng',
      steps: [
        '1. Chuyển khoản đến tài khoản:',
        `   - Ngân hàng: ${process.env.BANK_NAME}`,
        `   - Số tài khoản: ${process.env.BANK_ACCOUNT_NUMBER}`,
        `   - Tên tài khoản: ${process.env.BANK_ACCOUNT_NAME}`,
        `   - Số tiền: ${orderData.total.toLocaleString('vi-VN')} VNĐ`,
        `   - Nội dung: VHA-${orderData.orderNumber}`,
        '2. Chụp ảnh biên lai chuyển khoản',
        '3. Gửi ảnh qua email hoặc liên hệ hotline'
      ],
      note: 'Đơn hàng sẽ được xử lý sau khi xác nhận chuyển khoản thành công.'
    },
    cod: {
      title: 'Thanh toán khi nhận hàng (COD)',
      steps: [
        '1. Kiểm tra hàng hóa khi nhận',
        '2. Thanh toán bằng tiền mặt cho nhân viên giao hàng',
        '3. Nhận biên lai giao hàng',
        '4. Giữ biên lai để đổi trả nếu cần'
      ],
      note: 'Phí COD: 30,000 VNĐ (miễn phí cho đơn hàng từ 500,000 VNĐ)'
    }
  };

  return instructions[paymentMethod] || instructions.qr_code;
};

// Verify payment (mock function - in real app, integrate with bank API)
const verifyPayment = async (orderNumber, transactionId) => {
  try {
    // In a real application, this would call the bank's API
    // to verify the payment transaction
    
    // Mock verification logic
    const isValidTransaction = transactionId && transactionId.length > 10;
    
    if (isValidTransaction) {
      return {
        success: true,
        message: 'Thanh toán thành công',
        transactionId,
        paidAt: new Date()
      };
    } else {
      return {
        success: false,
        message: 'Giao dịch không hợp lệ'
      };
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Không thể xác minh thanh toán');
  }
};

// Generate payment summary
const generatePaymentSummary = (orderData) => {
  return {
    orderNumber: orderData.orderNumber,
    totalAmount: orderData.total,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    discount: orderData.discount || 0,
    paymentMethod: orderData.paymentMethod,
    createdAt: orderData.createdAt,
    expiresAt: new Date(orderData.createdAt.getTime() + 15 * 60 * 1000), // 15 minutes
    status: orderData.status,
    paymentStatus: orderData.paymentStatus
  };
};

// Check payment expiration
const isPaymentExpired = (orderData) => {
  const expirationTime = new Date(orderData.createdAt.getTime() + 15 * 60 * 1000);
  return new Date() > expirationTime;
};

// Generate payment receipt
const generatePaymentReceipt = (orderData, paymentData) => {
  return {
    receiptNumber: `RCP-${orderData.orderNumber}`,
    orderNumber: orderData.orderNumber,
    customerName: orderData.shippingAddress.fullName,
    customerPhone: orderData.shippingAddress.phone,
    items: orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    total: orderData.total,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentStatus,
    paidAt: paymentData?.paidAt || null,
    transactionId: paymentData?.transactionId || null,
    createdAt: orderData.createdAt
  };
};

module.exports = {
  generatePaymentQR,
  generateBankTransferQR,
  generatePaymentInstructions,
  verifyPayment,
  generatePaymentSummary,
  isPaymentExpired,
  generatePaymentReceipt
};
