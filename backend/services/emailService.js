import nodemailer from 'nodemailer';
import Email from '../models/Email.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
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
  }

  // Method to personalize email content with recipient's name
  personalizeContent(content, recipientName) {
    if (!recipientName) return content;
    return content.replace(/{{name}}/g, recipientName);
  }

  // Send email to a single recipient
  async sendEmail(recipient, subject, content) {
    const personalizedContent = this.personalizeContent(content, recipient.name);
    
    const mailOptions = {
      from: `"Bulk Email Sender" <${process.env.SMTP_USER}>`,
      to: recipient.email,
      subject: subject,
      html: personalizedContent
    };

    try {
      await this.transporter.verify();
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send email to ${recipient.email}:`, error);
      throw error;
    }
  }

  // Send bulk emails (one by one to each recipient)
  async sendBulkEmails(emailId) {
    try {
      const emailDoc = await Email.findById(emailId);
      if (!emailDoc) {
        throw new Error(`Email job with ID ${emailId} not found`);
      }

      // Update status to sending
      emailDoc.status = 'sending';
      await emailDoc.save();

      const { subject, content, recipients } = emailDoc;
      
      // Process each recipient individually
      for (const recipient of recipients) {
        if (recipient.status !== 'pending') continue;
        
        try {
          await this.sendEmail(recipient, subject, content);
          
          // Update recipient status
          recipient.status = 'sent';
          recipient.sentAt = new Date();
          emailDoc.sentCount += 1;
        } catch (error) {
          // Update recipient with error
          recipient.status = 'failed';
          recipient.error = error.message;
          emailDoc.failedCount += 1;
        }
        
        // Save after each email to track progress
        await emailDoc.save();
      }

      // Update completion status
      emailDoc.status = emailDoc.failedCount === 0 ? 'completed' : 'failed';
      emailDoc.completedAt = new Date();
      await emailDoc.save();

      return {
        emailId: emailDoc._id,
        status: emailDoc.status,
        sentCount: emailDoc.sentCount,
        failedCount: emailDoc.failedCount
      };
    } catch (error) {
      console.error('Bulk email sending error:', error);
      throw error;
    }
  }
}

export default new EmailService();
        