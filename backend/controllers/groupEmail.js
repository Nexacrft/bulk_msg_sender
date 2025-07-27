import Group from '../models/Group.js';
import createTransporter from '../config/emailConfig.js';

export const createGroup = async (req, res) => {
  try {
    const { name, emails } = req.body;

    if (!name || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: 'Group name and emails are required' });
    }

    // Check if group with the same name already exists
    const existingGroup = await Group.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'A group with this name already exists' });
    }

    const group = new Group({
      name,
      members: emails.map(e => ({
        email: e.email.toLowerCase().trim(),
        name: e.name ? e.name.trim() : ''
      }))
    });

    await group.save();
    res.status(201).json({ success: true, group });
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error('Get groups error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendGroupEmail = async (req, res) => {
  try {
    const { groupName, subject, content, to = [], cc = [], bcc = [], mode } = req.body;
    if (!groupName || !subject || !content) {
      return res.status(400).json({ success: false, message: 'Group name, subject, and content are required' });
    }

    const group = await Group.findOne({ name: { $regex: `^${groupName}$`, $options: 'i' } });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // For backward compatibility, handle the old 'mode' parameter
    let toList = [...to];
    let ccList = [...cc]; 
    let bccList = [...bcc];

    // If the new format isn't used but old 'mode' is provided, convert to new format
    if (mode && (toList.length === 0 && ccList.length === 0 && bccList.length === 0)) {
      const allMembers = group.members.map(m => m.email);
      
      if (mode === 'to') {
        toList = allMembers;
      } else if (mode === 'cc') {
        ccList = allMembers;
      } else if (mode === 'bcc') {
        bccList = allMembers;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid mode. Use to, cc, or bcc.' });
      }
    }

    // Validate that we have at least one recipient
    const totalRecipients = toList.length + ccList.length + bccList.length;
    if (totalRecipients === 0) {
      return res.status(400).json({ success: false, message: 'No recipients specified' });
    }

    try {
      const transporter = createTransporter();

      // Get a list of all valid emails from the group
      const validGroupEmails = new Set(group.members.map(m => m.email.toLowerCase()));
      
      // Filter recipient lists to only include valid emails from the group
      const validToList = toList.filter(email => validGroupEmails.has(email.toLowerCase()));
      const validCcList = ccList.filter(email => validGroupEmails.has(email.toLowerCase()));
      const validBccList = bccList.filter(email => validGroupEmails.has(email.toLowerCase()));

      const mailOptions = {
        from: `${process.env.SMTP_USER}`,
        subject,
        html: content
      };

      // Add recipients based on our lists
      if (validToList.length > 0) {
        mailOptions.to = validToList;
      } else {
        // If no TO recipients, send to self
        mailOptions.to = process.env.SMTP_USER;
      }

      if (validCcList.length > 0) {
        mailOptions.cc = validCcList;
      }

      if (validBccList.length > 0) {
        mailOptions.bcc = validBccList;
      }

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: `Email sent successfully to ${validToList.length + validCcList.length + validBccList.length} recipients`,
        recipientCount: validToList.length + validCcList.length + validBccList.length,
        toCount: validToList.length,
        ccCount: validCcList.length,
        bccCount: validBccList.length
      });
    } catch (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
    }
  } catch (err) {
    console.error('Send group email error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
