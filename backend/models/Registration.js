const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  rollNumber: { type: String },
  additionalInfo: { type: String, maxlength: 500 },
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed',
  },
  qrCode: { type: String },
  attended: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
