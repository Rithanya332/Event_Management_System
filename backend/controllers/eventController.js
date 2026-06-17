const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events (with filtering/search)
// @route   GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    const { category, status, search, date, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      query.date = { $gte: d, $lt: new Date(d.setDate(d.getDate() + 1)) };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Auto-update status
    await Event.updateMany({ date: { $gt: new Date() } }, { status: 'upcoming' });
    await Event.updateMany({ date: { $lte: new Date() }, endDate: { $gte: new Date() } }, { status: 'ongoing' });
    await Event.updateMany(
      { $or: [{ endDate: { $lt: new Date() } }, { date: { $lt: new Date() }, endDate: { $exists: false } }] },
      { status: 'past' }
    );

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('registrationCount')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: events,
    });
  } catch (err) { next(err); }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('feedback.user', 'name avatar')
      .populate('registrationCount');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.status(200).json({ success: true, data: event });
  } catch (err) { next(err); }
};

// @desc    Create event (admin)
// @route   POST /api/events
exports.createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: 'Event created successfully!', data: event });
  } catch (err) { next(err); }
};

// @desc    Update event (admin)
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Event updated!', data: event });
  } catch (err) { next(err); }
};

// @desc    Delete event (admin)
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    await Registration.deleteMany({ event: req.params.id });
    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) { next(err); }
};

// @desc    Add feedback/rating to event
// @route   POST /api/events/:id/feedback
exports.addFeedback = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const alreadyReviewed = event.feedback.find(f => f.user.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already submitted feedback.' });

    event.feedback.push({ user: req.user.id, rating: req.body.rating, comment: req.body.comment });
    event.calculateAverageRating();
    await event.save();
    res.status(200).json({ success: true, message: 'Feedback submitted!', data: event });
  } catch (err) { next(err); }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/events/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const pastEvents = await Event.countDocuments({ status: 'past' });
    const totalRegistrations = await Registration.countDocuments();

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentRegistrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort('-registeredAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: { totalEvents, upcomingEvents, ongoingEvents, pastEvents, totalRegistrations, eventsByCategory, recentRegistrations },
    });
  } catch (err) { next(err); }
};
