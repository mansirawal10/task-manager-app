import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' }, // Role field added

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
