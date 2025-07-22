// controllers/emailController.js
import Email from '../models/Email.js';
import EmailService from '../services/emailService.js';

export const sendBulkEmail = async (req, res) => {
  try {
    let emailDoc;

    // support for optional emailId, or treat as "new"
    const { emailId, subject, content, recipients } = req.body;

    if (emailId) {
      emailDoc = await Email.findById(emailId);
      if (!emailDoc) {
        return res.status(404).json({ success: false, message: 'Email job not found for this ID.' });
      }
    } else {
      // Validation
      if (!subject || !content || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({success: false, message: 'Subject, content, and non-empty recipients array required.'});
      }

      // Remove duplicates, sanitize
      const recList = [];
      const seen = new Set();
      for(const r of recipients) {
        if (typeof r.email === 'string' && !seen.has(r.email.toLowerCase().trim())) {
          seen.add(r.email.toLowerCase().trim());
          recList.push({ email: r.email.toLowerCase().trim(), name: (r.name || '').trim(), status: 'pending' });
        }
      }

      emailDoc = new Email({
        subject,
        content,
        recipients: recList,
        status: 'draft'
      });
      await emailDoc.save();
    }

    // Now process sending as async (do not block API)
    EmailService.sendBulkEmails(emailDoc._id)
      .then(result => console.log('Sending completed:', result))
      .catch(error => console.error('Async sending error:', error));

    res.json({
      success: true,
      message: emailId ? "Re-processing queued" : "New email job created and sending started",
      emailId: emailDoc._id,
      totalRecipients: emailDoc.totalRecipients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
