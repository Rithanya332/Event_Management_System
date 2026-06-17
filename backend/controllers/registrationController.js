const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');
const { sendRegistrationConfirmation } = require('../utils/emailService');

// @desc    Register for an event
// @route   POST /api/registrations
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId, name, email, phone, department, year, rollNumber, additionalInfo } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (event.status === 'past') return res.status(400).json({ success: false, message: 'Registration closed for past events.' });
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed.' });
    }

    // Check for duplicate
    const existing = await Registration.findOne({ event: eventId, user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'You are already registered for this event.' });

    // Check capacity
    const count = await Registration.countDocuments({ event: eventId, status: 'confirmed' });
    const status = count >= event.maxParticipants ? 'waitlisted' : 'confirmed';

    // Generate QR code
    const qrData = JSON.stringify({ userId: req.user.id, eventId, name, email });
    const qrCode = await QRCode.toDataURL(qrData);

    const registration = await Registration.create({
      event: eventId, user: req.user.id, name, email, phone, department, year, rollNumber, additionalInfo, status, qrCode,
    });

    // Add in-app notification
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        notifications: {
          message: `Successfully registered for "${event.title}"`,
          type: 'success',
        },
      },
    });

    // Send confirmation email
    if (status === 'confirmed') {
      await sendRegistrationConfirmation({
        to: email, name, eventTitle: event.title, eventDate: event.date,
        eventTime: event.time, eventLocation: event.location, qrCode,
      });
    }

    res.status(201).json({
      success: true,
      message: status === 'confirmed' ? 'Registered successfully! Confirmation email sent.' : 'Added to waitlist.',
      data: registration,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already registered for this event.' });
    next(err);
  }
};

// @desc    Get all registrations (admin)
// @route   GET /api/registrations
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email department')
      .populate('event', 'title category date')
      .sort('-registeredAt');
    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) { next(err); }
};

// @desc    Get registrations for an event (admin)
// @route   GET /api/registrations/event/:eventId
exports.getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email department year')
      .sort('-registeredAt');
    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) { next(err); }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });
    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await registration.deleteOne();
    res.status(200).json({ success: true, message: 'Registration cancelled.' });
  } catch (err) { next(err); }
};

// @desc    Mark attendance
// @route   PUT /api/registrations/:id/attend
exports.markAttendance = async (req, res, next) => {
  try {
    const reg = await Registration.findByIdAndUpdate(req.params.id, { attended: true }, { new: true });
    res.status(200).json({ success: true, message: 'Attendance marked.', data: reg });
  } catch (err) { next(err); }
};
