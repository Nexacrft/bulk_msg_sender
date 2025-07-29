// controllers/emailController.js
import Email from '../models/Email.js';
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
    // Get the authenticated user from the request
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    const { subject, content, recipients } = req.body;
    
    // Validate request
    if (!subject || !content || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subject, content, and recipients are required' 
      });
    }

    // Create an email record in the database
    const emailRecord = new Email({
      subject,
      content,
      recipients: recipients.map(r => ({
        email: r.email.toLowerCase().trim(),
        name: r.name ? r.name.trim() : '',
        status: 'pending'
      })),
      totalRecipients: recipients.length,
      status: 'sending',
      createdBy: user.email
    });

    // Save the initial record
    await emailRecord.save();

    // Create transporter
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    
    // Track results
    let successCount = 0;
    let failureCount = 0;
    
    // Send emails individually to each recipient
    for (const recipient of emailRecord.recipients) {
      try {
        // Skip invalid emails
        if (!recipient.email) {
          recipient.status = 'failed';
          recipient.error = 'Invalid email address';
          failureCount++;
          continue;
        }
        
        // Personalize content
        let personalizedContent = content;
        if (recipient.name) {
          personalizedContent = content.replace(/{{name}}/g, recipient.name);
        } else {
          personalizedContent = content.replace(/{{name}}/g, 'there');
        }
        
        // Send email - use the authenticated user's name in the from field
        const mailOptions = {
          from: `"${user.name}" <${process.env.SMTP_USER}>`,
          replyTo: user.email, // Set reply-to as the user's email
          to: recipient.email,
          subject: subject,
          html: personalizedContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        // Update recipient status in database
        recipient.status = 'sent';
        recipient.sentAt = new Date();
        successCount++;
        
        console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
      } catch (error) {
        // Update recipient with error in database
        recipient.status = 'failed';
        recipient.error = error.message;
        failureCount++;
        console.error(`Failed to send to ${recipient.email}:`, error);
      }
      
      // Save progress periodically (every few recipients to avoid excessive DB writes)
      if ((successCount + failureCount) % 5 === 0 || 
          (successCount + failureCount) === emailRecord.recipients.length) {
        emailRecord.sentCount = successCount;
        emailRecord.failedCount = failureCount;
        await emailRecord.save();
      }
    }
    
    // Update final email record status
    emailRecord.status = failureCount === 0 ? 'completed' : 
                         (successCount > 0 ? 'partial' : 'failed');
    emailRecord.completedAt = new Date();
    emailRecord.sentCount = successCount;
    emailRecord.failedCount = failureCount;
    
    await emailRecord.save();
    
    // Return response
    return res.status(200).json({
      success: true,
      message: `Sent ${successCount} emails successfully, ${failureCount} failed`,
      emailId: emailRecord._id,
      sender: user.email,
      successCount,
      failureCount
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to process bulk email request: ${error.message}`
    });
  }
};

// Get email history for a user
export const getEmailHistory = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const emails = await Email.find({ createdBy: user.email })
      .sort({ createdAt: -1 })
      .select('subject totalRecipients sentCount failedCount status createdAt');
    
    return res.status(200).json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Error fetching email history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch email history'
    });
  }
};

// Get email details by ID
export const getEmailDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const email = await Email.findById(id);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email record not found'
      });
    }
    
    // Check if user has permission
    if (email.createdBy !== user.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    return res.status(200).json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Error fetching email details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch email details'
    });
  }
};
