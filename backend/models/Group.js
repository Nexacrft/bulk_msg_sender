import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

// Schema for email history
const emailHistorySchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  recipientTypes: {
    to: [String],
    cc: [String],
    bcc: [String]
  },
  totalRecipients: {
    type: Number,
    default: 0
  },
  sentBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'partial', 'failed'],
    default: 'success'
  },
  messageId: String,
  error: String,
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: {
    type: [memberSchema],
    required: true,
    validate: {
      validator: function(members) {
        return members.length > 0;
      },
      message: 'Group must have at least one member'
    }
  },
  createdBy: {
    type: String,
    required: true
  },
  emailHistory: [emailHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness of name per creator
groupSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;