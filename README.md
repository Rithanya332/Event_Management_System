# 🎓 College Event Management System (MERN Stack)

A full-stack web application for managing college events, built with MongoDB, Express.js, React.js, and Node.js.

---

## 📁 Project Structure

```
college-event-management/
├── backend/                    # Node.js + Express.js API
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Business logic (MVC)
│   ├── middleware/             # Auth, error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # REST API routes
│   ├── utils/emailService.js   # Nodemailer email
│   ├── server.js               # Entry point
│   └── .env.example            # Environment variables template
└── frontend/                   # React.js + Vite + Tailwind CSS
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── context/            # React Context (Auth)
    │   ├── pages/              # Page components
    │   │   ├── admin/          # Admin-only pages
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EventDetails.jsx
    │   │   ├── EventRegistration.jsx
    │   │   ├── Profile.jsx
    │   │   └── Notifications.jsx
    │   └── services/api.js     # Axios API calls
    └── index.html
```

---

## ⚙️ Prerequisites

- Node.js v18+ and npm
- MongoDB Atlas account (free tier works)
- Gmail account for email notifications (app password required)

---

## 🚀 Setup & Installation

### Step 1: Clone / Extract the project

```bash
cd college-event-management
```

### Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_events
JWT_SECRET=your_super_secret_key_minimum_32_chars
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=College Events <your_gmail@gmail.com>
CLIENT_URL=http://localhost:5173
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

### Step 3: Setup Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Seed Demo Data (Optional)

```bash
cd backend
node seed.js
```

This creates:
- Admin: `admin@college.edu` / `admin123`
- Student: `student@college.edu` / `student123`
- 6 sample events

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all events (with filters) |
| GET | /api/events/:id | Get single event |
| POST | /api/events | Create event (admin) |
| PUT | /api/events/:id | Update event (admin) |
| DELETE | /api/events/:id | Delete event (admin) |
| POST | /api/events/:id/feedback | Add rating/feedback |
| GET | /api/events/stats | Admin dashboard stats |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/registrations | Register for event |
| GET | /api/registrations | All registrations (admin) |
| GET | /api/registrations/event/:id | Event registrations (admin) |
| DELETE | /api/registrations/:id | Cancel registration |
| PUT | /api/registrations/:id/attend | Mark attendance |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | All users (admin) |
| GET | /api/users/:id | Get user |
| PUT | /api/users/:id | Update profile |
| PUT | /api/users/:id/change-password | Change password |
| GET | /api/users/:id/registrations | User's event history |
| GET | /api/users/:id/notifications | Get notifications |

---

## 🚢 Deployment

### Backend (Railway / Render)
1. Push backend to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Set `VITE_API_URL` to your backend URL
3. Deploy `dist/` folder

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| State | React Context API |
| HTTP | Axios |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (SMTP) |
| QR Code | qrcode |
| Scheduler | node-cron |

---

## ✨ Features

- ✅ JWT Authentication with role-based access (Student / Admin)
- ✅ Event CRUD with categories, filtering, and search
- ✅ Real-time capacity tracking
- ✅ Email confirmation on registration (Nodemailer)
- ✅ Daily reminder emails via cron job
- ✅ QR code generation for event entry
- ✅ Event rating & feedback system
- ✅ Admin dashboard with charts (Recharts)
- ✅ In-app notifications
- ✅ Responsive design (mobile + desktop)
- ✅ Duplicate registration prevention
- ✅ Waitlist management

---

## 📄 License

MIT License — Free to use and modify.
