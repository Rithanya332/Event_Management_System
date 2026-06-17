const nodemailer = require('nodemailer');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// Registration confirmation email
exports.sendRegistrationConfirmation = async ({ to, name, eventTitle, eventDate, eventTime, eventLocation, qrCode }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'College Events <noreply@college.edu>',
      to,
      subject: `✅ Registration Confirmed - ${eventTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:10px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;">🎓 College Event Management</h1>
          </div>
          <div style="padding:30px;background:#fff;">
            <h2 style="color:#333;">Hello, ${name}! 🎉</h2>
            <p style="color:#555;font-size:16px;">Your registration has been <strong style="color:#27ae60;">confirmed</strong> for the following event:</p>
            <div style="background:#f0f4ff;border-left:4px solid #667eea;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#667eea;margin:0 0 10px;">${eventTitle}</h3>
              <p style="margin:5px 0;color:#555;">📅 <strong>Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
              <p style="margin:5px 0;color:#555;">⏰ <strong>Time:</strong> ${eventTime}</p>
              <p style="margin:5px 0;color:#555;">📍 <strong>Location:</strong> ${eventLocation}</p>
            </div>
            ${qrCode ? `<div style="text-align:center;margin:20px 0;"><p style="color:#555;">Your Entry QR Code:</p><img src="${qrCode}" alt="QR Code" style="width:200px;height:200px;" /></div>` : ''}
            <p style="color:#555;">Please bring this confirmation email on the day of the event.</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.CLIENT_URL}/dashboard" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 30px;text-decoration:none;border-radius:25px;font-weight:bold;">View My Events</a>
            </div>
          </div>
          <div style="background:#f0f0f0;padding:15px;text-align:center;color:#999;font-size:12px;">
            <p>© 2024 College Event Management System. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

// Event reminder emails (runs via cron)
exports.sendEventReminders = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const events = await Event.find({
      date: { $gte: tomorrow, $lt: dayAfter },
      status: 'upcoming',
    });

    const transporter = createTransporter();
    for (const event of events) {
      const registrations = await Registration.find({ event: event._id, status: 'confirmed' }).populate('user', 'name email');
      for (const reg of registrations) {
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: reg.user.email,
          subject: `⏰ Reminder: ${event.title} is Tomorrow!`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#f093fb,#f5576c);padding:25px;text-align:center;border-radius:10px 10px 0 0;">
                <h1 style="color:#fff;margin:0;">⏰ Event Reminder</h1>
              </div>
              <div style="padding:25px;background:#fff;border-radius:0 0 10px 10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h2>Hi ${reg.user.name},</h2>
                <p>This is a reminder that <strong>${event.title}</strong> is happening <strong>tomorrow!</strong></p>
                <p>📅 Date: ${new Date(event.date).toLocaleDateString()}</p>
                <p>⏰ Time: ${event.time}</p>
                <p>📍 Location: ${event.location}</p>
                <p>We look forward to seeing you there!</p>
              </div>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
      }
    }
    console.log(`Reminders sent for ${events.length} events.`);
  } catch (error) {
    console.error('Reminder job error:', error.message);
  }
};

// General notification email
exports.sendNotificationEmail = async ({ to, subject, message }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>${subject}</h2><p>${message}</p></div>`,
    });
  } catch (err) {
    console.error('Notification email error:', err.message);
  }
};
