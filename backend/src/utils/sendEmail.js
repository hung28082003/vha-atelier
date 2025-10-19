const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"VHA Atelier" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #c67b5c, #8a9a8b); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">VHA Atelier</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 20px; border-radius: 8px;">
            ${options.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2024 VHA Atelier. Tất cả quyền được bảo lưu.
        </div>
      </div>
    `
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
