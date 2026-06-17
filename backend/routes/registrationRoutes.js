const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  registerForEvent, getAllRegistrations, getEventRegistrations,
  cancelRegistration, markAttendance,
} = require('../controllers/registrationController');

router.post('/', protect, registerForEvent);
router.get('/', protect, authorize('admin'), getAllRegistrations);
router.get('/event/:eventId', protect, authorize('admin'), getEventRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.put('/:id/attend', protect, authorize('admin'), markAttendance);

module.exports = router;
