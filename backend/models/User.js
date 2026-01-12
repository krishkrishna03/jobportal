const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  educationLevel: { type: String }, // e.g., 'Under Graduation', 'Graduated', 'Post Graduation'
  currentYear: { type: String }, // if under grad, e.g., '1st Year', '2nd Year', etc.
  passoutYear: { type: String }, // year of graduation
  experience: { type: String }, // 'Fresher', '1-2 years', '3-5 years', etc.
  profilePicture: { type: String }, // URL/path to profile picture
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);