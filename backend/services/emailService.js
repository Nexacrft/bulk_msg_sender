import createTransporter from '../config/emailConfig.js';
import Email from '../models/Email.js'; // Your schema file

class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }

  // Send single email
  async sendSingleEmail(recipient, subject, content) {
    try {
      const personalizedContent = content.replace(/{{name}}/g, recipient.name || 'Valued Customer');
      
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: recipient.email,
        subject: subject,
        html: personalizedContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Process email batch
  async sendBulkEmails(emailId) {
    try {
      // Fetch email document
      const emailDocument = await Email.findById(emailId);
      if (!emailDocument) {
        throw new Error('Email document not found');
      }

      // Update status to sending
      emailDocument.status = 'sending';
      await emailDocument.save();

      // Process each recipient individually
      for (let i = 0; i < emailDocument.recipients.length; i++) {
        const recipient = emailDocument.recipients[i];
        
        // Skip if already processed
        if (recipient.status !== 'pending') {
          continue;
        }

        const result = await this.sendSingleEmail(
          recipient, 
          emailDocument.subject, 
          emailDocument.content
        );

        // Update recipient status
        if (result.success) {
          emailDocument.recipients[i].status = 'sent';
          emailDocument.recipients[i].sentAt = new Date();
          emailDocument.recipients[i].error = undefined;
        } else {
          emailDocument.recipients[i].status = 'failed';
          emailDocument.recipients[i].error = result.error;
        }

        // Save progress after each email
        await emailDocument.save();

        // Add small delay to avoid rate limiting
        await this.delay(100);
      }

      // Determine final status
      const hasFailures = emailDocument.recipients.some(r => r.status === 'failed');
      const allSent = emailDocument.recipients.every(r => r.status === 'sent');
      
      if (allSent) {
        emailDocument.status = 'completed';
      } else if (hasFailures) {
        emailDocument.status = 'failed';
      } else {
        emailDocument.status = 'completed';
      }

      await emailDocument.save();

      return {
        success: true,
        status: emailDocument.status,
        sentCount: emailDocument.sentCount,
        failedCount: emailDocument.failedCount,
        totalRecipients: emailDocument.totalRecipients
      };

    } catch (error) {
      // Update email status to failed
      if (emailId) {
        await Email.findByIdAndUpdate(emailId, { status: 'failed' });
      }
      throw error;
    }
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EmailService();
