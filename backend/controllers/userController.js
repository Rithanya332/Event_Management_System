const User = require('../models/User');
const Registration = require('../models/Registration');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department, year, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, department, year, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Profile updated!', data: user });
  } catch (err) { next(err); }
};

// @desc    Change password
// @route   PUT /api/users/:id/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};

// @desc    Get user registration history
// @route   GET /api/users/:id/registrations
exports.getUserRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.params.id })
      .populate('event', 'title category date time location status image')
      .sort('-registeredAt');
    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) { next(err); }
};

// @desc    Get notifications
// @route   GET /api/users/:id/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('notifications');
    res.status(200).json({ success: true, data: user.notifications.reverse() });
  } catch (err) { next(err); }
};

// @desc    Mark notification as read
// @route   PUT /api/users/:id/notifications/:notifId
exports.markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const notif = user.notifications.id(req.params.notifId);
    if (notif) { notif.read = true; await user.save(); }
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (err) { next(err); }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
};
