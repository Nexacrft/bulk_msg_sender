import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [
    {
      email: { type: String, required: true, lowercase: true, trim: true },
      name: { type: String, trim: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Group = mongoose.model('Group', groupSchema);
export default Group;