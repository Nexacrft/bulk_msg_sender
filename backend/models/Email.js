import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  recipients: [{
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    sentAt: {
      type: Date
    },
    error: {
      type: String
    }
  }],
  totalRecipients: {
    type: Number,
    default: 0
  },
  sentCount: {
    type: Number,
    default: 0
  },
  failedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sending', 'completed', 'failed'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Update counts before saving
emailSchema.pre('save', function() {
  this.totalRecipients = this.recipients.length;
  this.sentCount = this.recipients.filter(r => r.status === 'sent').length;
  this.failedCount = this.recipients.filter(r => r.status === 'failed').length;
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
