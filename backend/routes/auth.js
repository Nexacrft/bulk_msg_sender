import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// Email transporter with improved configuration
let transporter;

// Initialize email transporter
const initializeTransporter = () => {
  // Check if SMTP credentials are available
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials are missing. Email functionality will not work.');
    return null;
  }

  try {
    // Create transporter with proper config
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Helps with self-signed certificates
      }
    });
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
    return null;
  }
};

// Helper: Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Send OTP Email
async function sendOTPEmail(email, name, otp) {
  // Initialize transporter if not already done
  if (!transporter) {
    transporter = initializeTransporter();
  }
  
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  // Email template
  const mailOptions = {
    from: `"Bulk Email Sender" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your email - Bulk Email Sender',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .header { text-align: center; padding: 10px; background: linear-gradient(to right, #4F46E5, #EC4899); border-radius: 5px; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 20px 0; }
          .otp-container { text-align: center; margin: 30px 0; }
          .otp { font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #4F46E5; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with Bulk Email Sender. To complete your registration, please verify your email with the OTP below:</p>
            
            <div class="otp-container">
              <div class="otp">${otp}</div>
            </div>
            
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2023 Bulk Email Sender. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    // Verify SMTP connection before sending
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user with plaintext password (will be hashed by pre-save hook)
    user = new User({ 
      name, 
      email, 
      password, 
      otp, 
      otpExpires 
    });
    
    await user.save();

    // Send OTP email with better error handling
    let emailSent = false;
    try {
      await sendOTPEmail(email, name, otp);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // We'll continue with registration but inform the user about the email issue
    }

    res.status(201).json({ 
      success: true, 
      message: emailSent ? 
        'Registration successful! Please check your email for OTP verification.' : 
        'Registration successful but we could not send the verification email. Please contact support.',
      email,
      emailSent
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    // Update user to verified status and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully! You can now log in.' 
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during verification', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Email not verified. Please verify your email before logging in.',
        requiresVerification: true,
        email: email
      });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    
    // Send new OTP email with better error handling
    let emailSent = false;
    try {
      await sendOTPEmail(email, user.name, otp);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send new OTP email:', emailError);
    }
    
    res.status(200).json({ 
      success: true, 
      message: emailSent ? 
        'New OTP sent successfully!' : 
        'Could not send the new OTP email. Please contact support.',
      emailSent
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error when resending OTP', error: err.message });
  }
});

export default router;
