const User = require('../models/User');
const { generateTokens } = require('../middleware/auth');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email đã được sử dụng', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    gender
  });

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save();

  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Xác thực email - VHA Atelier',
      message: `
        Xin chào ${user.name},
        
        Cảm ơn bạn đã đăng ký tài khoản tại VHA Atelier!
        
        Vui lòng click vào link sau để xác thực email:
        ${verificationUrl}
        
        Link này sẽ hết hạn sau 24 giờ.
        
        Trân trọng,
        Đội ngũ VHA Atelier
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't throw error, just log it
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
    data: {
      user: user.getPublicProfile(),
      accessToken,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmail(email).select('+password');
  
  if (!user) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Tài khoản đã bị vô hiệu hóa', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      user: user.getPublicProfile(),
      accessToken,
      refreshToken
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Private
const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  res.json({
    success: true,
    message: 'Token đã được làm mới',
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('addresses')
    .select('-password');

  res.json({
    success: true,
    data: {
      user: user.getPublicProfile()
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, gender, dateOfBirth } = req.body;

  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (gender) user.gender = gender;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;

  await user.save();

  res.json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    data: {
      user: user.getPublicProfile()
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Mật khẩu hiện tại không đúng', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError('Email không tồn tại', 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send reset email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Đặt lại mật khẩu - VHA Atelier',
      message: `
        Xin chào ${user.name},
        
        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản VHA Atelier.
        
        Vui lòng click vào link sau để đặt lại mật khẩu:
        ${resetUrl}
        
        Link này sẽ hết hạn sau 10 phút.
        
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        
        Trân trọng,
        Đội ngũ VHA Atelier
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new AppError('Không thể gửi email đặt lại mật khẩu', 500);
  }

  res.json({
    success: true,
    message: 'Email đặt lại mật khẩu đã được gửi'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Đặt lại mật khẩu thành công'
  });
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid verification token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);
  }

  // Update user
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Xác thực email thành công'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError('Email không tồn tại', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email đã được xác thực', 400);
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save();

  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Xác thực email - VHA Atelier',
      message: `
        Xin chào ${user.name},
        
        Vui lòng click vào link sau để xác thực email:
        ${verificationUrl}
        
        Link này sẽ hết hạn sau 24 giờ.
        
        Trân trọng,
        Đội ngũ VHA Atelier
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new AppError('Không thể gửi email xác thực', 500);
  }

  res.json({
    success: true,
    message: 'Email xác thực đã được gửi lại'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  changePassword
};
