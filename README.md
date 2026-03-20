# MediQueue – Smart Hospital Token System

A production-ready Hospital OPD Token/Ticket Generator built with the MERN Stack, featuring beast-level 3D animations and deep Framer Motion parallax effects.

![MediQueue](https://img.shields.io/badge/MediQueue-Smart_Hospital_Token_System-06b6d4?style=for-the-badge)

## 🎯 Features

- **Real-time Queue Management** — Live token tracking with Socket.IO
- **3D Animated Interface** — Three.js background with floating spheres, DNA helix, and particle field
- **Deep Parallax Effects** — Multi-layer parallax scrolling throughout every page
- **Multi-step Token Booking** — Smooth 3-step form with cinematic transitions
- **Admin Dashboard** — Complete queue control with hourly charts
- **Print-Ready Tickets** — QR-coded thermal/A5 print format
- **Confetti Celebrations** — Token reveal with particle effects
- **Custom Cursor** — Animated cursor follower with hover states
- **Infinite Text Marquee** — Velocity-responsive scrolling ticker
- **3D Tilt Cards** — Mouse-tracking perspective transforms on department cards

## 🌐 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v3
- Framer Motion v11
- Three.js + React Three Fiber + Drei
- React Router DOM v6
- React Hook Form + Zod
- Recharts, QRCode.react, Canvas Confetti

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.IO

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install server dependencies
cd server
npm install

# Seed the database with departments
npm run seed

# Start the server
npm run dev
```

```bash
# In a new terminal — Install client dependencies
cd client
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/mediqueue
JWT_SECRET=mediqueue_secret_2026
PORT=5000
CLIENT_URL=http://localhost:5173
```

## 🔑 Admin Access

- **Username:** `admin`
- **Password:** `admin123`

## 📁 Project Structure

```
├── client/                    # React Frontend
│   ├── src/
│   │   ├── animations/        # Framer Motion variants & parallax config
│   │   ├── components/        # 13 React components
│   │   ├── context/           # Token context with Socket.IO
│   │   ├── hooks/             # useParallax, useScrollProgress, useToken
│   │   ├── pages/             # 5 pages with full animations
│   │   ├── services/          # Axios API service
│   │   ├── App.jsx            # Router + AnimatePresence + Cursor
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── server/                    # Express Backend
│   ├── config/                # MongoDB connection
│   ├── controllers/           # Token, Patient, Admin logic
│   ├── middleware/             # Auth + error handler
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Token generator
│   ├── seed.js                # Department seeder
│   └── server.js              # Entry point with Socket.IO
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tokens/generate` | Generate new token |
| GET | `/api/tokens/queue/:deptId` | Get department queue |
| GET | `/api/tokens/:tokenNumber` | Get token details |
| PATCH | `/api/tokens/:id/status` | Update token status |
| GET | `/api/tokens/today` | Get today's tokens |
| POST | `/api/patients` | Create patient |
| GET | `/api/departments` | List departments |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/stats` | Dashboard stats |
| POST | `/api/admin/next/:deptId` | Call next token |
| GET | `/api/admin/export` | Export CSV |
| DELETE | `/api/admin/reset/:deptId` | Reset queue |

## 🎭 Animation Highlights

- **4-layer hero parallax** with independent scroll speeds
- **12 floating medical icons** with unique timing and parallax drift
- **Infinite marquee** ticker with scroll-velocity response
- **3D tilt cards** with cursor-tracking glow effect
- **Sticky scroll** "How It Works" with progress line
- **Page transitions** with blur/slide AnimatePresence
- **Token reveal** with 3D flip, confetti, and counter animation
- **Custom cursor** with spring-lagged ring follower

---

Built with ❤️ for better healthcare.