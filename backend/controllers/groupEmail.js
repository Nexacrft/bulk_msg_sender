import Group from '../models/Group.js';
import createTransporter from '../config/emailConfig.js';

export const createGroup = async (req, res) => {
  try {
    const { name, emails } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!name || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Group name and emails are required' 
      });
    }

    // Check if group with the same name already exists
    const existingGroup = await Group.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' },
      createdBy: user.email
    });
    
    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: 'A group with this name already exists' 
      });
    }

    const group = new Group({
      name,
      members: emails.map(e => ({
        email: e.email.toLowerCase().trim(),
        name: e.name ? e.name.trim() : ''
      })),
      createdBy: user.email
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
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Only return groups created by the current user
    // Using email might be problematic if the user's email is not stored in createdBy
    // Check if createdBy is stored as user ID or email
    const groups = await Group.find({ createdBy: user.email }).sort({ createdAt: -1 });
    
    // Debug logging
    console.log("User:", user);
    console.log("Found groups:", groups);
    
    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error('Get groups error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendGroupEmail = async (req, res) => {
  try {
    const { groupName, subject, content, to = [], cc = [], bcc = [], mode } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!groupName || !subject || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Group name, subject, and content are required' 
      });
    }

    // Find the group using case-insensitive regex for name
    const group = await Group.findOne({ 
      name: { $regex: `^${groupName}$`, $options: 'i' },
      createdBy: user.email
    });

    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
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
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid mode. Use to, cc, or bcc.' 
        });
      }
    }

    // Validate that we have at least one recipient
    const totalRecipients = toList.length + ccList.length + bccList.length;
    if (totalRecipients === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No recipients specified' 
      });
    }

    const transporter = createTransporter();
    // Make sure transporter is available
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: 'Email service configuration error'
      });
    }

    // Get a list of all valid emails from the group
    const validGroupEmails = new Set(group.members.map(m => m.email.toLowerCase()));
    
    // Filter recipient lists to only include valid emails from the group
    const validToList = toList.filter(email => validGroupEmails.has(email.toLowerCase()));
    const validCcList = ccList.filter(email => validGroupEmails.has(email.toLowerCase()));
    const validBccList = bccList.filter(email => validGroupEmails.has(email.toLowerCase()));

    // Prepare email
    const mailOptions = {
      from: `"${user.name}" <${process.env.SMTP_USER}>`,
      replyTo: user.email,
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

    try {
      // Send email
      console.log('Sending group email with options:', mailOptions);
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully with messageId:', result.messageId);

      // Create history entry object
      const historyEntry = {
        subject,
        content,
        recipientTypes: {
          to: validToList,
          cc: validCcList,
          bcc: validBccList
        },
        totalRecipients: validToList.length + validCcList.length + validBccList.length,
        sentBy: user.email,
        status: 'success',
        messageId: result.messageId,
        sentAt: new Date()
      };

      // Initialize emailHistory array if it doesn't exist
      if (!group.emailHistory) {
        group.emailHistory = [];
      }

      // Add history to group
      group.emailHistory.push(historyEntry);

      // Save the group with updated history
      await group.save();
      console.log('Email history saved to group document');

      // Return success response
      res.status(200).json({
        success: true,
        message: `Email sent successfully to group: ${group.name}`,
        recipientCount: validToList.length + validCcList.length + validBccList.length,
        toCount: validToList.length,
        ccCount: validCcList.length,
        bccCount: validBccList.length
      });
    } catch (error) {
      console.error('Email sending error:', error);

      // Create failed history entry
      const failedHistoryEntry = {
        subject,
        content,
        recipientTypes: {
          to: toList,
          cc: ccList,
          bcc: bccList
        },
        totalRecipients: toList.length + ccList.length + bccList.length,
        sentBy: user.email,
        status: 'failed',
        error: error.message,
        sentAt: new Date()
      };

      // Initialize emailHistory array if it doesn't exist
      if (!group.emailHistory) {
        group.emailHistory = [];
      }

      // Add failed history to group
      group.emailHistory.push(failedHistoryEntry);

      // Save the group with updated history
      await group.save();
      console.log('Failed email history saved to group document');

      return res.status(500).json({
        success: false,
        message: `Failed to send email: ${error.message}`
      });
    }
  } catch (err) {
    console.error('Send group email error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get email history for a specific group
export const getGroupEmailHistory = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    console.log('Fetching history for group:', groupId);
    
    const group = await Group.findOne({
      _id: groupId,
      createdBy: user.email
    });
    
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    
    const history = group.emailHistory || [];
    console.log(`Found ${history.length} email records for group ${group.name}`);
    
    res.status(200).json({
      success: true,
      groupName: group.name,
      history: history
    });
  } catch (err) {
    console.error('Get group email history error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Add endpoint to get all email history across all groups
export const getAllGroupEmailHistory = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Get all groups created by this user
    const groups = await Group.find({ 
      createdBy: user.email 
    });
    
    // Collect all email history from these groups
    const history = [];
    for (const group of groups) {
      if (group.emailHistory && group.emailHistory.length > 0) {
        // Add group name to each history item
        const groupHistory = group.emailHistory.map(item => ({
          ...item,
          groupName: group.name, // Add group name for reference
          groupId: group._id
        }));
        
        history.push(...groupHistory);
      }
    }
    
    // Sort by sentAt date (newest first)
    history.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    res.status(200).json({ 
      success: true, 
      history 
    });
  } catch (err) {
    console.error('Get all group email history error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};
