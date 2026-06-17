const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers, getUserById, updateProfile, changePassword,
  getUserRegistrations, getNotifications, markNotificationRead, deleteUser,
} = require('../controllers/userController');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateProfile);
router.put('/:id/change-password', protect, changePassword);
router.get('/:id/registrations', protect, getUserRegistrations);
router.get('/:id/notifications', protect, getNotifications);
router.put('/:id/notifications/:notifId', protect, markNotificationRead);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
