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

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;