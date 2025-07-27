import nodemailer from 'nodemailer';

/**
 * Creates and returns a configured nodemailer transporter
 * @returns {nodemailer.Transporter} - Configured email transporter
 */
const createTransporter = () => {
  // Check for required env variables
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS environment variables are required');
  }
  
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
};

export default createTransporter;
