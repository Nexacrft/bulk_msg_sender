import Group from '../models/Group.js';
import createTransporter from '../config/emailConfig.js';

export const createGroup = async (req, res) => {
  try {
    const { name, emails } = req.body;

    if (!name || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: 'Group name and emails are required' });
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
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendGroupEmail = async (req, res) => {
  try {
    const { groupName, subject, content, mode } = req.body; // mode: 'cc' or 'bcc'
    if (!groupName || !subject || !content) {
      return res.status(400).json({ success: false, message: 'Group name, subject, and content are required' });
    }

    if (mode && !['cc', 'bcc'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Invalid mode. Use cc or bcc.' });
    }

    const group = await Group.findOne({ name: { $regex: `^${groupName}$`, $options: 'i' } });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const recipientEmails = group.members.map(m => m.email);

    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: mode === 'cc' ? process.env.FROM_EMAIL : undefined,
      cc: mode === 'cc' ? recipientEmails : undefined,
      bcc: mode === 'bcc' ? recipientEmails : undefined,
      subject,
      html: content
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `Emails sent to group: ${group.name} (${mode || 'cc'})`,
      recipientCount: recipientEmails.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
