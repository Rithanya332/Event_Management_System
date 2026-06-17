const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const { sendNotificationEmail } = require('../utils/emailService');

// Send broadcast notification (admin)
router.post('/broadcast', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { message, type, emailSubject, emailMessage, sendEmail } = req.body;
    const users = await User.find({ role: 'student' });

    await User.updateMany(
      { role: 'student' },
      { $push: { notifications: { message, type: type || 'info' } } }
    );

    if (sendEmail) {
      for (const user of users) {
        await sendNotificationEmail({ to: user.email, subject: emailSubject || 'College Events Notification', message: emailMessage || message });
      }
    }

    res.status(200).json({ success: true, message: `Notification sent to ${users.length} users.` });
  } catch (err) { next(err); }
});

module.exports = router;
