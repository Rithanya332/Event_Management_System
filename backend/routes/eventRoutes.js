const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getEvents, getEvent, createEvent, updateEvent, deleteEvent, addFeedback, getDashboardStats,
} = require('../controllers/eventController');

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.post('/:id/feedback', protect, addFeedback);

module.exports = router;
