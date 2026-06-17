const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  date: { type: Date, required: [true, 'Event date is required'] },
  endDate: { type: Date },
  time: { type: String, required: [true, 'Event time is required'] },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  maxParticipants: { type: Number, default: 100 },
  registrationDeadline: { type: Date },
  image: { type: String, default: '' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past', 'cancelled'],
    default: 'upcoming',
  },
  isFeatured: { type: Boolean, default: false },
  feedback: [feedbackSchema],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual: registrationCount
eventSchema.virtual('registrationCount', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  count: true,
});

// Auto-update status based on date
eventSchema.pre('save', function (next) {
  const now = new Date();
  if (this.date > now) this.status = 'upcoming';
  else if (this.endDate && this.endDate > now) this.status = 'ongoing';
  else this.status = 'past';
  next();
});

// Calculate average rating
eventSchema.methods.calculateAverageRating = function () {
  if (this.feedback.length === 0) { this.averageRating = 0; return; }
  const sum = this.feedback.reduce((acc, f) => acc + f.rating, 0);
  this.averageRating = Math.round((sum / this.feedback.length) * 10) / 10;
};

module.exports = mongoose.model('Event', eventSchema);
