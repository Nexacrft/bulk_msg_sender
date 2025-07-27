// controllers/emailController.js
import Email from '../models/Email.js';
import EmailService from '../services/emailService.js';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendBulkEmail = async (req, res) => {
  try {
    const { subject, content, recipients } = req.body;
    
    // Validate request
    if (!subject || !content || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subject, content, and recipients are required' 
      });
    }

    // Create transporter
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    
    // Track results
    const results = {
      success: [],
      failure: []
    };
    
    // Send emails individually to each recipient
    for (const recipient of recipients) {
      try {
        // Skip invalid emails
        if (!recipient.email) continue;
        
        // Personalize content
        let personalizedContent = content;
        if (recipient.name) {
          personalizedContent = content.replace(/{{name}}/g, recipient.name);
        } else {
          personalizedContent = content.replace(/{{name}}/g, 'there');
        }
        
        // Send email
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: recipient.email,
          subject: subject,
          html: personalizedContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        // Track success
        results.success.push({
          email: recipient.email,
          messageId: info.messageId
        });
        
        console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
      } catch (error) {
        // Track failure
        results.failure.push({
          email: recipient.email,
          error: error.message
        });
        console.error(`Failed to send to ${recipient.email}:`, error);
      }
    }
    
    // Return response
    return res.status(200).json({
      success: true,
      message: `Sent ${results.success.length} emails successfully, ${results.failure.length} failed`,
      successCount: results.success.length,
      failureCount: results.failure.length,
      details: results
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to process bulk email request: ${error.message}`
    });
  }
};
