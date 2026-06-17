const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Clear existing
  await User.deleteMany({});
  await Event.deleteMany({});

  // Create admin
  const admin = await User.create({ name: 'Admin User', email: 'admin@college.edu', password: 'admin123', role: 'admin', department: 'Administration' });
  console.log('Admin created:', admin.email);

  // Create student
  await User.create({ name: 'John Student', email: 'student@college.edu', password: 'student123', role: 'student', department: 'Computer Science', year: '3rd Year' });
  console.log('Student created: student@college.edu');

  // Create events
  const now = new Date();
  const events = [
    { title: 'Annual Tech Symposium 2024', category: 'Technical', description: 'A premier technical event featuring workshops, hackathons, and guest lectures from industry experts. Participate in coding challenges and win exciting prizes!', date: new Date(now.getTime() + 7 * 86400000), time: '09:00 AM', location: 'Main Auditorium, Block A', maxParticipants: 200, organizer: admin._id, isFeatured: true, tags: ['hackathon', 'coding', 'AI'] },
    { title: 'Cultural Night 2024', category: 'Cultural', description: 'Celebrate diversity through music, dance, and art. An evening of performances by students from all departments. Food stalls and cultural exhibits.', date: new Date(now.getTime() + 14 * 86400000), time: '06:00 PM', location: 'Open Air Theatre', maxParticipants: 500, organizer: admin._id, tags: ['music', 'dance', 'food'] },
    { title: 'Inter-College Football Tournament', category: 'Sports', description: 'Annual football tournament with teams from 10+ colleges. Group stages, knock-out rounds, and grand finale. Register your team now!', date: new Date(now.getTime() + 3 * 86400000), time: '08:00 AM', location: 'College Football Ground', maxParticipants: 150, organizer: admin._id, tags: ['football', 'sports', 'tournament'] },
    { title: 'Machine Learning Workshop', category: 'Workshop', description: 'Hands-on 2-day workshop on Machine Learning and Deep Learning. Topics include regression, classification, neural networks, and practical projects using Python.', date: new Date(now.getTime() + 10 * 86400000), time: '10:00 AM', location: 'Computer Lab 3, Block C', maxParticipants: 40, organizer: admin._id, tags: ['ML', 'Python', 'AI', 'data science'] },
    { title: 'Industry Expert Seminar', category: 'Seminar', description: 'Learn from industry professionals about the latest trends in software development, career guidance, and interview preparation tips.', date: new Date(now.getTime() - 2 * 86400000), time: '02:00 PM', location: 'Seminar Hall 1', maxParticipants: 100, organizer: admin._id },
    { title: 'Research Paper Presentation', category: 'Academic', description: 'Present your research papers to a panel of professors and industry experts. Best papers will be published in the college journal.', date: new Date(now.getTime() + 21 * 86400000), time: '09:30 AM', location: 'Conference Room, Admin Block', maxParticipants: 60, organizer: admin._id, tags: ['research', 'academic'] },
  ];

  await Event.insertMany(events);
  console.log(`${events.length} events created`);

  console.log('\n✅ Seed completed successfully!');
  console.log('Admin: admin@college.edu / admin123');
  console.log('Student: student@college.edu / student123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
