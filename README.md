# SkillSwap Hub

A modern full-stack MERN application where users can exchange skills, connect with others, send collaboration requests, and communicate through an integrated messaging system.

## Live Demo

Frontend: https://skill-swap-ten-vert.vercel.app

Backend API: https://skillswap-zrev.onrender.com

---

# Features

## Authentication & Security
- User Registration & Login
- JWT-based Authentication
- Protected Routes
- Persistent User Sessions
- Secure API Access

## Skill Feed
- Create Skill Swap Posts
- Browse Community Posts
- Skill Offered / Skill Wanted System
- Dynamic Feed
- Pagination with Load More
- Search & Filtering Support (Backend Ready)

## Requests System
- Send Skill Swap Requests
- Request Status Management
- Accept / Reject Workflow
- Request Tracking

## Messaging System
- Modern Chat Interface
- User Conversations
- Message Sending & Receiving
- Clean Responsive Chat Layout

## Dashboard
- Personalized User Dashboard
- User Posts Management
- Requests Overview
- Quick Access Navigation

## UI/UX
- Modern Dark Theme
- Glassmorphism Design
- Responsive Layout
- Animated Interactive Components
- Custom Scrollbars
- Gradient Visual Effects

---

# Tech Stack

## Frontend
- React
- React Router DOM
- Axios
- Context API
- CSS3
- Vite

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- CORS

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# Project Structure

```bash
SkillSwap/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── public/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/SkillSwap.git
cd SkillSwap
```

---

# Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run Backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend:

```bash
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/profile` | Get User Profile |

## Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get All Posts |
| POST | `/api/posts` | Create Post |
| PUT | `/api/posts/:id` | Update Post |
| DELETE | `/api/posts/:id` | Delete Post |

## Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests/:postId` | Send Request |
| GET | `/api/requests` | Get Requests |

## Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat` | Get Conversations |
| POST | `/api/chat/:id` | Send Message |

---

# Screenshots

## Home Page
Modern landing page with gradient glassmorphism design.

## Feed
Dynamic skill exchange feed with pagination and request system.

## Dashboard
Centralized dashboard for posts and requests management.

## Chat
Modern messaging interface for user communication.

---

# Future Improvements

- Real-time Messaging with Socket.IO
- Notifications System
- User Profile Editing
- Skill Search & Filters
- Mobile Optimization Enhancements
- Online User Status
- Typing Indicators
- Infinite Scrolling
- AI Skill Recommendations

---

# Learning Outcomes

This project helped in understanding:

- Full-Stack MERN Architecture
- REST API Development
- JWT Authentication
- Protected Routes
- MongoDB Data Modeling
- Frontend & Backend Integration
- Deployment Workflow
- Pagination Systems
- Modern UI Design Principles

---

# Author

Sai Teja

B.Tech CSE (AI & ML)

Passionate about Full-Stack Development, AI, and Scalable Web Applications.

---

# License

This project is built for learning, development, and portfolio purposes.

