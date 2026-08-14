# Online Learning Management System

A full-stack Learning Management System built with **Node.js**, **React.js**, **PostgreSQL** and **Razorpay** payment gateway.

## Tech Stack

**Frontend**
- React.js + Vite
- Redux Toolkit
- Tailwind CSS
- React Router DOM

**Backend**
- Node.js + Express.js
- Sequelize ORM
- PostgreSQL (Neon.tech)
- JWT Authentication
- Razorpay Payment Gateway
- Swagger API Docs
- Winston Logging

## Features

- Student registration and login
- Browse and search courses
- Add to cart and purchase via Razorpay
- Track enrolled courses and progress
- Instructor dashboard to manage courses
- Admin dashboard
- JWT + Refresh token authentication
- Role-based access control (Student, Instructor, Admin)

## Project Structure

```
OnlineLearningPlatform/
├── backend/          ← Node.js + Express API
├── frontend/         ← React.js UI
└── database/         ← SQL scripts
```

## Getting Started

### Backend
```bash
cd backend
npm install
# Add .env file with your credentials
node src/server.js
```

### Frontend
```bash
cd frontend/online-learning-ui
npm install
npm run dev
```

## API Documentation
Swagger UI available at `http://localhost:5000/api/docs`

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
